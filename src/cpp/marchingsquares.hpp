
#ifndef __AUTUMNPLOT_MARCHINGSQUARES_H__
#define __AUTUMNPLOT_MARCHINGSQUARES_H__

#include <vector>

template<typename T>
bool isClose_(T a, T b) {
    const T rel_tol = 1e-6;
    const T abs_tol = 0.;

    return abs(a - b) <= std::max(rel_tol * std::max(abs(a), abs(b)), abs_tol);
}

template bool isClose_(float a, float b);

struct Point {
    float x;
    float y;

    Point(float x, float y) : x(x), y(y) {}
    Point(const Point& other) : x(other.x), y(other.y) {}

    bool operator==(const Point& other) const noexcept {
        return this->x == other.x && this->y == other.y;
    }

    bool isClose(const Point& other) const noexcept {
        return isClose_(this->x, other.x) && isClose_(this->y, other.y);
    } 

    friend std::ostream& operator<<(std::ostream& stream, const Point& point) {
        stream << "{" << point.x << ", " << point.y << "}";
        return stream;
    }
};

template<>
struct std::hash<Point> {
    std::size_t operator()(const Point& pt) const noexcept {
        std::size_t h1 = std::hash<float>{}(pt.x);
        std::size_t h2 = std::hash<float>{}(pt.y);
        return h1 ^ (h2 << 1);
    }
};

struct Contour {
    std::vector<Point> point_list;
    float value;

    Contour(const std::vector<Point>& point_list, const float value) noexcept : point_list(point_list), value(value) {};

    bool isClose(const Contour& other) const noexcept {
        bool equals = this->value == other.value && this->point_list.size() == other.point_list.size();
        if (!equals) return equals;

        for (int idx = 0; idx < this->point_list.size(); idx++) {
            equals &= this->point_list[idx].isClose(other.point_list[idx]);
        }

        return equals;
    }

    Contour& operator=(const Contour& other) noexcept {
        this->point_list = other.point_list;
        return *this;
    }

    friend std::ostream& operator<<(std::ostream& stream, const Contour& frag) {
        stream << "Contour: ";
        auto it = frag.point_list.begin();

        stream << *it;
        ++it;

        for (; it != frag.point_list.end(); ++it) {
            stream << ", " << *it;
        }
        return stream;
    }
};

template<typename T>
std::vector<Contour> makeContours(const T* grid, const float* xs, const float* ys, const int nx, const int ny, const std::vector<float>& values, const bool quad_as_tri);

template<typename T>
std::vector<float> getContourLevels(T* grid, int nx, int ny, float interval) noexcept;

#endif