
#include <vector>
#include <unordered_map>
#include <iostream>
#include <chrono>
#include <cmath>

#include "float16_t.hpp"

#ifdef WASM
#include <emscripten/bind.h>
#endif

using numeric::float16_t;

namespace std {
    constexpr inline bool isnan(float16_t __x) noexcept {
        return is_nan(__x);
    }
}

class Point {
    public:
        float x;
        float y;

        Point(float x, float y) : x(x), y(y) {}
        Point(const Point& other) : x(other.x), y(other.y) {}

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

        Contour(const std::vector<Point>& point_list, const float value) noexcept : point_list(point_list), value(value) {};

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

/*  8          4
 *   ┌────────┐
 *   │ \    / │
 *   │   16   │
 *   │ /    \ │
 *   └────────┘
 *  1          2
 */


class MarchingSquaresSegmentList {
    std::vector<Point> points;
    std::vector<int> n_points;
    std::vector<int> n_segs;

    public:
        MarchingSquaresSegmentList(const std::vector<Point>& points, const std::vector<int>& n_points, const std::vector<int>& n_segs) : points(points), n_points(n_points), n_segs(n_segs) {}

        int getNumberOfSegments(const int iposs) const {
            return this->n_segs[iposs];
        }

        std::vector<Point> getPointList(const int iposs, const int iseg, const bool reverse) const {
            int n_segs = iseg, n_pts = 0;
            for (auto it = this->n_segs.begin(); it != this->n_segs.begin() + iposs; ++it) {
                n_segs += *it;
            }

            for (auto ptit = this->n_points.begin(); ptit != this->n_points.begin() + n_segs; ++ptit) {
                n_pts += *ptit;
            }

            std::vector<Point> pt_list(this->points.begin() + n_pts, this->points.begin() + n_pts + this->n_points[n_segs]);

            if (reverse) {
                return std::vector<Point>(pt_list.rbegin(), pt_list.rend());
            }

            return pt_list;
        }

