
import mapboxgl from 'mapbox-gl';
import maplibregl from 'maplibre-gl';

type MapType = mapboxgl.Map | maplibregl.Map;

interface LambertConformalConicParameters {
    lon_0: number,
    lat_0: number,
    lat_std: [number, number] | number;
}

function lambertConformalConic(params: LambertConformalConicParameters) {
    // Formulas from https://pubs.usgs.gov/pp/1395/report.pdf

    const compute_t = (lat: number) => {
        const sin_lat = Math.sin(lat);
        return Math.tan(Math.PI / 4 - lat / 2) * Math.pow((1 + eccen * sin_lat) / (1 - eccen * sin_lat), eccen / 2);
    };
    const compute_m = (lat: number) => {
        const sin_lat = Math.sin(lat);
        return Math.cos(lat) / Math.sqrt(1 - eccen * eccen * sin_lat * sin_lat);
    }

    // WGS 84 spheroid
    const semimajor = 6378137.0;
    const semiminor = 6356752.314245;
    const eccen = Math.sqrt(1 - (semiminor * semiminor) / (semimajor * semimajor));
    const radians = Math.PI / 180;

    let {lon_0, lat_0, lat_std} = params;
    lat_std = Array.isArray(lat_std) && lat_std[0] == lat_std[1] ? lat_std[0] : lat_std;

    lon_0 *= radians;
    lat_0 *= radians;

    let F: number, n: number;
    const t_0 = compute_t(lat_0);

    if (Array.isArray(lat_std)) {
        let [lat_1, lat_2] = lat_std;
        lat_1 *= radians;
        lat_2 *= radians;

        const t_1 = compute_t(lat_1);
        const t_2 = compute_t(lat_2);
        const m_1 = compute_m(lat_1);
        const m_2 = compute_m(lat_2);

        n = Math.log(m_1 / m_2) / Math.log(t_1 / t_2);
        F = m_1 / (n * Math.pow(t_1, n));
    }
    else {
        let lat_1 = lat_std;
        lat_1 *= radians;

        const t_1 = compute_t(lat_1);
        const m_1 = compute_m(lat_1);
        n = Math.sin(lat_1);
        F = m_1 / (n * Math.pow(t_1, n));
    }

    const rho_0 = semimajor * F * Math.pow(t_0, n);

    const compute_lcc = (lon: number, lat: number) : [number, number] => {
        lon *= radians;
        lat *= radians;

        const t = compute_t(lat);
        const rho = semimajor * F * Math.pow(t, n);
        const theta = n * (lon - lon_0);
        const x = rho * Math.sin(theta);
        const y = rho_0 - rho * Math.cos(theta);

        return [x, y];
    }

    const eccen2 = eccen * eccen;
    const eccen4 = eccen2 * eccen2;
    const eccen6 = eccen4 * eccen2;
    const eccen8 = eccen6 * eccen2;

/*
    const A = eccen2 / 2 + 5 * eccen4 / 24 + eccen6 / 12 + 13 * eccen8 / 360;
    const B = 7 * eccen4 / 48 + 29 * eccen6 / 240 + 811 * eccen8 / 11520;
    const C = 7 * eccen6 / 120 + 81 * eccen8 / 1120;
    const D = 4279 * eccen8 / 161280;
    const Ap = A - C;
    const Bp = 2 * B - 4 * D;
    const Cp = 4 * C;
    const Dp = 8 * D;
*/

    const Ap = eccen2 / 2 + 5 * eccen4 / 24 + 3 * eccen6 / 120 - 73 * eccen8 / 2016;
    const Bp = 7 * eccen4 / 24 + 29 * eccen6 / 120 + 233 * eccen8 / 6720;
    const Cp = 7 * eccen6 / 30 + 81 * eccen8 / 280;
    const Dp = 4729 * eccen8 / 20160;

    const compute_lcc_inverse = (x: number, y: number) : [number, number] => {
        const theta = Math.atan2(x, rho_0 - y); // These arguments are backwards from what I'd expect ...
        const lon = theta / n + lon_0;
        const rho = Math.hypot(x, rho_0 - y) * Math.sign(n);
        const t = Math.pow(rho / (semimajor * F), 1 / n);

        const chi = Math.PI / 2 - 2 * Math.atan(t);
        const sin_2chi = Math.sin(2 * chi);
        const cos_2chi = Math.cos(2 * chi);

        const lat = chi + sin_2chi * (Ap + cos_2chi * (Bp + cos_2chi * (Cp + Dp * cos_2chi)));

        return [lon / radians, lat / radians];
    }

    return (a: number, b: number, opts?: {inverse: boolean}) : [number, number] => {
        opts = opts === undefined ? {inverse: false} : opts;
        return opts.inverse ? compute_lcc_inverse(a, b) : compute_lcc(a, b);
    }
}

