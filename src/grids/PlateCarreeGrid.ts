import { Cache } from "../utils";
import { autoZoomGridMixin } from "./AutoZoom";
import { EarthCoords, GridCoords } from "./Grid";
import { StructuredGrid } from "./StructuredGrid";

/** A plate carree (a.k.a. lat/lon) grid with uniform grid spacing */
class PlateCarreeGrid extends autoZoomGridMixin(StructuredGrid) {
    public readonly ll_lon: number;
    public readonly ll_lat: number;
    public readonly ur_lon: number;
    public readonly ur_lat: number;

    private readonly ll_cache: Cache<[number, number], EarthCoords>;
    private readonly gc_cache: Cache<[], GridCoords>;

    /**
     * Create a plate carree grid
     * @param ni     - The number of grid points in the i (longitude) direction
     * @param nj     - The number of grid points in the j (latitude) direction
     * @param ll_lon - The longitude of the lower left corner of the grid
     * @param ll_lat - The latitude of the lower left corner of the grid
     * @param ur_lon - The longitude of the upper right corner of the grid
     * @param ur_lat - The latitude of the upper right corner of the grid
     */
    constructor(ni: number, nj: number, ll_lon: number, ll_lat: number, ur_lon: number, ur_lat: number, thin_x?: number, thin_y?: number) {
        super('latlon', true, ni, nj, thin_x, thin_y);

        this.ll_lon = ll_lon;
        this.ll_lat = ll_lat;
        this.ur_lon = ur_lon;
        this.ur_lat = ur_lat;

        const dlon = (this.ur_lon - this.ll_lon) / (this.ni - 1);
        const dlat = (this.ur_lat - this.ll_lat) / (this.nj - 1);

        this.ll_cache = new Cache((ni: number, nj: number) => {
            const lons = new Float32Array(ni * nj);
            const lats = new Float32Array(ni * nj);

            const dlon_req = (this.ni - 1) / (ni - 1) * dlon;
            const dlat_req = (this.nj - 1) / (nj - 1) * dlat;

            for (let i = 0; i < ni; i++) {
                for (let j = 0; j < nj; j++) {
                    const idx = i + j * ni;

                    lons[idx] = this.ll_lon + i * dlon_req;
                    lats[idx] = this.ll_lat + j * dlat_req;
                }
            }

            return {'lons': lons, 'lats': lats};
        });

        this.gc_cache = new Cache(() => {
            const x = new Float32Array(this.ni);
            const y = new Float32Array(this.nj);

            for (let i = 0; i < this.ni; i++) {
                x[i] = this.ll_lon + i * dlon;
            }

            for (let j = 0; j < this.nj; j++) {
                y[j] = this.ll_lat + j * dlat;
            }

            return {x: x, y: y};
        })
    }

    /** @internal */
    public copy(opts?: {ni?: number, nj?: number, ll_lon?: number, ll_lat?: number, ur_lon?: number, ur_lat?: number}) {
        opts = opts !== undefined ? opts : {};
        const ni = opts.ni !== undefined ? opts.ni : this.ni;
        const nj = opts.nj !== undefined ? opts.nj : this.nj;
        const ll_lon = opts.ll_lon !== undefined ? opts.ll_lon : this.ll_lon;
        const ll_lat = opts.ll_lat !== undefined ? opts.ll_lat : this.ll_lat;
        const ur_lon = opts.ur_lon !== undefined ? opts.ur_lon : this.ur_lon;
        const ur_lat = opts.ur_lat !== undefined ? opts.ur_lat : this.ur_lat;

        return new PlateCarreeGrid(ni, nj, ll_lon, ll_lat, ur_lon, ur_lat);
    }

    /**
     * @internal
     * Get a list of longitudes and latitudes on the grid (internal method)
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
        return [x, y] as [number, number];
    }

    /** @internal */
    public getThinnedGrid(thin_fac: number, map_max_zoom: number) {
        const [thin_x, thin_y] = this.xyThinFromMaxZoom(thin_fac, map_max_zoom);

        const dlon = (this.ur_lon - this.ll_lon) / this.ni;
        const dlat = (this.ur_lat - this.ll_lat) / this.nj;

        const ni = Math.ceil(this.ni / thin_x);
        const nj = Math.ceil(this.nj / thin_y);
        const ni_remove = (this.ni - 1) % thin_x;
        const nj_remove = (this.nj - 1) % thin_y;
        const ll_lon = this.ll_lon;
        const ll_lat = this.ll_lat;
        const ur_lon = this.ur_lon - ni_remove * dlon;
        const ur_lat = this.ur_lat - nj_remove * dlat;

        return new PlateCarreeGrid(ni, nj, ll_lon, ll_lat, ur_lon, ur_lat, this.thin_x * thin_x, this.thin_y * thin_y);
    }
}

export {PlateCarreeGrid};