import { lambertConformalConic } from "../Map";
import { Cache } from "../utils";
import { autoZoomGridMixin } from "./AutoZoom";
import { EarthCoords, GridCoords, WGS84_SEMIMAJOR, WGS84_SEMIMINOR } from "./Grid";
import { StructuredGrid } from "./StructuredGrid";

/** A Lambert conformal conic grid with uniform grid spacing */
class LambertGrid extends autoZoomGridMixin(StructuredGrid) {
    public readonly lon_0: number;
    public readonly lat_0: number;
    public readonly lat_std: [number, number];
    public readonly ll_x: number;
    public readonly ll_y: number;
    public readonly ur_x: number;
    public readonly ur_y: number;
    public readonly a: number;
    public readonly b: number;

    private readonly lcc: (a: number, b: number, opts?: {inverse: boolean}) => [number, number];
    private readonly ll_cache: Cache<[number, number], EarthCoords>;
    private readonly gc_cache: Cache<[], GridCoords>;

    /**
     * Create a Lambert conformal conic grid from the lower-left and upper-right corner x/y values.
     * @param ni      - The number of grid points in the i (longitude) direction
     * @param nj      - The number of grid points in the j (latitude) direction
     * @param lon_0   - The standard longitude for the projection; this is also the center longitude for the projection
     * @param lat_0   - The center latitude for the projection
     * @param lat_std - The standard latitudes for the projection
     * @param ll_x    - The x coordinate in projection space of the lower-left corner of the grid
     * @param ll_y    - The y coordinate in projection space of the lower-left corner of the grid
     * @param ur_x    - The x coordinate in projection space of the upper-right corner of the grid
     * @param ur_y    - The y coordinate in projection space of the upper-right corner of the grid
     * @param a       - The semimajor axis of the assumed shape of Earth in meters
     * @param b       - The semiminor axis of the assumed shape of Earth in meters
     */
    constructor(ni: number, nj: number, lon_0: number, lat_0: number, lat_std: [number, number], 
                ll_x: number, ll_y: number, ur_x: number, ur_y: number, a?: number, b?: number, thin_x?: number, thin_y?: number) {
        super('lcc', true, ni, nj, thin_x, thin_y);

        this.lon_0 = lon_0;
        this.lat_0 = lat_0;
        this.lat_std = lat_std;
        this.ll_x = ll_x;
        this.ll_y = ll_y;
        this.ur_x = ur_x;
        this.ur_y = ur_y;
        this.a = a === undefined ? WGS84_SEMIMAJOR : a;
        this.b = b === undefined ? WGS84_SEMIMINOR : b;
        this.lcc = lambertConformalConic({lon_0: lon_0, lat_0: lat_0, lat_std: lat_std, a: this.a, b: this.b});

        const dx = (this.ur_x - this.ll_x) / this.ni;
        const dy = (this.ur_y - this.ll_y) / this.nj;

        this.ll_cache = new Cache((ni: number, nj: number) => {
            const lons = new Float32Array(ni * nj);
            const lats = new Float32Array(ni * nj);

            const dx_req = (this.ni - 1) / (ni - 1) * dx;
            const dy_req = (this.nj - 1) / (nj - 1) * dy;

            for (let i = 0; i < ni; i++) {
                const x = this.ll_x + i * dx_req;
                for (let j = 0; j < nj; j++) {
                    const y = this.ll_y + j * dy_req;

                    const [lon, lat] = this.lcc(x, y, {inverse: true});
                    const idx = i + j * ni;
                    lons[idx] = lon;
                    lats[idx] = lat;
                }
            }

            return {lons: lons, lats: lats};
        });

        this.gc_cache = new Cache(() => {
            const x = new Float32Array(this.ni);
            const y = new Float32Array(this.nj);

            for (let i = 0; i < this.ni; i++) {
                x[i] = this.ll_x + i * dx;
            }

            for (let j = 0; j < this.nj; j++) {
                y[j] = this.ll_y + j * dy;
            }

            return {x: x, y: y};
        });
    }

