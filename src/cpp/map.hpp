
#include <cmath>
#include <iostream>
#include <algorithm>
#include <type_traits>
#include <utility>

struct GridPoint {
    float x;
    float y;

    GridPoint(const float x, const float y) : x(x), y(y) {}
    GridPoint(const double x, const double y) : x(x), y(y) {}
    GridPoint(const GridPoint& other) : x(other.x), y(other.y) {}

    friend std::ostream& operator<<(std::ostream& stream, const GridPoint& point) {
        stream << "{x=" << point.x << ", y=" << point.y << "}";
        return stream;
    }
};

template <typename T, typename=void>
struct is_grid_point_t : std::false_type {};

template <typename T>
struct is_grid_point_t<T, std::void_t<
    decltype(std::declval<T>().x),
    decltype(std::declval<T>().y)
>> : std::true_type {};

template <typename T>
inline constexpr bool is_grid_point = is_grid_point_t<T>::value;

struct EarthPoint {
    float lat;
    float lon;

    EarthPoint(const float lon, const float lat) : lon(lon), lat(lat) {}
    EarthPoint(const double lon, const double lat) : lon(lon), lat(lat) {}
    EarthPoint(const EarthPoint& other) : lon(other.lon), lat(other.lat) {}

    friend std::ostream& operator<<(std::ostream& stream, const EarthPoint& point) {
        stream << "{lon=" << point.lon << ", lat=" << point.lat << "}";
        return stream;
    }
};

template <typename T, typename=void>
struct is_earth_point_t : std::false_type {};

template <typename T>
struct is_earth_point_t<T, std::void_t<
    decltype(std::declval<T>().lon),
    decltype(std::declval<T>().lat)
>> : std::true_type {};

template <typename T>
inline constexpr bool is_earth_point = is_earth_point_t<T>::value;

template<typename T>
constexpr T degToRad(const T deg) {
    return deg * M_PI / 180;
}

template<typename T>
constexpr T radToDeg(const T rad) {
    return rad * 180 / M_PI;
}

template <typename T_FROM, typename T_TO>
class MapProjection {
    virtual T_TO transform(const T_FROM& pt) const = 0;
    virtual T_FROM transform_inverse(const T_TO& pt) const = 0;
};

class PlateCarree : MapProjection<EarthPoint, EarthPoint> {
    public:
    EarthPoint transform(const EarthPoint& pt) const {
        return pt;
    }

    EarthPoint transform_inverse(const EarthPoint& pt) const {
        return pt;
    }
};

// Formulas from https://pubs.usgs.gov/pp/1395/report.pdf
class LambertConformalConic : MapProjection<EarthPoint, GridPoint> {
    private:
    double lon_0;
    double lat_0;
    double lat_std_1;
    double lat_std_2;

    // WGS 84 spheroid
    const double semimajor = 6378137.0;
    const double semiminor = 6356752.314245;
    const double eccen = sqrt(1 - (this->semiminor * this->semiminor) / (this->semimajor * this->semimajor));
    const double eccen2 = eccen * eccen;
    const double eccen4 = eccen2 * eccen2;
    const double eccen6 = eccen4 * eccen2;
    const double eccen8 = eccen6 * eccen2;

    const double Ap = this->eccen2 / 2 + 5 * this->eccen4 / 24 + 3 * this->eccen6 / 120 - 73 * this->eccen8 / 2016;
    const double Bp = 7 * this->eccen4 / 24 + 29 * this->eccen6 / 120 + 233 * this->eccen8 / 6720;
    const double Cp = 7 * this->eccen6 / 30 + 81 * this->eccen8 / 280;
    const double Dp = 4729 * this->eccen8 / 20160;

    double F, n;
    double rho_0;

    double computeT(const double lat) const {
        const double sin_lat = sin(lat);
        return tan(M_PI / 4 - lat / 2) * pow((1 + this->eccen * sin_lat) / (1 - this->eccen * sin_lat), this->eccen / 2);
    }

    double computeM(const double lat) const {
        const double sin_lat = sin(lat);
        return cos(lat) / sqrt(1 - this->eccen2 * sin_lat * sin_lat);
    }

    public:
    LambertConformalConic(const float lon_0, const float lat_0, const float lat_std_1, const float lat_std_2) {
        this->lon_0 = degToRad(lon_0);
        this->lat_0 = degToRad(lat_0);
        this->lat_std_1 = degToRad(lat_std_1);
        this->lat_std_2 = degToRad(lat_std_2);

        const double t_0 = this->computeT(this->lat_0);

        const double t_1 = this->computeT(this->lat_std_1);
        const double m_1 = this->computeM(this->lat_std_1);

        if (this->lat_std_1 != this->lat_std_2) {
            const double t_2 = this->computeT(this->lat_std_2);
            const double m_2 = this->computeM(this->lat_std_2);

            this->n = log(m_1 / m_2) / log(t_1 / t_2);
        }
        else {
            this->n = sin(this->lat_std_1);
        }

        this->F = m_1 / (this->n * pow(t_1, this->n));

        this->rho_0 = this->semimajor * this->F * pow(t_0, this->n);
    }

    LambertConformalConic(const LambertConformalConic& other) : lon_0(other.lon_0), lat_0(other.lat_0), lat_std_1(other.lat_std_1), lat_std_2(other.lat_std_2),
                                                                n(other.n), F(other.F), rho_0(other.rho_0) {}

