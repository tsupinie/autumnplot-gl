
import { Float16Array } from "@petamoriken/float16";
import { TypedArray, WebGLAnyRenderingContext, WindProfile } from "./AutumnTypes";
import { lambertConformalConic, rotateSphere } from "./Map";
import { layer_worker } from "./PlotComponent";
import { Cache, zip } from "./utils";
import { WGLBuffer } from "autumn-wgl";

interface Coords {
    lons: Float32Array;
    lats: Float32Array;
}

async function makeWGLDomainBuffers(gl: WebGLAnyRenderingContext, grid: Grid, native_grid?: Grid) {
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

async function makeWGLBillboardBuffers(gl: WebGLAnyRenderingContext, grid: Grid, thin_fac: number, max_zoom: number) {
    const {lats: field_lats, lons: field_lons} = grid.getCoords();
    const bb_elements = await layer_worker.makeBBElements(field_lats, field_lons, grid.ni, grid.nj, thin_fac, max_zoom);

    const vertices = new WGLBuffer(gl, bb_elements['pts'], 3, gl.TRIANGLE_STRIP);
    const texcoords = new WGLBuffer(gl, bb_elements['tex_coords'], 2, gl.TRIANGLE_STRIP);

    return {'vertices': vertices, 'texcoords': texcoords};
}

type GridType = 'latlon' | 'latlonrot' | 'lcc';

abstract class Grid {
    public readonly type: GridType;
    public readonly ni: number;
    public readonly nj: number;
    public readonly is_conformal: boolean;

    private readonly buffer_cache: Cache<[WebGLAnyRenderingContext], Promise<{'vertices': WGLBuffer, 'texcoords': WGLBuffer, 'cellsize': WGLBuffer}>>;
    private readonly billboard_buffer_cache: Cache<[WebGLAnyRenderingContext, number, number], Promise<{'vertices': WGLBuffer, 'texcoords': WGLBuffer}>>;

    constructor(type: GridType, is_conformal: boolean, ni: number, nj: number) {
        this.type = type;
        this.is_conformal = is_conformal;
        this.ni = ni;
        this.nj = nj;

        this.buffer_cache = new Cache((gl: WebGLAnyRenderingContext) => {
            const new_ni = Math.max(Math.floor(this.ni / 50), 20);
            const new_nj = Math.max(Math.floor(this.nj / 50), 20);
            return makeWGLDomainBuffers(gl, this.copy({ni: new_ni, nj: new_nj}), this);
        });

        this.billboard_buffer_cache = new Cache((gl: WebGLAnyRenderingContext, thin_fac: number, max_zoom: number) => {
            return makeWGLBillboardBuffers(gl, this, thin_fac, max_zoom);
        });
    }

    public abstract copy(opts?: {ni?: number, nj?: number}): Grid;

    public abstract getCoords(): Coords;
    public abstract transform(x: number, y: number, opts?: {inverse?: boolean}): [number, number];
    abstract getThinnedGrid(thin_x: number, thin_y: number): Grid;
    
    public async getWGLBuffers(gl: WebGLAnyRenderingContext) {
        return await this.buffer_cache.getValue(gl);
    }

    public async getWGLBillboardBuffers(gl: WebGLAnyRenderingContext, thin_fac: number, max_zoom: number) {
        return await this.billboard_buffer_cache.getValue(gl, thin_fac, max_zoom);
    }
}

/** A plate carree (a.k.a. lat/lon) grid with uniform grid spacing */
class PlateCarreeGrid extends Grid {
    public readonly ll_lon: number;
    public readonly ll_lat: number;
    public readonly ur_lon: number;
    public readonly ur_lat: number;

    private readonly ll_cache: Cache<[], Coords>;

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

        this.ll_cache = new Cache(() => {
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
    public getCoords() {
        return this.ll_cache.getValue();
    }

    public transform(x: number, y: number, opts?: {inverse?: boolean}) {
        return [x, y] as [number, number];
    }

    public getThinnedGrid(thin_x: number, thin_y: number) {
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

/** A rotated lat-lon (plate carree) grid with uniform grid spacing */
class PlateCarreeRotatedGrid extends Grid {
    public readonly np_lon: number;
    public readonly np_lat: number;
    public readonly lon_shift: number;
    public readonly ll_lon: number;
    public readonly ll_lat: number;
    public readonly ur_lon: number;
    public readonly ur_lat: number;

    private readonly llrot: (a: number, b: number, opts?: {inverse: boolean}) => [number, number];
    private readonly ll_cache: Cache<[], Coords>;

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
    constructor(ni: number, nj: number, np_lon: number, np_lat: number, lon_shift: number, ll_lon: number, ll_lat: number, ur_lon: number, ur_lat: number) {
        super('latlonrot', true, ni, nj);

        this.np_lon = np_lon;
        this.np_lat = np_lat;
        this.lon_shift = lon_shift;
        this.ll_lon = ll_lon;
        this.ll_lat = ll_lat;
        this.ur_lon = ur_lon;
        this.ur_lat = ur_lat;
        this.llrot = rotateSphere({np_lon: np_lon, np_lat: np_lat, lon_shift: lon_shift});

        this.ll_cache = new Cache(() => {
            const lons = new Float32Array(this.ni * this.nj);
            const lats = new Float32Array(this.ni * this.nj);

            for (let i = 0; i < this.ni; i++) {
                const lon_p = this.ll_lon + (this.ur_lon - this.ll_lon) * i / (this.ni - 1);
                for (let j = 0; j < this.nj; j++) {
                    const lat_p = this.ll_lat + (this.ur_lat - this.ll_lat) * j / (this.nj - 1);

                    const [lon, lat] = this.llrot(lon_p, lat_p);
                    const idx = i + j * this.ni;
                    lons[idx] = lon;
                    lats[idx] = lat;
                }
            }

            return {lons: lons, lats: lats};
        });
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
    public getCoords() {
        return this.ll_cache.getValue();
    }

    public transform(x: number, y: number, opts?: {inverse?: boolean}) {
        opts = opts === undefined ? {}: opts;
        const inverse = 'inverse' in opts ? opts.inverse : false;

        return this.llrot(x, y, {inverse: !inverse});
    }

    public getThinnedGrid(thin_x: number, thin_y: number) {
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

        return new PlateCarreeRotatedGrid(ni, nj, this.np_lon, this.np_lat, this.lon_shift, ll_lon, ll_lat, ur_lon, ur_lat);
    }
}

/** A Lambert conformal conic grid with uniform grid spacing */
class LambertGrid extends Grid {
    public readonly lon_0: number;
    public readonly lat_0: number;
    public readonly lat_std: [number, number];
    public readonly ll_x: number;
    public readonly ll_y: number;
    public readonly ur_x: number;
    public readonly ur_y: number;

    private readonly lcc: (a: number, b: number, opts?: {inverse: boolean}) => [number, number];
    private readonly ll_cache: Cache<[], Coords>;

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

        this.ll_cache = new Cache(() => {
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
    public getCoords() {
        return this.ll_cache.getValue();
    }

    public transform(x: number, y: number, opts?: {inverse?: boolean}) {
        opts = opts === undefined ? {}: opts;
        const inverse = 'inverse' in opts ? opts.inverse : false;

        return this.lcc(x, y, {inverse: inverse});
    }

    public getThinnedGrid(thin_x: number, thin_y: number) {
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

type TextureDataType<ArrayType> = ArrayType extends Float32Array ? Float32Array : Uint16Array;

function getArrayConstructor<ArrayType extends TypedArray>(ary: ArrayType) : new(...args: any[]) => ArrayType {
    return ary.constructor as new(...args: any[]) => ArrayType;
}

/** A class representing a raw 2D field of gridded data, such as height or u wind. */
class RawScalarField<ArrayType extends TypedArray> {
    public readonly grid: Grid;
    public readonly data: ArrayType;

    /**
     * Create a data field. 
     * @param grid - The grid on which the data are defined
     * @param data - The data, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid.
     */
    constructor(grid: Grid, data: ArrayType) {
        this.grid = grid;
        this.data = data;

        if (grid.ni * grid.nj != data.length) {
            throw `Data size (${data.length}) doesn't match the grid dimensions (${grid.ni} x ${grid.nj}; expected ${grid.ni * grid.nj} points)`;
        }
    }

    /** @internal */
    public getTextureData() : TextureDataType<ArrayType> {
        // Need to give float16 data as uint16s to make WebGL happy: https://github.com/petamoriken/float16/issues/105
        let data: any;
        if (this.data instanceof Float32Array) {
            data = this.data;
        }
        else {
            data = new Uint16Array(this.data.buffer);
        }

        return data as TextureDataType<ArrayType>;
    }
    
    public isFloat16() {
        return !(this.data instanceof Float32Array);
    }

    public getThinnedField(thin_x: number, thin_y: number) {
        const arrayType = getArrayConstructor(this.data);

        const new_grid = this.grid.getThinnedGrid(thin_x, thin_y);
        const new_data = new arrayType(new_grid.ni * new_grid.nj);

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
    public static aggregateFields<ArrayType extends TypedArray>(func: (...args: number[]) => number, ...args: RawScalarField<ArrayType>[]) {
        function* mapGenerator<T, U>(gen: Generator<T>, func: (arg: T) => U) {
            for (const elem of gen) {
                yield func(elem);
            }
        }

        const arrayType = getArrayConstructor(args[0].data);
        const zipped_args = zip(...args.map(a => a.data));
        const agg_data = new arrayType(mapGenerator(zipped_args, (a: number[]): number => func(...a)));

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
class RawVectorField<ArrayType extends TypedArray> {
    public readonly u: RawScalarField<ArrayType>;
    public readonly v: RawScalarField<ArrayType>;
    public readonly relative_to: VectorRelativeTo;

    private readonly rotate_cache: Cache<[], {u: RawScalarField<ArrayType>, v: RawScalarField<ArrayType>}>

    /**
     * Create a vector field.
     * @param grid - The grid on which the vector components are defined
     * @param u    - The u (east/west) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid
     * @param v    - The v (north/south) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid
     * @param opts - Options for creating the vector field.
     */
    constructor(grid: Grid, u: ArrayType, v: ArrayType, opts?: RawVectorFieldOptions) {
        opts = opts === undefined ? {}: opts;

        const arrayType = getArrayConstructor(u);

        this.u = new RawScalarField(grid, u);
        this.v = new RawScalarField(grid, v);
        this.relative_to = opts.relative_to === undefined ? 'grid' : opts.relative_to;

        this.rotate_cache = new Cache(() => {
            const grid = this.u.grid;
            const coords = grid.getCoords();
            const u_rot = new arrayType(coords.lats.length);
            const v_rot = new arrayType(coords.lats.length);

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

    public getThinnedField(thin_x: number, thin_y: number) {
        const thin_u = this.u.getThinnedField(thin_x, thin_y);
        const thin_v = this.v.getThinnedField(thin_x, thin_y);

        return new RawVectorField(thin_u.grid, thin_u.data, thin_v.data, {relative_to: this.relative_to});
    }

    public get grid() {
        return this.u.grid
    }

    public toEarthRelative() {
        let u, v;
        if (this.relative_to == 'earth') {
            u = this.u; v = this.v;
        }
        else {
            const {u: u_, v: v_} = this.rotate_cache.getValue();
            u = u_; v = v_;
        }

        return new RawVectorField(u.grid, u.data, v.data, {relative_to: 'earth'});
    }
}

/** A class grid of wind profiles */
class RawProfileField {
    public readonly profiles: WindProfile[];
    public readonly grid: Grid;

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
    public getStormMotionGrid() {
        const u = new Float16Array(this.grid.ni * this.grid.nj);
        const v = new Float16Array(this.grid.ni * this.grid.nj);

        this.profiles.forEach(prof => {
            const idx = prof.ilon + this.grid.ni * prof.jlat;
            u[idx] = prof.smu;
            v[idx] = prof.smv;
        });

        return new RawVectorField(this.grid, u, v, {relative_to: 'grid'});
    }
}

export {RawScalarField, RawVectorField, RawProfileField, PlateCarreeGrid, PlateCarreeRotatedGrid, LambertGrid, Grid};
export type {GridType, RawVectorFieldOptions, VectorRelativeTo, TextureDataType};