import { Float16Array } from "@petamoriken/float16";
import { WGLBuffer, WGLTexture, WGLTextureSpec } from "autumn-wgl";
import { TypedArray, WebGLAnyRenderingContext } from "./AutumnTypes";
import { LngLat, lambertConformalConic, rotateSphere } from "./Map";
import { getGLFormatTypeAlignment, layer_worker } from "./PlotComponent";
import { Cache, getArrayConstructor, getMinZoom } from "./utils";
import { kdTree } from "kd-tree-javascript";

interface EarthCoords {
    lons: Float32Array;
    lats: Float32Array;
}

interface GridCoords {
    x: Float32Array;
    y: Float32Array;
}

async function makeWGLDomainBuffers(gl: WebGLAnyRenderingContext, grid: Grid, native_grid?: Grid) {
    native_grid = native_grid !== undefined ? native_grid: grid;

    const texcoord_margin_r = 1 / (2 * native_grid.ni);
    const texcoord_margin_s = 1 / (2 * native_grid.nj);

    const grid_cell_size_multiplier = (grid.ni * grid.nj) / (native_grid.ni * native_grid.nj);

    const {lats: field_lats, lons: field_lons} = grid.getEarthCoords();
    const domain_coords = await layer_worker.makeDomainVerticesAndTexCoords(field_lats, field_lons, grid.ni, grid.nj, texcoord_margin_r, texcoord_margin_s);

    for (let icd = 0; icd < domain_coords['grid_cell_size'].length; icd++) {
        domain_coords['grid_cell_size'][icd] *= grid_cell_size_multiplier;
    }

    const vertices = new WGLBuffer(gl, domain_coords['vertices'], 2, gl.TRIANGLE_STRIP);
    const texcoords = new WGLBuffer(gl, domain_coords['tex_coords'], 2, gl.TRIANGLE_STRIP);
    const grid_cell_size = new WGLBuffer(gl, domain_coords['grid_cell_size'], 1, gl.TRIANGLE_STRIP);

    return {'vertices': vertices, 'texcoords': texcoords, 'cellsize': grid_cell_size};
}

async function makeWGLBillboardBuffers(gl: WebGLAnyRenderingContext, grid: Grid, thin_fac: number, map_max_zoom: number) {
    const {lats: field_lats, lons: field_lons} = grid.getEarthCoords();
    const min_zoom = grid.getMinVisibleZoom(thin_fac, map_max_zoom);
    const bb_elements = await layer_worker.makeBBElements(field_lats, field_lons, min_zoom, grid.ni, grid.nj, map_max_zoom);

    const vertices = new WGLBuffer(gl, bb_elements['pts'], 3, gl.TRIANGLE_STRIP);
    const texcoords = new WGLBuffer(gl, bb_elements['tex_coords'], 2, gl.TRIANGLE_STRIP);

    return {'vertices': vertices, 'texcoords': texcoords};
}

function makeVectorRotationTexture(gl: WebGLAnyRenderingContext, grid: Grid) {
    const coords = grid.getEarthCoords();

    if (!grid.is_conformal) {
        // If the grid is non-conformal, we need a fully general change of basis from grid coordinates to earth coordinates. This is not supported for now, so warn about it.
        console.warn('Vector rotations for non-conformal projections are not supported. The output may look incorrect.')
    }

    const rot_vals = new Float16Array(coords.lats.length);

    for (let icd = 0; icd < coords.lats.length; icd++) {
        const lon = coords.lons[icd];
        const lat = coords.lats[icd];

        const [x, y] = grid.transform(lon, lat);
        const [x_pertlon, y_pertlon] = grid.transform(lon + 0.01, lat);
        rot_vals[icd] = Math.atan2(y_pertlon - y, x_pertlon - x);
    }

    const {format, type, row_alignment} = getGLFormatTypeAlignment(gl, true);

    const rot_img: WGLTextureSpec = {
        format: format, type: type, row_alignment: row_alignment, image: new Uint16Array(rot_vals.buffer),
        width: grid.ni, height: grid.nj, mag_filter: gl.LINEAR
    };

    const rot_tex = new WGLTexture(gl, rot_img);
    return {'rotation': rot_tex};
}

