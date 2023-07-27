
import { WindProfile } from "./AutumnTypes";
import { lambertConformalConic } from "./Map";
import { layer_worker } from "./PlotComponent";
import { zip } from "./utils";
import { WGLBuffer } from "./wgl";

class Cache<A extends unknown[], R> {
    cached_value: R | null;
    compute_value: (...args: A) => R;

    constructor(compute_value: (...args: A) => R) {
        this.cached_value = null;
        this.compute_value = compute_value;
    }

    getValue(...args: A) {
        if (this.cached_value === null) {
            this.cached_value = this.compute_value(...args);
        }

        return this.cached_value;
    }
}

interface Coords {
    lons: Float32Array;
    lats: Float32Array;
}

async function makeWGLDomainBuffers(gl: WebGLRenderingContext, grid: Grid, native_grid?: Grid) {
    native_grid = native_grid !== undefined ? native_grid: grid;

    const texcoord_margin_r = 1 / (2 * native_grid.ni);
    const texcoord_margin_s = 1 / (2 * native_grid.nj);

    const grid_cell_size_multiplier = (grid.ni * grid.nj) / (native_grid.ni * native_grid.nj);

    const {lats: field_lats, lons: field_lons} = grid.getCoords();
    const domain_coords = await layer_worker.makeDomainVerticesAndTexCoords(field_lats, field_lons, grid.ni, grid.nj, texcoord_margin_r, texcoord_margin_s);

    for (let icd = 0; icd < domain_coords['grid_cell_size'].length; icd++) {
        domain_coords['grid_cell_size'][icd] *= grid_cell_size_multiplier;
    }

    const vertices = new WGLBuffer(gl, domain_coords['vertices'], 2, gl.TRIANGLE_STRIP);
    const texcoords = new WGLBuffer(gl, domain_coords['tex_coords'], 2, gl.TRIANGLE_STRIP);
    const grid_cell_size = new WGLBuffer(gl, domain_coords['grid_cell_size'], 1, gl.TRIANGLE_STRIP);

    return {'vertices': vertices, 'texcoords': texcoords, 'cellsize': grid_cell_size};
}

async function makeWGLBillboardBuffers(gl: WebGLRenderingContext, grid: Grid, thin_fac: number, max_zoom: number) {
    const {lats: field_lats, lons: field_lons} = grid.getCoords();
    const bb_elements = await layer_worker.makeBBElements(field_lats, field_lons, grid.ni, grid.nj, thin_fac, max_zoom);

    const vertices = new WGLBuffer(gl, bb_elements['pts'], 3, gl.TRIANGLE_STRIP);
    const texcoords = new WGLBuffer(gl, bb_elements['tex_coords'], 2, gl.TRIANGLE_STRIP);

    return {'vertices': vertices, 'texcoords': texcoords};
}

type GridType = 'latlon' | 'lcc';

abstract class Grid {
    readonly type: GridType;
    readonly ni: number;
    readonly nj: number;
    readonly is_conformal: boolean;

    readonly _buffer_cache: Cache<[WebGLRenderingContext], Promise<{'vertices': WGLBuffer, 'texcoords': WGLBuffer, 'cellsize': WGLBuffer}>>;
    readonly _billboard_buffer_cache: Cache<[WebGLRenderingContext, number, number], Promise<{'vertices': WGLBuffer, 'texcoords': WGLBuffer}>>;

    constructor(type: GridType, is_conformal: boolean, ni: number, nj: number) {
        this.type = type;
        this.is_conformal = is_conformal;
        this.ni = ni;
        this.nj = nj;

        this._buffer_cache = new Cache((gl: WebGLRenderingContext) => {
            const new_ni = Math.max(Math.floor(this.ni / 50), 20);
            const new_nj = Math.max(Math.floor(this.nj / 50), 20);
            return makeWGLDomainBuffers(gl, this.copy({ni: new_ni, nj: new_nj}), this);
        });

        this._billboard_buffer_cache = new Cache((gl: WebGLRenderingContext, thin_fac: number, max_zoom: number) => {
            return makeWGLBillboardBuffers(gl, this, thin_fac, max_zoom);
        });
    }

