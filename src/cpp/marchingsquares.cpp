
#include <vector>
#include <unordered_map>
#include "float16_t.hpp"

#ifdef EXECUTABLE
#include <iostream>
#endif

#include <iostream>
#include <chrono>
#include <cmath>

#ifdef WASM
#include <emscripten/bind.h>
#endif

using numeric::float16_t;

namespace std {
    constexpr inline bool isnan(float16_t __x) noexcept {
        return is_nan(__x);
    }
}

/*  8         4
 *   ┌───────┐
 *   │       │
 *   │       │
 *   └───────┘
 *  1         2
 */

#define NSEGS 2
#define NDIM 2

class Point {
    public:
        float x;
        float y;

        Point(float x, float y) : x(x), y(y) {}

        bool operator==(const Point& other) const noexcept {
            return this->x == other.x && this->y == other.y;
        }

#ifdef EXECUTABLE
        friend std::ostream& operator<<(std::ostream& stream, const Point& point) {
            stream << "{" << point.x << ", " << point.y << "}";
            return stream;
        }
#endif
};

template<>
struct std::hash<Point> {
    std::size_t operator()(const Point& pt) const noexcept {
        std::size_t h1 = std::hash<float>{}(pt.x);
        std::size_t h2 = std::hash<float>{}(pt.y);
        return h1 ^ (h2 << 1);
    }
};

class Contour {
    public:
        std::vector<Point> point_list;
        float value;

        Contour(float value) noexcept : value(value) {};

        Contour& operator=(const Contour& other) noexcept {
            this->point_list = other.point_list;
            return *this;
        }

#ifdef EXECUTABLE
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
#endif
};

const float MARCHING_SQUARES_SEGS[16][NSEGS][2][NDIM] = {
    {{{-1., -1.}, {-1., -1.}}, {{-1., -1.}, {-1., -1.}}}, // 0
    {{{0.5, 0.},  {0., 0.5}},  {{-1., -1.}, {-1., -1.}}}, // 1
    {{{1., 0.5},  {0.5, 0.}},  {{-1., -1.}, {-1., -1.}}}, // 2
    {{{1., 0.5},  {0., 0.5}},  {{-1., -1.}, {-1., -1.}}}, // 3
    {{{0.5, 1.},  {1., 0.5}},  {{-1., -1.}, {-1., -1.}}}, // 4
    {{{0.5, 0.},  {0., 0.5}},  {{0.5, 1.},  {1., 0.5}}},  // 5
    {{{0.5, 1.},  {0.5, 0.}},  {{-1., -1.}, {-1., -1.}}}, // 6
    {{{0.5, 1.},  {0., 0.5}},  {{-1., -1.}, {-1., -1.}}}, // 7
    {{{0., 0.5},  {0.5, 1.}},  {{-1., -1.}, {-1., -1.}}}, // 8
    {{{0.5, 0.},  {0.5, 1.}},  {{-1., -1.}, {-1., -1.}}}, // 9
    {{{1., 0.5},  {0.5, 0.}},  {{0., 0.5},  {0.5, 1.}}},  // 10
    {{{1., 0.5},  {0.5, 1.}},  {{-1., -1.}, {-1., -1.}}}, // 11
    {{{0., 0.5},  {1., 0.5}},  {{-1., -1.}, {-1., -1.}}}, // 12
    {{{0.5, 0.},  {1., 0.5}},  {{-1., -1.}, {-1., -1.}}}, // 13
    {{{0., 0.5},  {0.5, 0.}},  {{-1., -1.}, {-1., -1.}}}, // 14
    {{{-1., -1.}, {-1., -1.}}, {{-1., -1.}, {-1., -1.}}}, // 15
};

void searchInterval(std::vector<float>& vec, float val_lb, float val_ub, unsigned int& index_lb, unsigned int& index_ub) {
    unsigned int index = 0; 

    index_lb = 0;
    index_ub = vec.size() - 1;

    for (auto it = vec.begin(); it != (vec.end() - 1); ++it) {
        if (*it < val_lb && *(it + 1) > val_lb) index_lb = index + 1;
        if (*it < val_ub && *(it + 1) > val_ub) {
            index_ub = index;
            return;
        }

        index++;
    }
}

#define MIN(a, b) (a < b ? a : b)
#define MIN4(a, b, c, d) (MIN(MIN(a, b), MIN(c, d)))
#define MAX(a, b) (a > b ? a : b)
#define MAX4(a, b, c, d) (MAX(MAX(a, b), MAX(c, d)))

