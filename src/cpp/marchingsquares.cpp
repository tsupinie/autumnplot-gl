
#include <vector>
#include <unordered_map>

#ifdef EXECUTABLE
#include <iostream>
#endif

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

class LineString {
    public:
        std::vector<Point*> point_list;

        LineString() {};

#ifdef EXECUTABLE
        friend std::ostream& operator<<(std::ostream& stream, const LineString& frag) {
            stream << "Contour: ";
            auto it = frag.point_list.begin();

            stream << **it;
            ++it;

            for (; it != frag.point_list.end(); ++it) {
                stream << ", " << **it;
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

void deleteContours(std::vector<LineString*>& contours) {
    for (auto it = contours.begin(); it != contours.end(); ++it) {
        LineString* contour = *it;

        for (auto plit = contour->point_list.begin(); plit != contour->point_list.end(); ++plit) {
            Point* pt = *plit;
            delete pt;
        }

        contour->point_list.clear();
        delete contour;
    }
    contours.clear();
}

template<typename T>
std::vector<LineString*> makeContours(T* grid, int nx, int ny, float value) {
    T esw, ese, enw, ene;
    char segs_idx;
    std::vector<LineString*> contours;
    std::unordered_map<Point, LineString*> contour_frags_by_start;
    std::unordered_map<Point, LineString*> contour_frags_by_end;

    for (int i = 0; i < nx - 1; i++) {
        for (int j = 0; j < ny - 1; j++) {
            esw = grid[i + nx * j];
            ese = grid[(i + 1) + nx * j];
            enw = grid[i + nx * (j + 1)];
            ene = grid[(i + 1) + nx * (j + 1)];

            segs_idx = char(esw > value) + (char(ese > value) << 1) + (char(ene > value) << 2) + (char(enw > value) << 3);

            for (int iseg = 0; iseg < NSEGS; iseg++) {
                if (MARCHING_SQUARES_SEGS[segs_idx][iseg][0][0] < 0) continue;

                const float* start_seg_pt = MARCHING_SQUARES_SEGS[segs_idx][iseg][0];
                Point* start_pt = new Point(start_seg_pt[0] + i, start_seg_pt[1] + j);

                const float* end_seg_pt = MARCHING_SQUARES_SEGS[segs_idx][iseg][1];
                Point* end_pt = new Point(end_seg_pt[0] + i, end_seg_pt[1] + j);

                bool start_seen = contour_frags_by_end.find(*start_pt) != contour_frags_by_end.end();
                bool end_seen = contour_frags_by_start.find(*end_pt) != contour_frags_by_start.end();

                if (start_seen && end_seen) {
                    // This segment joins two other contour fragments we've seen
                    LineString* frag1 = contour_frags_by_end[*start_pt];
                    LineString* frag2 = contour_frags_by_start[*end_pt];

                    if (frag1 != frag2) {
                        // This is really two different contour fragments, so we need to splice them together
                        frag1->point_list.insert(frag1->point_list.end(), frag2->point_list.begin(), frag2->point_list.end());
                    }
                    else {
                        // This is actually the same contour fragment, so we're closing it.
                        frag1->point_list.push_back(new Point(*(frag2->point_list.front())));
                        contours.push_back(frag1);
                    }

                    contour_frags_by_start.erase(*end_pt);
                    contour_frags_by_end.erase(*start_pt);

                    if (frag1 != frag2) {
                        // This contour isn't closed yet, so put it back in the maps
                        contour_frags_by_start[*(frag1->point_list.front())] = frag1;
                        contour_frags_by_end[*(frag1->point_list.back())] = frag1;

                        delete frag2;
                        frag2 = NULL;
                    }

                    delete start_pt;
                    start_pt = NULL;
                    delete end_pt;
                    end_pt = NULL;
                }
                else if (start_seen) {
                    // The starting point for this segment is the ending point for some other contour
                    LineString* frag = contour_frags_by_end[*start_pt];
                    frag->point_list.push_back(end_pt);

                    contour_frags_by_end.erase(*start_pt);
                    contour_frags_by_end[*end_pt] = frag;

                    delete start_pt;
                    start_pt = NULL;
                } 
                else if (end_seen) {
                    // The ending point for this segment is the start point for some other contour
                    LineString* frag = contour_frags_by_start[*end_pt];
                    frag->point_list.insert(frag->point_list.begin(), start_pt);

                    contour_frags_by_start.erase(*end_pt);
                    contour_frags_by_start[*start_pt] = frag;

                    delete end_pt;
                    end_pt = NULL;
                }
                else {
                    // New contour segment
                    LineString* frag = new LineString;
                    frag->point_list.push_back(start_pt);
                    frag->point_list.push_back(end_pt);

                    contour_frags_by_start[*start_pt] = frag;
                    contour_frags_by_end[*end_pt] = frag;
                }
            }
        }
    }

    // The contours that intersect the edge of the grid will still be in the "fragments" maps, so add them to the contour list
    for (auto it = contour_frags_by_start.begin(); it != contour_frags_by_start.end(); ++it) {
        contours.push_back(it->second);
    }

    // Do the actual interpolation
    for (auto it = contours.begin(); it != contours.end(); ++it) {
        LineString* contour = *it;

        for (auto plit = contour->point_list.begin(); plit != contour->point_list.end(); ++plit) {
            Point* pt = *plit;

            float x_floor = floorf(pt->x), y_floor = floorf(pt->y);
            int i = static_cast<int>(x_floor), j = static_cast<int>(y_floor);
            int il = i, iu = i, jl = j, ju = j;

            if (x_floor != pt->x) iu++;
            if (y_floor != pt->y) ju++;

            float lb = static_cast<float>(grid[il + nx * jl]);
            float ub = static_cast<float>(grid[iu + nx * ju]);
            pt->x = x_floor; 
            pt->y = y_floor;

            if (il != iu) pt->x += (value - lb) / (ub - lb);
            if (jl != ju) pt->y += (value - lb) / (ub - lb);
        }
    }

    return contours;
};

template std::vector<LineString*> makeContours(float* grid, int nx, int ny, float value);

extern "C" {
    std::vector<LineString*> makeContoursFloat32(float* grid, int nx, int ny, float value) {
        return makeContours(grid, nx, ny, value);
    }
}

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

    std::vector<LineString*> contours = makeContoursFloat32(grid, nx, ny, 0.5);

    for (auto it = contours.begin(); it != contours.end(); ++it) {
        std::cout << **it << '\n';
    }

    deleteContours(contours);

    return 0;
}
#endif