interface RotateSphereParams {
    np_lon: number,
    np_lat: number,
    lon_shift: number,
}

function rotateSphere(params: RotateSphereParams) {
    const radians = Math.PI / 180;
    const np_lat = params.np_lat * radians;
    const np_lon = params.np_lon * radians;
    const lon_shift = params.lon_shift * radians;

    const sin_np_lat = Math.sin(np_lat);
    const cos_np_lat = Math.cos(np_lat);

    const compute_rotation = (lon: number, lat: number) : [number, number] => {
        lon *= radians;
        lat *= radians;

        const sin_lat = Math.sin(lat);
        const cos_lat = Math.cos(lat);
        const sin_lon_diff = Math.sin(lon - lon_shift);
        const cos_lon_diff = Math.cos(lon - lon_shift);

        const lat_p = Math.asin(sin_np_lat * sin_lat - cos_np_lat * cos_lat * cos_lon_diff);
        let lon_p = np_lon + Math.atan2((cos_lat * sin_lon_diff), (sin_np_lat * cos_lat * cos_lon_diff + cos_np_lat * sin_lat));

        if (lon_p > Math.PI) lon_p -= 2 * Math.PI;

        return [lon_p / radians, lat_p / radians];
    }

    const compute_rotation_inverse = (lon_p: number, lat_p: number) : [number, number] => {
        lon_p *= radians;
        lat_p *= radians;

        const sin_lat_p = Math.sin(lat_p);
        const cos_lat_p = Math.cos(lat_p);
        const sin_lon_p_diff = Math.sin(lon_p - np_lon);
        const cos_lon_p_diff = Math.cos(lon_p - np_lon);

        const lat = Math.asin(sin_np_lat * sin_lat_p + cos_np_lat * cos_lat_p * cos_lon_p_diff);
        let lon = lon_shift + Math.atan2((cos_lat_p * sin_lon_p_diff), (sin_np_lat * cos_lat_p * cos_lon_p_diff - cos_np_lat * sin_lat_p));

        if (lon_p > Math.PI) lon_p -= 2 * Math.PI;

        return [lon / radians, lat / radians];
    }

    return (a: number, b: number, opts?: {inverse: boolean}) => {
        opts = opts === undefined ? {inverse: false} : opts;
        return opts.inverse ? compute_rotation_inverse(a, b) : compute_rotation(a, b);
    }
}

function mercatorXfromLng(lng: number) {
    return (180 + lng) / 360;
}

function mercatorYfromLat(lat: number) {
    return (180 - (180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)))) / 360;
}

/**
 * A `LngLat` object represents a given longitude and latitude coordinate, measured in degrees.
 * These coordinates are based on the [WGS84 (EPSG:4326) standard](https://en.wikipedia.org/wiki/World_Geodetic_System#WGS84).
 *
 * MapLibre GL uses longitude, latitude coordinate order (as opposed to latitude, longitude) to match the
 * [GeoJSON specification](https://tools.ietf.org/html/rfc7946).
 *
 * @param {number} lng Longitude, measured in degrees.
 * @param {number} lat Latitude, measured in degrees.
 * @example
 * var ll = new LngLat(-123.9749, 40.7736);
 * ll.lng; // = -123.9749
 */
 class LngLat {
    public lng: number;
    public lat: number;

    constructor(lng: number, lat: number) {
        if (isNaN(lng) || isNaN(lat)) {
            throw new Error(`Invalid LngLat object: (${lng}, ${lat})`);
        }
        this.lng = +lng;
        this.lat = +lat;
        if (this.lat > 90 || this.lat < -90) {
            throw new Error('Invalid LngLat latitude value: must be between -90 and 90');
        }
    }

    public toMercatorCoord() {
        return {x: mercatorXfromLng(this.lng), y: mercatorYfromLat(this.lat)};
    }
}

export {LngLat, lambertConformalConic, rotateSphere};
export type {MapType};