template<typename T>
std::vector<Contour> makeContours(T* grid, float* xs, float* ys, int nx, int ny, std::vector<float>& values) {
    T esw, ese, enw, ene;
    char segs_idx;
    std::vector<Contour> contours;
    std::unordered_map<float, std::unordered_map<Point, Contour*>> contour_frags_by_start;
    std::unordered_map<float, std::unordered_map<Point, Contour*>> contour_frags_by_end;

    if (values.size() == 0) {
        return contours;
    }

    for (int i = 0; i < nx - 1; i++) {
        for (int j = 0; j < ny - 1; j++) {
            esw = grid[i + nx * j];
            ese = grid[(i + 1) + nx * j];
            enw = grid[i + nx * (j + 1)];
            ene = grid[(i + 1) + nx * (j + 1)];

            if (std::isnan(esw) || std::isnan(ese) || std::isnan(enw) || std::isnan(ene)) continue;

            T min_grid_val = MIN4(esw, ese, enw, ene);
            T max_grid_val = MAX4(esw, ese, enw, ene);
            unsigned int val_idx_lb, val_idx_ub;
            searchInterval(values, min_grid_val, max_grid_val, val_idx_lb, val_idx_ub);

            for (unsigned int idx = val_idx_lb; idx <= val_idx_ub; idx++) {
                float value = values[idx];

                segs_idx = char((float)esw > value) + (char((float)ese > value) << 1) + (char((float)ene > value) << 2) + (char((float)enw > value) << 3);

                if (segs_idx == 5 && abs((float)(esw + ene) * 0.5 - value) > abs((float)(ese + enw) * 0.5 - value)) {
                    segs_idx = 10;
                }
                else if (segs_idx == 10 && abs((float)(esw + ene) * 0.5 - value) < abs((float)(ese + enw) * 0.5 - value)) {
                    segs_idx = 5;
                }

                for (int iseg = 0; iseg < NSEGS; iseg++) {
                    if (MARCHING_SQUARES_SEGS[segs_idx][iseg][0][0] < 0) continue;

                    const float* start_seg_pt = MARCHING_SQUARES_SEGS[segs_idx][iseg][0];
                    Point start_pt = Point(start_seg_pt[0] + i, start_seg_pt[1] + j);

                    const float* end_seg_pt = MARCHING_SQUARES_SEGS[segs_idx][iseg][1];
                    Point end_pt = Point(end_seg_pt[0] + i, end_seg_pt[1] + j);

                    bool start_seen = contour_frags_by_end[value].find(start_pt) != contour_frags_by_end[value].end();
                    bool end_seen = contour_frags_by_start[value].find(end_pt) != contour_frags_by_start[value].end();

                    if (start_seen && end_seen) {
                        // This segment joins two other contour fragments we've seen
                        Contour* frag1 = contour_frags_by_end[value][start_pt];
                        Contour* frag2 = contour_frags_by_start[value][end_pt];

                        if (frag1 != frag2) {
                            // This is really two different contour fragments, so we need to splice them together
                            frag1->point_list.insert(frag1->point_list.end(), frag2->point_list.begin(), frag2->point_list.end());
                        }
                        else {
                            // This is actually the same contour fragment, so we're closing it.
                            frag1->point_list.push_back(frag2->point_list.front());
                            contours.push_back(*frag1);
                        }

                        contour_frags_by_start[value].erase(end_pt);
                        contour_frags_by_end[value].erase(start_pt);

                        if (frag1 != frag2) {
                            // This contour isn't closed yet, so put it back in the maps
                            contour_frags_by_start[value][frag1->point_list.front()] = frag1;
                            contour_frags_by_end[value][frag1->point_list.back()] = frag1;

                            delete frag2;
                            frag2 = NULL;
                        }
                        else {
                            delete frag1;
                            frag1 = NULL;
                        }
                    }
                    else if (start_seen) {
                        // The starting point for this segment is the ending point for some other contour
                        Contour* frag = contour_frags_by_end[value][start_pt];
                        frag->point_list.push_back(end_pt);

                        contour_frags_by_end[value].erase(start_pt);
                        contour_frags_by_end[value][end_pt] = frag;
                    } 
                    else if (end_seen) {
                        // The ending point for this segment is the start point for some other contour
                        Contour* frag = contour_frags_by_start[value][end_pt];
                        frag->point_list.insert(frag->point_list.begin(), start_pt);

                        contour_frags_by_start[value].erase(end_pt);
                        contour_frags_by_start[value][start_pt] = frag;
                    }
                    else {
                        // New contour segment
                        Contour* frag = new Contour(value);
                        frag->point_list.push_back(start_pt);
                        frag->point_list.push_back(end_pt);

                        contour_frags_by_start[value][start_pt] = frag;
                        contour_frags_by_end[value][end_pt] = frag;
                    }
                }
            }
        }
    }

    for (auto vit = values.begin(); vit != values.end(); ++vit) {
        float value = *vit;

        // The contours that intersect the edge of the grid will still be in the "fragments" maps, so add them to the contour list
        for (auto it = contour_frags_by_start[value].begin(); it != contour_frags_by_start[value].end(); ++it) {
            Contour* contour = it->second;
            contours.push_back(*contour);

            delete contour;
            contour = NULL;
        }
    }

    // Do the actual interpolation
    for (auto it = contours.begin(); it != contours.end(); ++it) {
        float value = it->value;

        for (auto plit = it->point_list.begin(); plit != it->point_list.end(); ++plit) {
            float x_floor = floorf(plit->x), y_floor = floorf(plit->y);
            int i = static_cast<int>(x_floor), j = static_cast<int>(y_floor);
            
            if (x_floor != plit->x) {
                float grid1 = static_cast<float>(grid[i + j * nx]);
                float grid2 = static_cast<float>(grid[(i + 1) + j * nx]);
                float alpha = (value - grid1) / (grid2 - grid1);
                plit->x = xs[i] * (1 - alpha) + xs[i + 1] * alpha;
            }
            else {
                plit->x = xs[i];
            }

            if (y_floor != plit->y) {
                float grid1 = static_cast<float>(grid[i + j * nx]);
                float grid2 = static_cast<float>(grid[i + (j + 1) * nx]);
                float alpha = (value - grid1) / (grid2 - grid1);
                plit->y = ys[j] * (1 - alpha) + ys[j + 1] * alpha;
            }
            else {
                plit->y = ys[j];
            }
        }
    }

    return contours;
};