    /**
     * Create a Lambert conformal conic grid from the lower-left grid point coordinate and a dx and dy.
     * @param ni      - The number of grid points in the i (longitude) direction
     * @param nj      - The number of grid points in the j (latitude) direction
     * @param lon_0   - The standard longitude for the projection; this is also the center longitude for the projection
     * @param lat_0   - The center latitude for the projection
     * @param lat_std - The standard latitudes for the projection
     * @param ll_lon  - The longitude of the lower-left corner of the grid
     * @param ll_lat  - The latitude of the lower-left corner of the grid
     * @param dx      - The grid dx in meters
     * @param dy      - The grid dy in meters
     * @param a       - The semimajor axis of the assumed shape of Earth in meters
     * @param b       - The semiminor axis of the assumed shape of Earth in meters
     * @returns 
     */
    public static fromLLCornerLonLat(ni: number, nj: number, lon_0: number, lat_0: number, lat_std: [number, number], 
                                     ll_lon: number, ll_lat: number, dx: number, dy: number, a?: number, b?: number) {

        a = a === undefined ? WGS84_SEMIMAJOR : a;
        b = b === undefined ? WGS84_SEMIMINOR : b;

        const lcc = lambertConformalConic({lon_0: lon_0, lat_0: lat_0, lat_std: lat_std, a: a, b: b});
        const [ll_x, ll_y] = lcc(ll_lon, ll_lat);

        return new LambertGrid(ni, nj, lon_0, lat_0, lat_std, ll_x, ll_y, ll_x + ni * dx, ll_y + nj * dy, a, b);
    }

    /** @internal */
    public copy(opts?: {ni?: number, nj?: number, ll_x?: number, ll_y?: number, ur_x?: number, ur_y?: number}) {
        opts = opts !== undefined ? opts : {};
        const ni = opts.ni !== undefined ? opts.ni : this.ni;
        const nj = opts.nj !== undefined ? opts.nj : this.nj;
        const ll_x = opts.ll_x !== undefined ? opts.ll_x : this.ll_x;
        const ll_y = opts.ll_y !== undefined ? opts.ll_y : this.ll_y;
        const ur_x = opts.ur_x !== undefined ? opts.ur_x : this.ur_x;
        const ur_y = opts.ur_y !== undefined ? opts.ur_y : this.ur_y;

        return new LambertGrid(ni, nj, this.lon_0, this.lat_0, this.lat_std, ll_x, ll_y, ur_x, ur_y, this.a, this.b);
    }

    /**
     * @internal
     * Get a list of longitudes and latitudes on the grid
     */
    public getEarthCoords(ni?: number, nj?: number) {
        ni = ni === undefined ? this.ni : ni;
        nj = nj === undefined ? this.nj : nj;

        return this.ll_cache.getValue(ni, nj);
    }

    /** @internal */
    public getGridCoords() {
        return this.gc_cache.getValue();
    }

    /** @internal */
    public transform(x: number, y: number, opts?: {inverse?: boolean}) {
        opts = opts === undefined ? {}: opts;
        const inverse = opts.inverse === undefined ? false : opts.inverse;

        return this.lcc(x, y, {inverse: inverse});
    }

    /** @internal */
    public getThinnedGrid(thin_fac: number, map_max_zoom: number) {
        const [thin_x, thin_y] = this.xyThinFromMaxZoom(thin_fac, map_max_zoom);

        const dx = (this.ur_x - this.ll_x) / this.ni;
        const dy = (this.ur_y - this.ll_y) / this.nj;

        const ni = Math.ceil(this.ni / thin_x);
        const nj = Math.ceil(this.nj / thin_y);
        const ni_remove = (this.ni - 1) % thin_x;
        const nj_remove = (this.nj - 1) % thin_y;
        const ll_x = this.ll_x;
        const ll_y = this.ll_y;
        const ur_x = this.ur_x - ni_remove * dx;
        const ur_y = this.ur_y - nj_remove * dy;

        return new LambertGrid(ni, nj, this.lon_0, this.lat_0, this.lat_std, ll_x, ll_y, ur_x, ur_y, this.a, this.b, this.thin_x * thin_x, this.thin_y * thin_y);
    }
}

export {LambertGrid};