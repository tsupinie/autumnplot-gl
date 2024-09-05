
#include <chrono>
#include <iostream>

#include <emscripten/bind.h>

#include "float16_t.hpp"
#include "marchingsquares.hpp"

using numeric::float16_t;

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
}