template std::vector<Contour> makeContours(float* grid, float* xs, float* ys, int nx, int ny, std::vector<float>& value);
template std::vector<Contour> makeContours(float16_t* grid, float* xs, float* ys, int nx, int ny, std::vector<float>& value);

template<typename T>
std::vector<float> getContourLevels(T* grid, int nx, int ny, float interval) noexcept {
    T minval = std::numeric_limits<T>::infinity(), maxval = -std::numeric_limits<T>::infinity();
    for (int idx = 0; idx < nx * ny; idx++) {
        if (std::isnan(grid[idx])) continue;

        minval = MIN(minval, grid[idx]);
        maxval = MAX(maxval, grid[idx]);
    }

    float lowest_contour = ceilf((float)minval / interval) * interval, highest_contour = floorf((float)maxval / interval) * interval;
    unsigned int n_contours = (unsigned int)floorf((highest_contour - lowest_contour) / interval) + 1;

    std::vector<float> levels;
    levels.resize(n_contours);

    for (int icntr = 0; icntr < n_contours; icntr++) {
        levels[icntr] = lowest_contour + icntr * interval;
    }

    return levels;
};

template std::vector<float> getContourLevels(float* grid, int nx, int ny, float interval);
template std::vector<float> getContourLevels(float16_t* grid, int nx, int ny, float interval);

#ifdef EXECUTABLE
int main(int argc, char** argv) {
    const int nx = 8;
    const int ny = 6;
    float grid[nx * ny] = {
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 2, 1, 1, 1, 1, 0, 0,
        0, 1, 0, 1, 0, 1, 0, 0,
        0, 1, 1, 0, 1, 1, 0, 0,
        0, 1, 1, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 1, 0, 0, 0
    };

    float x_grid[nx] = {0, 10, 20, 30, 40, 50, 60, 70};
    float y_grid[ny] = {0, 10, 20, 30, 40, 50};

    std::vector<LineString> contours = makeContours(grid, x_grid, y_grid, nx, ny, 0.5);

    for (auto it = contours.begin(); it != contours.end(); ++it) {
        std::cout << *it << '\n';
    }

    return 0;
}
#endif

#ifdef WASM

void checkGridSize(size_t grid_size, int nx, int ny) {
    if (nx * ny != grid_size) {
        std::string error = "Mismatch between the length of the vector and nx and ny";
        throw std::invalid_argument(error);
    }
}