    abstract copy(opts?: {ni?: number, nj?: number}): Grid;

    abstract getCoords(): Coords;
    abstract transform(x: number, y: number, opts?: {inverse?: boolean}): [number, number];
    abstract getThinnedGrid(thin_x: number, thin_y: number): Grid;
    
    async getWGLBuffers(gl: WebGLRenderingContext) {
        return await this._buffer_cache.getValue(gl);
    }

    async getWGLBillboardBuffers(gl: WebGLRenderingContext, thin_fac: number, max_zoom: number) {
        return await this._billboard_buffer_cache.getValue(gl, thin_fac, max_zoom);
    }
}

/** A plate carree (a.k.a. lat/lon) grid with uniform grid spacing */
class PlateCarreeGrid extends Grid {
    readonly ll_lon: number;
    readonly ll_lat: number;
    readonly ur_lon: number;
    readonly ur_lat: number;

    /** @private */
    readonly _ll_cache: Cache<[], Coords>;

    /**
     * Create a plate carree grid
     * @param ni     - The number of grid points in the i (longitude) direction
     * @param nj     - The number of grid points in the j (latitude) direction
     * @param ll_lon - The longitude of the lower left corner of the grid
     * @param ll_lat - The latitude of the lower left corner of the grid
     * @param ur_lon - The longitude of the upper right corner of the grid
     * @param ur_lat - The latitude of the upper right corner of the grid
     */
    constructor(ni: number, nj: number, ll_lon: number, ll_lat: number, ur_lon: number, ur_lat: number) {
        super('latlon', true, ni, nj);

        this.ll_lon = ll_lon;
        this.ll_lat = ll_lat;
        this.ur_lon = ur_lon;
        this.ur_lat = ur_lat;

        this._ll_cache = new Cache(() => {
            const dlon = (this.ur_lon - this.ll_lon) / (this.ni - 1);
            const dlat = (this.ur_lat - this.ll_lat) / (this.nj - 1);

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
    }

    copy(opts?: {ni?: number, nj?: number, ll_lon?: number, ll_lat?: number, ur_lon?: number, ur_lat?: number}) {
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
    getCoords() {
        return this._ll_cache.getValue();
    }

    transform(x: number, y: number, opts?: {inverse?: boolean}) {
        return [x, y] as [number, number];
    }

    getThinnedGrid(thin_x: number, thin_y: number) {
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

        return new PlateCarreeGrid(ni, nj, ll_lon, ll_lat, ur_lon, ur_lat);
    }
}

/** A Lambert conformal conic grid with uniform grid spacing */
class LambertGrid extends Grid {
    readonly lon_0: number;
    readonly lat_0: number;
    readonly lat_std: [number, number];
    readonly ll_x: number;
    readonly ll_y: number;
    readonly ur_x: number;
    readonly ur_y: number;

    /** @private */
    readonly lcc: (a: number, b: number, opts?: {inverse: boolean}) => [number, number];

    /** @private */
    readonly _ll_cache: Cache<[], Coords>;

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
                ll_x: number, ll_y: number, ur_x: number, ur_y: number) {
        super('lcc', true, ni, nj);

        this.lon_0 = lon_0;
        this.lat_0 = lat_0;
        this.lat_std = lat_std;
        this.ll_x = ll_x;
        this.ll_y = ll_y;
        this.ur_x = ur_x;
        this.ur_y = ur_y;
        this.lcc = lambertConformalConic({lon_0: lon_0, lat_0: lat_0, lat_std: lat_std});

        this._ll_cache = new Cache(() => {
            const lons = new Float32Array(this.ni * this.nj);
            const lats = new Float32Array(this.ni * this.nj);

            for (let i = 0; i < this.ni; i++) {
                const x = this.ll_x + (this.ur_x - this.ll_x) * i / (this.ni - 1);
                for (let j = 0; j < this.nj; j++) {
                    const y = this.ll_y + (this.ur_y - this.ll_y) * j / (this.nj - 1);

                    const [lon, lat] = this.lcc(x, y, {inverse: true});
                    const idx = i + j * this.ni;
                    lons[idx] = lon;
                    lats[idx] = lat;
                }
            }

            return {lons: lons, lats: lats};
        });
    }

    copy(opts?: {ni?: number, nj?: number, ll_x?: number, ll_y?: number, ur_x?: number, ur_y?: number}) {
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
    getCoords() {
        return this._ll_cache.getValue();
    }

    transform(x: number, y: number, opts?: {inverse?: boolean}) {
        opts = opts === undefined ? {}: opts;
        const inverse = 'inverse' in opts ? opts.inverse : false;

        return this.lcc(x, y, {inverse: inverse});
    }

    getThinnedGrid(thin_x: number, thin_y: number) {
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

        return new LambertGrid(ni, nj, this.lon_0, this.lat_0, this.lat_std, ll_x, ll_y, ur_x, ur_y);
    }
}

/** A class representing a raw 2D field of gridded data, such as height or u wind. */
class RawScalarField {
    readonly grid: Grid;
    readonly data: Float32Array;

    /**
     * Create a data field. 
     * @param grid - The grid on which the data are defined
     * @param data - The data, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid.
     */
    constructor(grid: Grid, data: Float32Array) {
        this.grid = grid;
        this.data = data;

        if (grid.ni * grid.nj != data.length) {
            throw `Data size (${data.length}) doesn't match the grid dimensions (${grid.ni} x ${grid.nj}; expected ${grid.ni * grid.nj} points)`;
        }
    }

    getThinnedField(thin_x: number, thin_y: number) {
        const new_grid = this.grid.getThinnedGrid(thin_x, thin_y);
        const new_data = new Float32Array(new_grid.ni * new_grid.nj);

        for (let i = 0; i < new_grid.ni; i++) {
            for (let j = 0 ; j < new_grid.nj; j++) {
                const idx_old = i * thin_x + this.grid.ni * j * thin_y;
                const idx = i + new_grid.ni * j;

                new_data[idx] = this.data[idx_old];
            }
        }

        return new RawScalarField(new_grid, new_data);
    }

    /**
     * Create a new field by aggregating a number of fields using a specific function
     * @param func - A function that will be applied each element of the field. It should take the same number of arguments as fields you have and return a single number.
     * @param args - The RawScalarFields to aggregate
     * @returns a new gridded field
     * @example
     * // Compute wind speed from u and v
     * wind_speed_field = RawScalarField.aggreateFields(Math.hypot, u_field, v_field);
     */
    static aggregateFields(func: (...args: number[]) => number, ...args: RawScalarField[]) {
        function* mapGenerator<T, U>(gen: Generator<T>, func: (arg: T) => U) {
            for (const elem of gen) {
                yield func(elem);
            }
        }

        const zipped_args = zip(...args.map(a => a.data));
        const agg_data = new Float32Array(mapGenerator(zipped_args, (a: number[]): number => func(...a)));

        return new RawScalarField(args[0].grid, agg_data);
    }
}

type VectorRelativeTo = 'earth' | 'grid';

interface RawVectorFieldOptions {
    /**
     * Whether the vectors are relative to the grid ('grid') or Earth ('earth')
     * @default 'grid'
     */
    relative_to?: VectorRelativeTo;
}

/** A class representing a 2D gridded field of vectors */
class RawVectorField {
    readonly u: RawScalarField;
    readonly v: RawScalarField;
    readonly relative_to: VectorRelativeTo;

    /** @private */
    readonly _rotate_cache: Cache<[], {u: RawScalarField, v: RawScalarField}>

    /**
     * Create a vector field.
     * @param grid - The grid on which the vector components are defined
     * @param u    - The u (east/west) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid
     * @param v    - The v (north/south) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid
     * @param opts - Options for creating the vector field.
     */
    constructor(grid: Grid, u: Float32Array, v: Float32Array, opts?: RawVectorFieldOptions) {
        opts = opts === undefined ? {}: opts;

        this.u = new RawScalarField(grid, u);
        this.v = new RawScalarField(grid, v);
        this.relative_to = opts.relative_to === undefined ? 'grid' : opts.relative_to;

        this._rotate_cache = new Cache(() => {
            const grid = this.u.grid;
            const coords = grid.getCoords();
            const u_rot = new Float32Array(coords.lats.length);
            const v_rot = new Float32Array(coords.lats.length);

            for (let icd = 0; icd < coords.lats.length; icd++) {
                const lon = coords.lons[icd];
                const lat = coords.lats[icd];
                const u = this.u.data[icd];
                const v = this.v.data[icd];

                const [x, y] = grid.transform(lon, lat);
                const [x_pertlon, y_pertlon] = grid.transform(lon + 0.01, lat);
                const mag_pertlon = Math.hypot(x - x_pertlon, y - y_pertlon);

                const x_dotlon = (x_pertlon - x) / mag_pertlon;
                const y_dotlon = (y_pertlon - y) / mag_pertlon;

                let x_dotlat, y_dotlat;

                if (grid.is_conformal) {
                    // If the grid is conformal, v and u are rotated by the same amount in the same direction.
                    x_dotlat = -y_dotlon;
                    y_dotlat = x_dotlon;
                } 
                else {
                    // If the grid is non-conformal, we need a fully general change of basis from grid coordinates to earth coordinates.
                    const [x_pertlat, y_pertlat] = grid.transform(lon, lat + 0.01);
                    const mag_pertlat = Math.hypot(x - x_pertlat, y - y_pertlat);
    
                    x_dotlat = (x_pertlat - x) / mag_pertlat;
                    y_dotlat = (y_pertlat - y) / mag_pertlat;
                }

                u_rot[icd] = x_dotlon * u + y_dotlon * v;
                v_rot[icd] = x_dotlat * u + y_dotlat * v;
            }

            return {u: new RawScalarField(grid, u_rot), v: new RawScalarField(grid, v_rot)};
        })
    }

    getThinnedField(thin_x: number, thin_y: number) {
        const thin_u = this.u.getThinnedField(thin_x, thin_y);
        const thin_v = this.v.getThinnedField(thin_x, thin_y);

        return new RawVectorField(thin_u.grid, thin_u.data, thin_v.data, {relative_to: this.relative_to});
    }

    get grid() {
        return this.u.grid
    }

    toEarthRelative() {
        let u, v;
        if (this.relative_to == 'earth') {
            u = this.u; v = this.v;
        }
        else {
            const {u: u_, v: v_} = this._rotate_cache.getValue();
            u = u_; v = v_;
        }

        return new RawVectorField(u.grid, u.data, v.data, {relative_to: 'earth'});
    }
}

/** A class grid of wind profiles */
class RawProfileField {
    readonly profiles: WindProfile[];
    readonly grid: Grid;

    /**
     * Create a grid of wind profiles
     * @param grid     - The grid on which the profiles are defined
     * @param profiles - The wind profiles themselves, which should be given as a 1D array in row-major order, with the first profile being at the lower-left corner of the grid
     */
    constructor(grid: Grid, profiles: WindProfile[]) {
        this.profiles = profiles;
        this.grid = grid;
    }

    /** Get the gridded storm motion vector field (internal method) */
    getStormMotionGrid() {
        const u = new Float32Array(this.grid.ni * this.grid.nj);
        const v = new Float32Array(this.grid.ni * this.grid.nj);

        this.profiles.forEach(prof => {
            const idx = prof.ilon + this.grid.ni * prof.jlat;
            u[idx] = prof.smu;
            v[idx] = prof.smv;
        });

        return new RawVectorField(this.grid, u, v, {relative_to: 'grid'});
    }
}

export {RawScalarField, RawVectorField, RawProfileField, PlateCarreeGrid, LambertGrid, Grid};
export type {GridType, RawVectorFieldOptions, VectorRelativeTo};