type GridType = 'latlon' | 'latlonrot' | 'lcc' | 'unstructured';

abstract class Grid {
    public readonly type: GridType;
    public readonly ni: number;
    public readonly nj: number;
    public readonly is_conformal: boolean;

    private readonly billboard_buffer_cache: Cache<[WebGLAnyRenderingContext, number, number], Promise<{'vertices': WGLBuffer, 'texcoords': WGLBuffer}>>;
    private readonly vector_rotation_cache: Cache<[WebGLAnyRenderingContext], {'rotation': WGLTexture}>

    constructor(type: GridType, is_conformal: boolean, ni: number, nj: number) {
        this.type = type;
        this.is_conformal = is_conformal;
        this.ni = ni;
        this.nj = nj;

        this.billboard_buffer_cache = new Cache((gl: WebGLAnyRenderingContext, thin_fac: number, max_zoom: number) => {
            return makeWGLBillboardBuffers(gl, this, thin_fac, max_zoom);
        });

        this.vector_rotation_cache = new Cache((gl: WebGLAnyRenderingContext) => {
            return makeVectorRotationTexture(gl, this);
        })
    }

    public abstract getEarthCoords(): EarthCoords;
    public abstract getGridCoords(): GridCoords;
    public abstract transform(x: number, y: number, opts?: {inverse?: boolean}): [number, number];
    public abstract getThinnedGrid(thin_fac: number, map_max_zoom: number): Grid;
    public abstract thinDataArray<ArrayType extends TypedArray>(original_grid: Grid, ary: ArrayType): ArrayType;
    public abstract getMinVisibleZoom(thin_fac: number, map_max_zoom: number): Uint8Array;

    public async getWGLBillboardBuffers(gl: WebGLAnyRenderingContext, thin_fac: number, max_zoom: number) {
        return await this.billboard_buffer_cache.getValue(gl, thin_fac, max_zoom);
    }

    public getVectorRotationTexture(gl: WebGLAnyRenderingContext) {
        return this.vector_rotation_cache.getValue(gl);
    }
}

abstract class StructuredGrid extends Grid {
    private readonly buffer_cache: Cache<[WebGLAnyRenderingContext], Promise<{'vertices': WGLBuffer, 'texcoords': WGLBuffer, 'cellsize': WGLBuffer}>>;
    protected readonly thin_x: number;
    protected readonly thin_y: number;

    constructor(type: GridType, is_conformal: boolean, ni: number, nj: number, thin_x?: number, thin_y?: number) {
        super(type, is_conformal, ni, nj);

        this.thin_x = thin_x === undefined ? 1 : thin_x;
        this.thin_y = thin_y === undefined ? 1 : thin_y;

        this.buffer_cache = new Cache((gl: WebGLAnyRenderingContext) => {
            const new_ni = Math.max(Math.floor(this.ni / 50), 20);
            const new_nj = Math.max(Math.floor(this.nj / 50), 20);
            return makeWGLDomainBuffers(gl, this.copy({ni: new_ni, nj: new_nj}), this);
        });
    }

    protected xyThinFromMaxZoom(thin_fac: number, map_max_zoom: number) {
        const n_density_tiers = Math.log2(thin_fac);
        const n_inaccessible_tiers = Math.max(n_density_tiers + 1 - map_max_zoom, 0);
        const xy_thin = Math.pow(2, n_inaccessible_tiers);

        return [xy_thin, xy_thin] as [number, number];
    }

    public getMinVisibleZoom(thin_fac: number, map_max_zoom: number) {
        const min_zoom = new Uint8Array(this.ni * this.nj);
        for (let ilat = 0; ilat < this.nj * this.thin_y; ilat += this.thin_y) {
            for (let ilon = 0; ilon < this.ni * this.thin_x; ilon += this.thin_x) {
                const idx = ilat * this.ni + ilon;
                min_zoom[idx] = getMinZoom(ilat, ilon, thin_fac);
            }
        }

        return min_zoom;
    }

