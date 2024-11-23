
#include <chrono>
#include <iostream>
#include <cmath>

#include <emscripten/bind.h>

#include "float16_t.hpp"
#include "marchingsquares.hpp"
#include "map.hpp"

using numeric::float16_t;

template<typename P, typename T>
class StructuredGrid {
    unsigned int ni, nj;
    T ll_crnr, ur_crnr;
    P projection;

    public:
    StructuredGrid(unsigned int ni, unsigned int nj, const T& ll_crnr, const T& ur_crnr, const P& projection) : ni(ni), nj(nj), ll_crnr(ll_crnr), ur_crnr(ur_crnr), projection(projection) {}
    StructuredGrid(const StructuredGrid& other) : ni(other.ni), nj(other.nj), ll_crnr(other.ll_crnr), ur_crnr(other.ur_crnr), projection(other.projection) {}
    
    T getGridCoord(unsigned int i, unsigned int j) const {
        if constexpr (is_earth_point<T>) {
            const float dlon = (this->ur_crnr.lon - this->ll_crnr.lon) / (this->ni - 1);
            const float dlat = (this->ur_crnr.lat - this->ll_crnr.lat) / (this->nj - 1);

            return T(this->ll_crnr.lon + i * dlon, this->ll_crnr.dlat + j * dlat);
        }
        else {
            const float dx = (this->ur_crnr.x - this->ll_crnr.x) / this->ni;
            const float dy = (this->ur_crnr.y - this->ll_crnr.y) / this->nj;

            return T(this->ll_crnr.x + i * dx, this->ll_crnr.y + j * dy);
        }
    }

    emscripten::val getMapCoords(const emscripten::val& simplify_ni_, const emscripten::val& simplify_nj_) const {
        const unsigned int simplify_ni = simplify_ni_.as<unsigned int>();
        const unsigned int simplify_nj = simplify_nj_.as<unsigned int>();

        WebMercator map_crs;

        std::vector<float> xs(this->ni * this->nj);
        std::vector<float> ys(this->ni * this->nj);

        for (int i = 0; i < this->ni; i++) {
            for (int j = 0; j < this->nj; j++) {
                const int idx = i + ni * j;
                T grid_coord = this->getGridCoord(i, j);
                EarthPoint earth_coord = this->projection.transform_inverse(grid_coord);
                GridPoint map_coord = map_crs.transform(earth_coord);

                xs[idx] = map_coord.x;
                ys[idx] = map_coord.y;
            }
        }

        auto memory = emscripten::val::module_property("HEAPU8")["buffer"];
        auto xs_ary = emscripten::val::global("Float32Array").new_(memory, reinterpret_cast<uintptr_t>(xs.data()), xs.size());
        auto ys_ary = emscripten::val::global("Float32Array").new_(memory, reinterpret_cast<uintptr_t>(ys.data()), ys.size());

        auto coords_obj = emscripten::val::object();
        coords_obj.set("x", xs_ary);
        coords_obj.set("y", ys_ary);

        return coords_obj;
    }

    emscripten::val getVectorRotation() const {
        std::vector<float> rot_vals(this->ni * this->nj);

        for (int i = 0; i < this->ni; i++) {
            for (int j = 0; j < this->nj; j++) {
                const int idx = i + ni * j;

                T grid_coord = this->getGridCoord(i, j);
                EarthPoint earth_coord = this->projection.transform_inverse(grid_coord);
                T grid_coord_pert = this->projection.transform(EarthPoint(earth_coord.lon + 0.01f, earth_coord.lat));

                if constexpr (is_earth_point<T>) {
                    rot_vals[idx] = atan2(grid_coord_pert.lat - grid_coord.lat, grid_coord_pert.lon - grid_coord.lon);
                }
                else {
                    rot_vals[idx] = atan2(grid_coord_pert.y - grid_coord.y, grid_coord_pert.x - grid_coord.x);
                }
            }
        }

        auto memory = emscripten::val::module_property("HEAPU8")["buffer"];
        auto ary = emscripten::val::global("Float32Array").new_(memory, reinterpret_cast<uintptr_t>(rot_vals.data()), rot_vals.size());

        return ary;
    }
};

class LambertGrid : public StructuredGrid<LambertConformalConic, GridPoint> {
    public:
    LambertGrid(unsigned int ni, unsigned int nj, float lon_0, float lat_0, float lat_std_1, float lat_std_2,
                float ll_x, float ll_y, float ur_x, float ur_y) : StructuredGrid(ni, nj, GridPoint(ll_x, ll_y), GridPoint(ur_x, ur_y),
                                                                                 LambertConformalConic(lon_0, lat_0, lat_std_1, lat_std_2)) {}
};

void checkGridSize(size_t grid_size, int nx, int ny) {
    if (nx * ny != grid_size) {
        std::string error = "Mismatch between the length of the vector and nx and ny";
        throw std::invalid_argument(error);
    }
}

template<typename T>
emscripten::val makeContoursWASM(const emscripten::val& data, const emscripten::val& xs, const emscripten::val& ys, const emscripten::val& values,
                                 const emscripten::val& grid_transformer, const emscripten::val& quad_as_tri_) {
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

    bool quad_as_tri = quad_as_tri_.as<bool>();

    auto t1 = std::chrono::steady_clock::now();

    std::vector<Contour> contours = makeContours(data_ary, xs_ary, ys_ary, nx, ny, levels, quad_as_tri);

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
    emscripten::class_<LambertGrid>("CppLambertGrid")
        .constructor<unsigned int, unsigned int, float, float, float, float, float, float, float, float>()
        .function("getMapCoords", &LambertGrid::getMapCoords)
        .function("getVectorRotation", &LambertGrid::getVectorRotation);
    emscripten::class_<StructuredGrid<LambertConformalConic, GridPoint>>("CppLambertGridBase");
}