
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

async function makeWGLDomainBuffers(gl: WebGLRenderingContext, grid: Grid) {
    const {lats: field_lats, lons: field_lons} = grid.getCoords();
    const domain_coords = await layer_worker.makeDomainVerticesAndTexCoords(field_lats, field_lons, grid.ni, grid.nj);

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

    readonly _buffer_cache: Cache<[WebGLRenderingContext], Promise<{'vertices': WGLBuffer, 'texcoords': WGLBuffer, 'cellsize': WGLBuffer}>>;
    readonly _billboard_buffer_cache: Cache<[WebGLRenderingContext, number, number], Promise<{'vertices': WGLBuffer, 'texcoords': WGLBuffer}>>;

    constructor(type: GridType, ni: number, nj: number) {
        this.type = type;
        this.ni = ni;
        this.nj = nj;

        this._buffer_cache = new Cache((gl: WebGLRenderingContext) => {
            return makeWGLDomainBuffers(gl, this);
        });

        this._billboard_buffer_cache = new Cache((gl: WebGLRenderingContext, thin_fac: number, max_zoom: number) => {
            return makeWGLBillboardBuffers(gl, this, thin_fac, max_zoom);
        });
    }

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
        super('latlon', ni, nj);

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

class LambertGrid extends Grid {
    readonly lon_0: number;
    readonly lat_0: number;
    readonly lat_std: [number, number];
    readonly ll_x: number;
    readonly ll_y: number;
    readonly ur_x: number;
    readonly ur_y: number;
    readonly lcc: (a: number, b: number, opts?: {inverse: boolean}) => [number, number];

    readonly _ll_cache: Cache<[], Coords>;

    constructor(ni: number, nj: number, lon_0: number, lat_0: number, lat_std: [number, number], 
                ll_x: number, ll_y: number, ur_x: number, ur_y: number) {
        super('lcc', ni, nj);

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

//type RawVectorField = {u: RawScalarField, v: RawScalarField};
type VectorRelativeTo = 'earth' | 'grid';

class RawVectorField {
    readonly u: RawScalarField;
    readonly v: RawScalarField;
    readonly relative_to: VectorRelativeTo;

    readonly _rotate_cache: Cache<[], {u: RawScalarField, v: RawScalarField}>

    constructor(grid: Grid, u: Float32Array, v: Float32Array, relative_to?: VectorRelativeTo) {
        this.u = new RawScalarField(grid, u);
        this.v = new RawScalarField(grid, v);
        this.relative_to = relative_to === undefined ? 'grid' : relative_to;

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
                const [x_pertlat, y_pertlat] = grid.transform(lon, lat + 0.01);

                const mag_pertlon = Math.hypot(x - x_pertlon, y - y_pertlon);
                const mag_pertlat = Math.hypot(x - x_pertlat, y - y_pertlat);

                // This is effectively a fully general change of basis from grid coordinates to earth coordinates. Is it overkill? Yeah, probably.
                const x_dotlon = (x_pertlon - x) / mag_pertlon;
                const y_dotlon = (y_pertlon - y) / mag_pertlon;
                const x_dotlat = (x_pertlat - x) / mag_pertlat;
                const y_dotlat = (y_pertlat - y) / mag_pertlat;

                u_rot[icd] = x_dotlon * u + y_dotlon * v;
                v_rot[icd] = x_dotlat * u + y_dotlat * v;
            }

            return {u: new RawScalarField(grid, u_rot), v: new RawScalarField(grid, v_rot)};
        })
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

        return new RawVectorField(u.grid, u.data, v.data, 'earth');
    }
}

class RawProfileField {
    readonly profiles: WindProfile[];
    readonly grid: Grid;

    constructor(grid: Grid, profiles: WindProfile[]) {
        this.profiles = profiles;
        this.grid = grid;
    }

    getStormMotionGrid() {
        const u = new Float32Array(this.grid.ni * this.grid.nj);
        const v = new Float32Array(this.grid.ni * this.grid.nj);

        this.profiles.forEach(prof => {
            const idx = prof.ilon + this.grid.ni * prof.jlat;
            u[idx] = prof.smu;
            v[idx] = prof.smv;
        });

        return new RawVectorField(this.grid, u, v, 'grid');
    }
}

export {RawScalarField, RawVectorField, RawProfileField, PlateCarreeGrid, LambertGrid};
export type {Grid};