    public thinDataArray<ArrayType extends TypedArray>(original_grid: StructuredGrid, ary: ArrayType) {
        const arrayType = getArrayConstructor(ary);
        const new_data = new arrayType(this.ni * this.nj);

        for (let i = 0; i < this.ni; i++) {
            for (let j = 0 ; j < this.nj; j++) {
                const idx_old = i * this.thin_x + original_grid.ni * j * this.thin_y;
                const idx = i + this.ni * j;

                new_data[idx] = ary[idx_old];
            }
        }

        return new_data;
    }

    public abstract copy(opts?: {ni?: number, nj?: number}): Grid;

    public async getWGLBuffers(gl: WebGLAnyRenderingContext) {
        return await this.buffer_cache.getValue(gl);
    }
}

/** A plate carree (a.k.a. lat/lon) grid with uniform grid spacing */
class PlateCarreeGrid extends StructuredGrid {
    public readonly ll_lon: number;
    public readonly ll_lat: number;
    public readonly ur_lon: number;
    public readonly ur_lat: number;

    private readonly ll_cache: Cache<[], EarthCoords>;
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

        this.ll_cache = new Cache(() => {
            const lons = new Float32Array(this.ni * this.nj);
            const lats = new Float32Array(this.ni * this.nj);

            for (let i = 0; i < this.ni; i++) {
                for (let j = 0; j < this.nj; j++) {
                    const idx = i + j * this.ni;

                    lons[idx] = this.ll_lon + i * dlon;
                    lats[idx] = this.ll_lat + j * dlat;
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
     * Get a list of longitudes and latitudes on the grid (internal method)
     */
    public getEarthCoords() {
        return this.ll_cache.getValue();
    }

    public getGridCoords() {
        return this.gc_cache.getValue();
    }

    public transform(x: number, y: number, opts?: {inverse?: boolean}) {
        return [x, y] as [number, number];
    }

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

/** A rotated lat-lon (plate carree) grid with uniform grid spacing */
class PlateCarreeRotatedGrid extends StructuredGrid {
    public readonly np_lon: number;
    public readonly np_lat: number;
    public readonly lon_shift: number;
    public readonly ll_lon: number;
    public readonly ll_lat: number;
    public readonly ur_lon: number;
    public readonly ur_lat: number;

    private readonly llrot: (a: number, b: number, opts?: {inverse: boolean}) => [number, number];
    private readonly ll_cache: Cache<[], EarthCoords>;
    private readonly gc_cache: Cache<[], GridCoords>;

    /**
     * Create a Lambert conformal conic grid
     * @param ni        - The number of grid points in the i (longitude) direction
     * @param nj        - The number of grid points in the j (latitude) direction
     * @param np_lon    - The longitude of the north pole for the rotated grid
     * @param np_lat    - The latitude of the north pole for the rotated grid
     * @param lon_shift - The angle around the rotated north pole to shift the central meridian
     * @param ll_lon    - The longitude of the lower left corner of the grid (on the rotated earth)
     * @param ll_lat    - The latitude of the lower left corner of the grid (on the rotated earth)
     * @param ur_lon    - The longitude of the upper right corner of the grid (on the rotated earth)
     * @param ur_lat    - The latitude of the upper right corner of the grid (on the rotated earth)
     */
    constructor(ni: number, nj: number, np_lon: number, np_lat: number, lon_shift: number, ll_lon: number, ll_lat: number, ur_lon: number, ur_lat: number, thin_x?: number, thin_y?: number) {
        super('latlonrot', true, ni, nj, thin_x, thin_y);

        this.np_lon = np_lon;
        this.np_lat = np_lat;
        this.lon_shift = lon_shift;
        this.ll_lon = ll_lon;
        this.ll_lat = ll_lat;
        this.ur_lon = ur_lon;
        this.ur_lat = ur_lat;
        this.llrot = rotateSphere({np_lon: np_lon, np_lat: np_lat, lon_shift: lon_shift});

        const dlon = (this.ur_lon - this.ll_lon) / (this.ni - 1);
        const dlat = (this.ur_lat - this.ll_lat) / (this.nj - 1);

        this.ll_cache = new Cache(() => {
            const lons = new Float32Array(this.ni * this.nj);
            const lats = new Float32Array(this.ni * this.nj);

            for (let i = 0; i < this.ni; i++) {
                const lon_p = this.ll_lon + i * dlon;
                for (let j = 0; j < this.nj; j++) {
                    const lat_p = this.ll_lat + j * dlat;

                    const [lon, lat] = this.llrot(lon_p, lat_p);
                    const idx = i + j * this.ni;
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
                x[i] = this.ll_lon + i * dlon;
            }

            for (let j = 0; j < this.nj; j++) {
                y[j] = this.ll_lat + j * dlat;
            }

            return {x: x, y: y};
        })
    }

    public copy(opts?: {ni?: number, nj?: number, ll_lon?: number, ll_lat?: number, ur_lon?: number, ur_lat?: number}) {
        opts = opts !== undefined ? opts : {};
        const ni = opts.ni !== undefined ? opts.ni : this.ni;
        const nj = opts.nj !== undefined ? opts.nj : this.nj;
        const ll_lon = opts.ll_lon !== undefined ? opts.ll_lon : this.ll_lon;
        const ll_lat = opts.ll_lat !== undefined ? opts.ll_lat : this.ll_lat;
        const ur_lon = opts.ur_lon !== undefined ? opts.ur_lon : this.ur_lon;
        const ur_lat = opts.ur_lat !== undefined ? opts.ur_lat : this.ur_lat;

        return new PlateCarreeRotatedGrid(ni, nj, this.np_lon, this.np_lat, this.lon_shift, ll_lon, ll_lat, ur_lon, ur_lat);
    }

    /**
     * Get a list of longitudes and latitudes on the grid (internal method)
     */
    public getEarthCoords() {
        return this.ll_cache.getValue();
    }

    public getGridCoords() {
        return this.gc_cache.getValue();
    }

    public transform(x: number, y: number, opts?: {inverse?: boolean}) {
        opts = opts === undefined ? {}: opts;
        const inverse = 'inverse' in opts ? opts.inverse : false;

        return this.llrot(x, y, {inverse: !inverse});
    }

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

        return new PlateCarreeRotatedGrid(ni, nj, this.np_lon, this.np_lat, this.lon_shift, ll_lon, ll_lat, ur_lon, ur_lat, this.thin_x * thin_x, this.thin_y * thin_y);
    }
}

/** A Lambert conformal conic grid with uniform grid spacing */
class LambertGrid extends StructuredGrid {
    public readonly lon_0: number;
    public readonly lat_0: number;
    public readonly lat_std: [number, number];
    public readonly ll_x: number;
    public readonly ll_y: number;
    public readonly ur_x: number;
    public readonly ur_y: number;

    private readonly lcc: (a: number, b: number, opts?: {inverse: boolean}) => [number, number];
    private readonly ll_cache: Cache<[], EarthCoords>;
    private readonly gc_cache: Cache<[], GridCoords>;

    /**
     * Create a Lambert conformal conic grid
     * @param ni      - The number of grid points in the i (longitude) direction
     * @param nj      - The number of grid points in the j (latitude) direction
     * @param lon_0   - The standard longitude for the projection; this is also the center longitude for the projection
     * @param lat_0   - The center latitude for the projection
     * @param lat_std - The standard latitudes for the projection
     * @param ll_x    - The x coordinate in projection space of the lower-left corner of the grid
     * @param ll_y    - The y coordinate in projection space of the lower-left corner of the grid
     * @param ur_x    - The x coordinate in projection space of the upper-right corner of the grid
     * @param ur_y    - The y coordinate in projection space of the upper-right corner of the grid
     */
    constructor(ni: number, nj: number, lon_0: number, lat_0: number, lat_std: [number, number], 
                ll_x: number, ll_y: number, ur_x: number, ur_y: number, thin_x?: number, thin_y?: number) {
        super('lcc', true, ni, nj, thin_x, thin_y);

        this.lon_0 = lon_0;
        this.lat_0 = lat_0;
        this.lat_std = lat_std;
        this.ll_x = ll_x;
        this.ll_y = ll_y;
        this.ur_x = ur_x;
        this.ur_y = ur_y;
        this.lcc = lambertConformalConic({lon_0: lon_0, lat_0: lat_0, lat_std: lat_std});

        const dx = (this.ur_x - this.ll_x) / (this.ni - 1);
        const dy = (this.ur_y - this.ll_y) / (this.nj - 1);

        this.ll_cache = new Cache(() => {
            const lons = new Float32Array(this.ni * this.nj);
            const lats = new Float32Array(this.ni * this.nj);

            for (let i = 0; i < this.ni; i++) {
                const x = this.ll_x + i * dx;
                for (let j = 0; j < this.nj; j++) {
                    const y = this.ll_y + j * dy;

                    const [lon, lat] = this.lcc(x, y, {inverse: true});
                    const idx = i + j * this.ni;
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

    public static fromLLCornerLonLat(ni: number, nj: number, lon_0: number, lat_0: number, lat_std: [number, number], 
                                     ll_lon: number, ll_lat: number, dx: number, dy: number) {

        const lcc = lambertConformalConic({lon_0: lon_0, lat_0: lat_0, lat_std: lat_std});
        const [ll_x, ll_y] = lcc(ll_lon, ll_lat);

        return new LambertGrid(ni, nj, lon_0, lat_0, lat_std, ll_x, ll_y, ll_x + ni * dx, ll_y + nj * dy);
    }

    public copy(opts?: {ni?: number, nj?: number, ll_x?: number, ll_y?: number, ur_x?: number, ur_y?: number}) {
        opts = opts !== undefined ? opts : {};
        const ni = opts.ni !== undefined ? opts.ni : this.ni;
        const nj = opts.nj !== undefined ? opts.nj : this.nj;
        const ll_x = opts.ll_x !== undefined ? opts.ll_x : this.ll_x;
        const ll_y = opts.ll_y !== undefined ? opts.ll_y : this.ll_y;
        const ur_x = opts.ur_x !== undefined ? opts.ur_x : this.ur_x;
        const ur_y = opts.ur_y !== undefined ? opts.ur_y : this.ur_y;

        return new LambertGrid(ni, nj, this.lon_0, this.lat_0, this.lat_std, ll_x, ll_y, ur_x, ur_y);
    }

    /**
     * Get a list of longitudes and latitudes on the grid (internal method)
     */
    public getEarthCoords() {
        return this.ll_cache.getValue();
    }

    public getGridCoords() {
        return this.gc_cache.getValue();
    }

    public transform(x: number, y: number, opts?: {inverse?: boolean}) {
        opts = opts === undefined ? {}: opts;
        const inverse = opts.inverse === undefined ? false : opts.inverse;

        return this.lcc(x, y, {inverse: inverse});
    }

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

        return new LambertGrid(ni, nj, this.lon_0, this.lat_0, this.lat_std, ll_x, ll_y, ur_x, ur_y, this.thin_x * thin_x, this.thin_y * thin_y);
    }
}

class UnstructuredGrid extends Grid {
    public readonly coords: LngLat[];
    private readonly zoom_cache: Cache<[number, number], Uint8Array>

    constructor(coords: LngLat[]) {
        super('unstructured', true, coords.length, 1);
        this.coords = coords;

        this.zoom_cache = new Cache((thin_fac: number, map_max_zoom: number) => {
            let min_label_lon: number | null = null, min_label_lat: number | null = null, max_label_lon: number | null = null, max_label_lat: number | null = null;

            this.coords.forEach(coord => {
                if (min_label_lon === null || coord.lng < min_label_lon) min_label_lon = coord.lng;
                if (max_label_lon === null || coord.lng > max_label_lon) max_label_lon = coord.lng;
                if (min_label_lat === null || coord.lat < min_label_lat) min_label_lat = coord.lat;
                if (max_label_lat === null || coord.lat > max_label_lat) max_label_lat = coord.lat;
            });
    
            if (min_label_lon === null || min_label_lat === null || max_label_lon === null || max_label_lat === null)
                return new Uint8Array([]);
    
            interface kdNode {
                lng: number;
                lat: number;
                min_zoom: number;
            }
    
            const kd_nodes = this.coords.map(c => ({lng: c.lng, lat: c.lat, min_zoom: map_max_zoom} as kdNode));
            const tree = new kdTree(kd_nodes, (a, b) => Math.hypot(a.lng - b.lng, a.lat - b.lat), ['lng', 'lat']);
    
            const {x: min_label_x, y: max_label_y} = new LngLat(min_label_lon, min_label_lat).toMercatorCoord();
            const {x: max_label_x, y: min_label_y} = new LngLat(max_label_lon, max_label_lat).toMercatorCoord();
            const thin_grid_width = max_label_x - min_label_x;
            const thin_grid_height = max_label_y - min_label_y;
            const ni_thin_grid = Math.round(thin_grid_width * thin_fac); // thin_fac was 4 / contour_label_spacing for the contour labels
            const nj_thin_grid = Math.round(thin_grid_height * thin_fac);
            const thin_grid_xs = [];
            const thin_grid_ys = [];
    
            for (let idx = 0; idx < ni_thin_grid; idx++) {
                thin_grid_xs.push(min_label_x + (idx / ni_thin_grid) * thin_grid_width);
            }
    
            for (let jdy = 0; jdy < nj_thin_grid; jdy++) {
                thin_grid_ys.push(min_label_y + (jdy / nj_thin_grid) * thin_grid_height);
            }
         
            for (let idx = 0; idx < ni_thin_grid; idx++) {
                for (let jdy = 0; jdy < nj_thin_grid; jdy++) {
                    const zoom = getMinZoom(jdy, idx, Math.pow(2, map_max_zoom));
    
                    const grid_x = thin_grid_xs[idx];
                    const grid_y = thin_grid_ys[jdy];
                    const ll = LngLat.fromMercatorCoord(grid_x, grid_y);
    
                    const [label, dist] = tree.nearest({lng: ll.lng, lat: ll.lat, min_zoom: 0}, 1)[0];
                    label.min_zoom = zoom;
                }
            }
    
            return new Uint8Array(kd_nodes.map(n => n.min_zoom));
        });
    }

    public getEarthCoords() {
        return {lons: new Float32Array(this.coords.map(c => c.lng)), lats: new Float32Array(this.coords.map(c => c.lat))};
    }

    public getGridCoords() {
        const {lons, lats} = this.getEarthCoords();
        return {x: lons, y: lats} as GridCoords;
    }

    public transform(x: number, y: number, opts?: {inverse?: boolean}) {
        return [x, y] as [number, number];
    }

    public getMinVisibleZoom(thin_fac: number, map_max_zoom: number) {
        return this.zoom_cache.getValue(thin_fac, map_max_zoom);
    }

    public getThinnedGrid(thin_fac: number, map_max_zoom: number) {
        const min_zoom = this.getMinVisibleZoom(thin_fac, map_max_zoom);
        return new UnstructuredGrid(this.coords.filter((ll, ill) => min_zoom[ill] <= map_max_zoom))
    }

    public thinDataArray<ArrayType extends TypedArray>(original_grid: UnstructuredGrid, ary: ArrayType) {
        let i_new = 0;
        
        const arrayType = getArrayConstructor(ary);
        const new_data = new arrayType(this.ni * this.nj);

        for (let i = 0; i < original_grid.coords.length; i++) {
            if (this.coords[i_new].lat == original_grid.coords[i].lat && this.coords[i_new].lng == original_grid.coords[i].lng) {
                new_data[++i_new] = ary[i];
            }
        }

        return new_data;
    }
}

export {Grid, StructuredGrid, PlateCarreeGrid, PlateCarreeRotatedGrid, LambertGrid, UnstructuredGrid};
export type {GridType};