    GridPoint transform(const EarthPoint& pt) const {
        const double lon = degToRad(pt.lon);
        const double lat = degToRad(pt.lat);

        const double t = this->computeT(lat);
        const double rho = this->semimajor * this->F * pow(t, this->n);
        const double theta = this->n * (lon - this->lon_0);

        const double x = rho * sin(theta);
        const double y = this->rho_0 - rho * cos(theta);

        return GridPoint(x, y);
    }

    EarthPoint transform_inverse(const GridPoint& pt) const {
        const double theta = atan2(pt.x, this->rho_0 - pt.y);
        const double lon = theta / this->n + this->lon_0;
        const double rho = copysign(hypot(pt.x, this->rho_0 - pt.y), this->n);
        const double t = pow(rho / (this->semimajor * this->F), 1 / this->n);

        const double chi = M_PI / 2 - 2 * atan(t);
        const double sin_2chi = sin(2 * chi);
        const double cos_2chi = cos(2 * chi);

        const double lat = chi + sin_2chi * (this->Ap + cos_2chi * (this->Bp + cos_2chi * (this->Cp + this->Dp * cos_2chi)));

        return EarthPoint(radToDeg(lon), radToDeg(lat));
    }
};

class RotateSphere : MapProjection<EarthPoint, EarthPoint> { 
    double np_lat;
    double np_lon;
    double lon_shift;

    double sin_np_lat, cos_np_lat;

    public:
    RotateSphere(const float np_lon, const float np_lat, const float lon_shift) {
        this->np_lat = degToRad(np_lat);
        this->np_lon = degToRad(np_lon);
        this->lon_shift = degToRad(lon_shift);

        this->sin_np_lat = sin(this->np_lat);
        this->cos_np_lat = cos(this->np_lat);
    }

    RotateSphere(const RotateSphere& other) : np_lon(other.np_lon), np_lat(other.np_lat), lon_shift(other.lon_shift), sin_np_lat(other.sin_np_lat), cos_np_lat(other.cos_np_lat) {}

    EarthPoint transform(const EarthPoint& pt) const {
        const double lon = degToRad(pt.lon);
        const double lat = degToRad(pt.lat);

        const double sin_lat = sin(lat);
        const double cos_lat = cos(lat);
        const double sin_lon_diff = sin(lon - this->lon_shift);
        const double cos_lon_diff = cos(lon - this->lon_shift);

        const double lat_p = asin(this->sin_np_lat * sin_lat - this->cos_np_lat * cos_lat * cos_lon_diff);
        double lon_p = this->np_lon + atan2((cos_lat * sin_lon_diff), (this->sin_np_lat * cos_lat * cos_lon_diff + this->cos_np_lat * sin_lat));

        if (lon_p > M_PI) lon_p -= 2 * M_PI;

        return EarthPoint(radToDeg(lon_p), radToDeg(lat_p));
    }

    EarthPoint transform_inverse(const EarthPoint& pt) const {
        const double lon_p = degToRad(pt.lon);
        const double lat_p = degToRad(pt.lat);

        const double sin_lat_p = sin(lat_p);
        const double cos_lat_p = cos(lat_p);
        const double sin_lon_p_diff = sin(lon_p - this->np_lon);
        const double cos_lon_p_diff = cos(lon_p - this->np_lon);

        const double lat = asin(this->sin_np_lat * sin_lat_p + this->cos_np_lat * cos_lat_p * cos_lon_p_diff);
        double lon = lon_shift + atan2((cos_lat_p * sin_lon_p_diff), (this->sin_np_lat * cos_lat_p * cos_lon_p_diff - this->cos_np_lat * sin_lat_p));

        if (lon > M_PI) lon -= 2 * M_PI;

        return EarthPoint(radToDeg(lon), radToDeg(lat));
    }
};

class WebMercator : MapProjection<EarthPoint, GridPoint> {
    public:
    GridPoint transform(const EarthPoint& pt) const {
        const double sin_lat = sin(degToRad(pt.lat));

        const double x = (180 + pt.lon) / 360;
        const double y = (180 - 0.5 * radToDeg(log((1 + sin_lat) / (1 - sin_lat)))) / 360;
        return GridPoint(x, std::min(2., std::max(-2., y)));
    }

    EarthPoint transform_inverse(const GridPoint& pt) const {
        const double lon = 360 * pt.x - 180;
        const double lat = radToDeg(atan(sinh(degToRad(180 - pt.y * 360))));

        return EarthPoint(lon, lat);
    }
};

/*
int main(int argc, char** argv) {
    LambertConformalConic lcc(-97.5, 38.5, 38.5, 38.5);
    EarthPoint pt(-97.44, 35.18);

    std::cout << lcc.project(pt) << std::endl;
    std::cout << lcc.project_inverse(lcc.project(pt)) << std::endl;

    RotateSphere rs(180, 60, 0);
    std::cout << rs.transform(pt) << std::endl;
    std::cout << rs.transform_inverse(rs.transform(pt)) << std::endl;

    WebMercator wm;
    std::cout << wm.project(pt) << std::endl;
    std::cout << wm.project_inverse(wm.project(pt)) << std::endl;

    if constexpr (is_grid_point<GridPoint>) {
        std::cout << "Should print this" << std::endl;
    }

    return 0;
}
*/