        template <std::size_t LP, std::size_t LS, std::size_t LT>
        static MarchingSquaresSegmentList* make(const Point points[LP], const int n_points[LS], const int n_segs[LT]) {
            std::vector<Point> points_vec;
            std::vector<int> n_points_vec(LS);
            std::vector<int> n_segs_vec(LT);

            for (int ipt = 0; ipt < LP; ipt++) { points_vec.push_back(points[ipt]); }
            for (int isg = 0; isg < LS; isg++) { n_points_vec[isg] = n_points[isg]; }
            for (int itb = 0; itb < LT; itb++) { n_segs_vec[itb] = n_segs[itb]; }

            return new MarchingSquaresSegmentList(points_vec, n_points_vec, n_segs_vec);
        }
};

#define NNSEGS_QUAD 16
#define NNPTS_QUAD 16
#define NPTS_QUAD 32
const int MARCHING_SQUARES_NSEGS_QUAD[NNSEGS_QUAD] = {0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0};
const int MARCHING_SQUARES_NPOINTS_QUAD[NNPTS_QUAD] = {2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2};
const Point MARCHING_SQUARES_POINTS_QUAD[NPTS_QUAD] = {
                                                 // 0
    {0.5, 0.}, {0., 0.5},                        // 1
    {1., 0.5}, {0.5, 0.},                        // 2
    {1., 0.5}, {0., 0.5},                        // 3
    {0.5, 1.}, {1., 0.5},                        // 4
    {0.5, 0.}, {0., 0.5},  {0.5, 1.}, {1., 0.5}, // 5
    {0.5, 1.}, {0.5, 0.},                        // 6
    {0.5, 1.}, {0., 0.5},                        // 7
    {0., 0.5}, {0.5, 1.},                        // 8
    {0.5, 0.}, {0.5, 1.},                        // 9
    {1., 0.5}, {0.5, 0.},  {0., 0.5}, {0.5, 1.}, // 10
    {1., 0.5}, {0.5, 1.},                        // 11
    {0., 0.5}, {1., 0.5},                        // 12
    {0.5, 0.}, {1., 0.5},                        // 13
    {0., 0.5}, {0.5, 0.},                        // 14
                                                 // 15
};

#define NNSEGS_TRI 32
#define NNPTS_TRI 32
#define NPTS_TRI 120
const int MARCHING_SQUARES_NSEGS_TRI[NNSEGS_TRI] = {0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0};
const int MARCHING_SQUARES_NPOINTS_TRI[NNPTS_TRI] = {3, 3, 4, 3, 3, 3, 4, 5, 3, 4, 3, 3, 5, 4, 5, 5, 5, 5, 4, 5, 3, 3, 4, 3, 5, 4, 3, 3, 3, 4, 3, 3};
const Point MARCHING_SQUARES_POINTS_TRI[NPTS_TRI] = {
    // Center point below threshold
                                                                                                           // 0
    {0.5, 0.}, {0.25, 0.25}, {0., 0.5},                                                                    // 1
    {1., 0.5}, {0.75, 0.25}, {0.5, 0.},                                                                    // 2
    {1., 0.5}, {0.75, 0.25}, {0.25, 0.25}, {0., 0.5},                                                      // 3
    {0.5, 1.}, {0.75, 0.75}, {1., 0.5},                                                                    // 4
    {0.5, 0.}, {0.25, 0.25}, {0., 0.5},                               {0.5, 1.},  {0.75, 0.75}, {1., 0.5}, // 5
    {0.5, 1.}, {0.75, 0.75}, {0.75, 0.25}, {0.5, 0.},                                                      // 6
    {0.5, 1.}, {0.75, 0.75}, {0.75, 0.25}, {0.25, 0.25}, {0., 0.5},                                        // 7
    {0., 0.5}, {0.25, 0.75}, {0.5, 1.},                                                                    // 8
    {0.5, 0.}, {0.25, 0.25}, {0.25, 0.75}, {0.5, 1.},                                                      // 9
    {1., 0.5}, {0.75, 0.25}, {0.5, 0.},                               {0., 0.5},  {0.25, 0.75}, {0.5, 1.}, // 10
    {1., 0.5}, {0.75, 0.25}, {0.25, 0.25}, {0.25, 0.75}, {0.5, 1.},                                        // 11
    {0., 0.5}, {0.25, 0.75}, {0.75, 0.75}, {1., 0.5},                                                      // 12
    {0.5, 0.}, {0.25, 0.25}, {0.25, 0.75}, {0.75, 0.75}, {1., 0.5},                                        // 13
    {0., 0.5}, {0.25, 0.75}, {0.75, 0.75}, {0.75, 0.25}, {0.5, 0.},                                        // 14
                                                                                                           // 15

    // Center point above threshold
                                                                                                           // 16
    {0.5, 0.}, {0.75, 0.25}, {0.75, 0.75}, {0.25, 0.75}, {0., 0.5},                                        // 17
    {1., 0.5}, {0.75, 0.75}, {0.25, 0.75}, {0.25, 0.25}, {0.5, 0.},                                        // 18
    {1., 0.5}, {0.75, 0.75}, {0.25, 0.75}, {0., 0.5},                                                      // 19
    {0.5, 1.}, {0.25, 0.75}, {0.25, 0.25}, {0.75, 0.25}, {1., 0.5},                                        // 20
    {0.5, 0.}, {0.75, 0.25}, {1., 0.5},                               {0.5, 1},   {0.25, 0.75}, {0., 0.5}, // 21
    {0.5, 1.}, {0.25, 0.75}, {0.25, 0.25}, {0.5, 0.},                                                      // 22
    {0.5, 1.}, {0.25, 0.75}, {0., 0.5},                                                                    // 23
    {0., 0.5}, {0.25, 0.25}, {0.75, 0.25}, {0.75, 0.75}, {0.5, 1.},                                        // 24
    {0.5, 0.}, {0.75, 0.25}, {0.75, 0.75}, {0.5, 1.},                                                      // 25
    {0., 0.5}, {0.25, 0.25}, {0.5, 0.},                               {1., 0.5},  {0.75, 0.75}, {0.5, 1.}, // 26
    {1., 0.5}, {0.75, 0.75}, {0.5, 1.},                                                                    // 27
    {0., 0.5}, {0.25, 0.25}, {0.75, 0.25}, {1., 0.5},                                                      // 28
    {0.5, 0.}, {0.75, 0.25}, {1., 0.5},                                                                    // 29
    {0., 0.5}, {0.25, 0.25}, {0.5, 0.},                                                                    // 30
                                                                                                           // 31
};

/*  8          4
 *   ┌────────┐
 *   │ \    / │
 *   │   16   │
 *   │ /    \ │
 *   └────────┘
 *  1          2
 */

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

MarchingSquaresSegmentList* selectSegmentList(bool quad_as_tri) {
    if (quad_as_tri)
        return MarchingSquaresSegmentList::make<NPTS_TRI, NNPTS_TRI, NNSEGS_TRI>(MARCHING_SQUARES_POINTS_TRI, MARCHING_SQUARES_NPOINTS_TRI, MARCHING_SQUARES_NSEGS_TRI);
    return MarchingSquaresSegmentList::make<NPTS_QUAD, NNPTS_QUAD, NNSEGS_QUAD>(MARCHING_SQUARES_POINTS_QUAD, MARCHING_SQUARES_NPOINTS_QUAD, MARCHING_SQUARES_NSEGS_QUAD);
}

#define MIN(a, b) (a < b ? a : b)
#define MIN4(a, b, c, d) (MIN(MIN(a, b), MIN(c, d)))
#define MAX(a, b) (a > b ? a : b)
#define MAX4(a, b, c, d) (MAX(MAX(a, b), MAX(c, d)))

template<typename T>
std::vector<Contour> makeContours(T* grid, float* xs, float* ys, int nx, int ny, std::vector<float>& values, bool quad_as_tri) {
    T esw, ese, enw, ene;
    float c;
    char segs_idx;
    std::vector<Contour> contours;
    std::unordered_map<float, std::unordered_map<Point, Contour*>> contour_frags_by_start;
    std::unordered_map<float, std::unordered_map<Point, Contour*>> contour_frags_by_end;

    const MarchingSquaresSegmentList* segments = selectSegmentList(quad_as_tri);

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

            if (quad_as_tri && val_idx_lb <= val_idx_ub) {
                c = ((float)esw + (float)ese + (float)enw + (float)ene) * 0.25;
            }

            for (unsigned int idx = val_idx_lb; idx <= val_idx_ub; idx++) {
                float value = values[idx];

                segs_idx = char((float)esw > value) + (char((float)ese > value) << 1) + (char((float)ene > value) << 2) + (char((float)enw > value) << 3);
                bool reverse_segs = false;

                if (quad_as_tri) {
                    segs_idx += (char(c > value) << 4);
                }
                else {
                    if (segs_idx == 5 && abs((float)(esw + ene) * 0.5 - value) > abs((float)(ese + enw) * 0.5 - value)) {
                        segs_idx = 10;
                        reverse_segs = true;
                    }
                    else if (segs_idx == 10 && abs((float)(esw + ene) * 0.5 - value) < abs((float)(ese + enw) * 0.5 - value)) {
                        segs_idx = 5;
                        reverse_segs = true;
                    }
                }

                for (int iseg = 0; iseg < segments->getNumberOfSegments(segs_idx); iseg++) {
                    Contour *square_seg = new Contour(segments->getPointList(segs_idx, iseg, reverse_segs), value);

                    for (auto it = square_seg->point_list.begin(); it != square_seg->point_list.end(); ++it) {
                        it->x += i;
                        it->y += j;
                    }

                    Point start_pt = square_seg->point_list.front();
                    Point end_pt = square_seg->point_list.back();

                    bool start_seen = contour_frags_by_end[value].find(start_pt) != contour_frags_by_end[value].end();
                    bool end_seen = contour_frags_by_start[value].find(end_pt) != contour_frags_by_start[value].end();

                    if (start_seen && end_seen) {
                        // This segment joins two other contour fragments we've seen
                        Contour* frag1 = contour_frags_by_end[value][start_pt];
                        Contour* frag2 = contour_frags_by_start[value][end_pt];

                        frag1->point_list.insert(frag1->point_list.end(), square_seg->point_list.begin() + 1, square_seg->point_list.end() - 1);

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

                        delete square_seg;
                    }
                    else if (start_seen) {
                        // The starting point for this segment is the ending point for some other contour
                        Contour* frag = contour_frags_by_end[value][start_pt];
                        frag->point_list.insert(frag->point_list.end(), square_seg->point_list.begin() + 1, square_seg->point_list.end());

                        contour_frags_by_end[value].erase(start_pt);
                        contour_frags_by_end[value][end_pt] = frag;
                        delete square_seg;
                    } 
                    else if (end_seen) {
                        // The ending point for this segment is the start point for some other contour
                        Contour* frag = contour_frags_by_start[value][end_pt];
                        frag->point_list.insert(frag->point_list.begin(), square_seg->point_list.begin(), square_seg->point_list.end() - 1);

                        contour_frags_by_start[value].erase(end_pt);
                        contour_frags_by_start[value][start_pt] = frag;
                        delete square_seg;
                    }
                    else {
                        // New contour segment
                        contour_frags_by_start[value][start_pt] = square_seg;
                        contour_frags_by_end[value][end_pt] = square_seg;
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

            if (x_floor != plit->x && y_floor == plit->y) {
                // y is either 0 or 1, but x is not, so it's on either the north or south edge of the cell
                float grid1 = static_cast<float>(grid[i + j * nx]);
                float grid2 = static_cast<float>(grid[(i + 1) + j * nx]);
                float alpha = (value - grid1) / (grid2 - grid1);

                plit->x = xs[i] * (1 - alpha) + xs[i + 1] * alpha;
                plit->y = ys[j];
            }
            else if (x_floor == plit->x && y_floor != plit->y) {
                // x is either 0 or 1, but y is not, so it's either on the east or west edge of the cell
                float grid1 = static_cast<float>(grid[i + j * nx]);
                float grid2 = static_cast<float>(grid[i + (j + 1) * nx]);
                float alpha = (value - grid1) / (grid2 - grid1);

                plit->x = xs[i];
                plit->y = ys[j] * (1 - alpha) + ys[j + 1] * alpha;
            }
            else {
                // neither x nor y are 0 or 1, so we're in the middle of the cell, and it's time to use the center point
                float grid_sw = static_cast<float>(grid[i + nx * j]);
                float grid_se = static_cast<float>(grid[(i + 1) + nx * j]);
                float grid_nw = static_cast<float>(grid[i + nx * (j + 1)]);
                float grid_ne = static_cast<float>(grid[(i + 1) + nx * (j + 1)]);
                float grid_c = (grid_sw + grid_se + grid_nw + grid_ne) * 0.25;
                float x_c = (xs[i] + xs[i + 1]) * 0.5;
                float y_c = (ys[j] + ys[j + 1]) * 0.5;

                float residual_x = plit->x - x_floor;
                float residual_y = plit->y - y_floor;

                if (residual_x < 0.5 && residual_y < 0.5) {
                    float alpha = (value - grid_sw) / (grid_c - grid_sw);
                    plit->x = xs[i] * (1 - alpha) + x_c * alpha;
                    plit->y = ys[j] * (1 - alpha) + y_c * alpha;
                }
                else if (residual_x > 0.5 && residual_y < 0.5) {
                    float alpha = (value - grid_se) / (grid_c - grid_se);
                    plit->x = xs[i + 1] * (1 - alpha) + x_c * alpha;
                    plit->y = ys[j] * (1 - alpha) + y_c * alpha;
                }
                else if (residual_x < 0.5 && residual_y > 0.5) {
                    float alpha = (value - grid_nw) / (grid_c - grid_nw);
                    plit->x = xs[i] * (1 - alpha) + x_c * alpha;
                    plit->y = ys[j + 1] * (1 - alpha) + y_c * alpha;
                }
                else {
                    float alpha = (value - grid_ne) / (grid_c - grid_ne);
                    plit->x = xs[i + 1] * (1 - alpha) + x_c * alpha;
                    plit->y = ys[j + 1] * (1 - alpha) + y_c * alpha;
                }
            }
        }
    }

    delete segments;

    return contours;
};

template std::vector<Contour> makeContours(float* grid, float* xs, float* ys, int nx, int ny, std::vector<float>& value, bool quad_as_tri);
template std::vector<Contour> makeContours(float16_t* grid, float* xs, float* ys, int nx, int ny, std::vector<float>& value, bool quad_as_tri);

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
    /*
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
    std::vector<float> contour_vals(1, {0.5});
    */

    const int nx = 2, ny = 2;
    float grid[nx * ny] = {
        0, 0,
        0, 4,
    };

    float x_grid[nx] = {0, 1};
    float y_grid[ny] = {0, 1};
    std::vector<float> contour_vals(1, {0.8});

    std::vector<Contour> contours = makeContours(grid, x_grid, y_grid, nx, ny, contour_vals, true);

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

#endif