template<typename T>
emscripten::val makeContoursWASM(const emscripten::val& data, const emscripten::val& xs, const emscripten::val& ys, const emscripten::val& values,
                                 const emscripten::val& grid_transformer) {
    auto memory = emscripten::val::module_property("HEAPU8")["buffer"];

    int nx = xs["length"].as<int>();
    int ny = ys["length"].as<int>();

    checkGridSize(data["length"].as<int>(), nx, ny);

    auto t0 = std::chrono::steady_clock::now();
    float* xs_ary = new float[nx];
    auto xs_memview = xs["constructor"].new_(memory, reinterpret_cast<uintptr_t>(xs_ary), nx);
    xs_memview.call<void>("set", xs);

    float* ys_ary = new float[ny];
    auto ys_memview = ys["constructor"].new_(memory, reinterpret_cast<uintptr_t>(ys_ary), ny);
    ys_memview.call<void>("set", ys);

    T* data_ary = new T[nx * ny];
    auto data_memview = data["constructor"].new_(memory, reinterpret_cast<uintptr_t>(data_ary), nx * ny);
    data_memview.call<void>("set", data);

    int n_levels = values["length"].as<int>();
    std::vector<float> levels(n_levels, 0);
    for (int ilev = 0; ilev < n_levels; ilev++) {
        levels[ilev] = values[ilev].as<float>();
    }

    auto t1 = std::chrono::steady_clock::now();

    std::vector<Contour> contours = makeContours(data_ary, xs_ary, ys_ary, nx, ny, levels);

    auto t2 = std::chrono::steady_clock::now();
 
    delete[] xs_ary;
    delete[] ys_ary;
    delete[] data_ary;

    auto t3 = std::chrono::steady_clock::now();

    emscripten::val js_contours = emscripten::val::object();
    std::unordered_map<float, int> js_contours_added;

    for (auto it = contours.begin(); it != contours.end(); ++it) {
        float value = it->value;

        if (js_contours_added.find(value) == js_contours_added.end()) {
            js_contours.set(value, emscripten::val::array());
            js_contours_added[value] = 0;
        }

        int contour_index = js_contours_added[value]++;
        js_contours[value].call<void>("push", emscripten::val::array());

        for (auto plit = it->point_list.begin(); plit != it->point_list.end(); ++plit) {
            auto pt_trans = grid_transformer(plit->x, plit->y);
            js_contours[value][contour_index].call<void>("push", pt_trans);
        }
    }
    auto t4 = std::chrono::steady_clock::now();

#ifdef PROFILE
    std::cout << "Time to Unpack: " << std::chrono::duration_cast<std::chrono::microseconds>(t1 - t0).count() / 1000. << " ms" << std::endl;
    std::cout << "Time to Contour: " << std::chrono::duration_cast<std::chrono::microseconds>(t2 - t1).count() / 1000. << " ms" << std::endl;
    std::cout << "Time to Delete: " << std::chrono::duration_cast<std::chrono::microseconds>(t3 - t2).count() / 1000. << " ms" << std::endl;
    std::cout << "Time to Pack: " << std::chrono::duration_cast<std::chrono::microseconds>(t4 - t3).count() / 1000. << " ms" << std::endl;
#endif

    return js_contours;
}

template<typename T>
emscripten::val getContourLevelsWASM(const emscripten::val& grid, int nx, int ny, float interval) {
    auto memory = emscripten::val::module_property("HEAPU8")["buffer"];

    checkGridSize(grid["length"].as<int>(), nx, ny);

    T* grid_ary = new T[nx * ny];
    auto grid_memview = grid["constructor"].new_(memory, reinterpret_cast<uintptr_t>(grid_ary), nx * ny);
    grid_memview.call<void>("set", grid);

    std::vector<float> levels = getContourLevels(grid_ary, nx, ny, interval);

    delete[] grid_ary;

    emscripten::val js_levels = emscripten::val::array();

    for (auto lit = levels.begin(); lit != levels.end(); ++lit) {
        js_levels.call<void>("push", *lit);
    }

    return js_levels;
}

EMSCRIPTEN_BINDINGS(marching_squares) {
    emscripten::function("makeContoursFloat32", &makeContoursWASM<float>);
    emscripten::function("makeContoursFloat16", &makeContoursWASM<float16_t>);
    emscripten::function("getContourLevelsFloat32", &getContourLevelsWASM<float>);
    emscripten::function("getContourLevelsFloat16", &getContourLevelsWASM<float16_t>);
}

#endif