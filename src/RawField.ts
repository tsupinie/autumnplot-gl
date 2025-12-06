
import { Float16Array } from "@petamoriken/float16";
import { ContourData, TypedArray, TypedArrayStr, WebGLAnyRenderingContext, WindProfile, isStormRelativeWindProfile } from "./AutumnTypes";
import { contourCreator, FieldContourOpts } from "./ContourCreator";
import { AutoZoomGrid, Grid } from "./Grid";
import { Cache, getArrayConstructor, zip } from "./utils";
import { WGLTextureSpec } from "autumn-wgl";
import { getGLFormatTypeAlignment } from "./PlotComponent";

type TextureDataType<ArrayType> = ArrayType extends Float32Array ? Float32Array : (ArrayType extends Uint8Array ? Uint8Array : Uint16Array);

function getArrayDType(ary: TypedArray) : TypedArrayStr {
    if (ary instanceof Float32Array) {
        return 'float32';
    }
    else if (ary instanceof Uint8Array) {
        return 'uint8';
    }
    return 'float16';
}

/** A class representing a raw 2D field of gridded data, such as height or u wind. */
class RawScalarField<ArrayType extends TypedArray, GridType extends Grid> {
    public readonly grid: GridType;
    public readonly data: ArrayType;

    private readonly contour_cache: Cache<[FieldContourOpts], Promise<ContourData>>;

    /**
     * Create a data field. 
     * @param grid - The grid on which the data are defined
     * @param data - The data, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid.
     */
    constructor(grid: GridType, data: ArrayType) {
        this.grid = grid;
        this.data = data;

        if (grid.ni * grid.nj != data.length) {
            throw `Data size (${data.length}) doesn't match the grid dimensions (${grid.ni} x ${grid.nj}; expected ${grid.ni * grid.nj} points)`;
        }

        this.contour_cache = new Cache(async (opts: FieldContourOpts) => {
            return await contourCreator(this.data, this.grid, opts);
        });
    }

    /** @internal */
    private getTextureData() : TextureDataType<ArrayType> {
        // Need to give float16 data as uint16s to make WebGL happy: https://github.com/petamoriken/float16/issues/105
        const raw_data = this.data;
        const raw_data_type = getArrayDType(raw_data);
        const data: any = (raw_data_type == 'float32' || raw_data_type == 'uint8') ? raw_data : new Uint16Array(raw_data.buffer);
        return data as TextureDataType<ArrayType>;
    }

    public getWGLTextureSpec(gl: WebGLAnyRenderingContext, image_mag_filter: number) : WGLTextureSpec {
        const tex_data = this.getTextureData();
        const {format, type, row_alignment} = getGLFormatTypeAlignment(gl, getArrayDType(this.data));
    
        return {'format': format, 'type': type,
            'width': this.grid.ni, 'height': this.grid.nj, 'image': tex_data,
            'mag_filter': image_mag_filter, 'row_alignment': row_alignment,
        };
    }

    /**
     * Get contour data as an object with each contour level being a separate property. 
     * @param opts - Options for doing the contouring
     * @returns contour data as an object
     */
    public async getContours(opts: FieldContourOpts) {
        return await this.contour_cache.getValue(opts);
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
    public static aggregateFields<ArrayType extends TypedArray, GridType extends Grid>(func: (...args: number[]) => number, ...args: RawScalarField<ArrayType, GridType>[]) {
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

    public sampleField(lon: number, lat: number) {
        return this.grid.sampleNearestGridPoint(lon, lat, this.data).sample;
    }
}

/** The basis vectors for vector fields (i.e, whether vectors a relative to Earth or the grid) */
type VectorRelativeTo = 'earth' | 'grid';

/** Options for {@link RawVectorField}s */
interface RawVectorFieldOptions {
    /**
     * Whether the vectors are relative to the grid ('grid') or Earth ('earth')
     * @default 'grid'
     */
    relative_to?: VectorRelativeTo;
}

/** A class representing a 2D gridded field of vectors */
class RawVectorField<ArrayType extends TypedArray, GridType extends AutoZoomGrid<Grid>> {
    public readonly u: RawScalarField<ArrayType, GridType>;
    public readonly v: RawScalarField<ArrayType, GridType>;
    public readonly relative_to: VectorRelativeTo;

    /**
     * Create a vector field.
     * @param grid - The grid on which the vector components are defined
     * @param u    - The u (east/west) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid
     * @param v    - The v (north/south) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid
     * @param opts - Options for creating the vector field.
     */
    constructor(grid: GridType, u: ArrayType, v: ArrayType, opts?: RawVectorFieldOptions) {
        opts = opts === undefined ? {}: opts;

        this.u = new RawScalarField(grid, u);
        this.v = new RawScalarField(grid, v);
        this.relative_to = opts.relative_to === undefined ? 'grid' : opts.relative_to;
    }

    /** @internal */
    private getTextureData() {
        // Need to give float16 data as uint16s to make WebGL happy: https://github.com/petamoriken/float16/issues/105
        const raw_u = this.u.data;
        const raw_v = this.v.data;

        const u_raw_data_type = getArrayDType(raw_u);
        const v_raw_data_type = getArrayDType(raw_u);

        const u: any = (u_raw_data_type == 'float32' || u_raw_data_type == 'uint8') ? raw_u : new Uint16Array(raw_u.buffer);
        const v: any = (v_raw_data_type == 'float32' || v_raw_data_type == 'uint8') ? raw_v : new Uint16Array(raw_v.buffer);

        return {u: u as TextureDataType<ArrayType>, v: v as TextureDataType<ArrayType>};
    }

    public getWGLTextureSpecs(gl: WebGLAnyRenderingContext, mag_filter: number) : {u: WGLTextureSpec, v: WGLTextureSpec} {
        const {u: u_thin, v: v_thin} = this.getTextureData();

        const {format, type, row_alignment} = getGLFormatTypeAlignment(gl, getArrayDType(this.u.data));

        const u_image = {'format': format, 'type': type,
            'width': this.grid.ni, 'height': this.grid.nj, 'image': u_thin,
            'mag_filter': mag_filter, 'row_alignment': row_alignment,
        };

        const v_image = {'format': format, 'type': type,
            'width': this.grid.ni, 'height': this.grid.nj, 'image': v_thin,
            'mag_filter': mag_filter, 'row_alignment': row_alignment,
        };

        return {u: u_image, v: v_image};
    }

    /** @internal */
    public getThinnedField(thin_fac: number, map_max_zoom: number) {
        const new_grid = this.grid.getThinnedGrid(thin_fac, map_max_zoom);

        const thin_u = new_grid.thinDataArray(this.grid, this.u.data);
        const thin_v = new_grid.thinDataArray(this.grid, this.v.data);

        return new RawVectorField(new_grid, thin_u, thin_v, {relative_to: this.relative_to});
    }

    /** @internal */
    public get grid() {
        return this.u.grid
    }

    public sampleField(lon: number, lat: number) : [number, number] {
        const u_sample = this.grid.sampleNearestGridPoint(lon, lat, this.u.data);
        const v_sample = this.grid.sampleNearestGridPoint(lon, lat, this.v.data);

        const rot = this.relative_to == 'earth' ? 0 : this.grid.getVectorRotationAtPoint(u_sample.sample_lon, u_sample.sample_lat);
        const mag = Math.hypot(u_sample.sample, v_sample.sample);
        let brg = (Math.PI / 2 - Math.atan2(-v_sample.sample, -u_sample.sample) + rot) * 180 / Math.PI;

        if (brg > 360) brg -= 360;
        if (brg < 0) brg += 360;

        return [brg, mag];
    }
}

/** A class grid of wind profiles */
class RawProfileField<GridType extends AutoZoomGrid<Grid>> {
    public readonly profiles: WindProfile[];
    public readonly grid: GridType;

    /**
     * Create a grid of wind profiles
     * @param grid     - The grid on which the profiles are defined
     * @param profiles - The wind profiles themselves, which should be given as a 1D array in row-major order, with the first profile being at the lower-left corner of the grid
     */
    constructor(grid: GridType, profiles: WindProfile[]) {
        this.profiles = profiles;
        this.grid = grid;
    }

    /** 
     * @internal
     * Get the gridded storm motion vector field
     */
    public getStormMotionGrid() {
        const profiles = this.profiles
        const u = new Float16Array(this.grid.ni * this.grid.nj).fill(parseFloat('nan'));
        const v = new Float16Array(this.grid.ni * this.grid.nj).fill(parseFloat('nan'));

        profiles.forEach(prof => {
            const idx = prof.ilon + this.grid.ni * prof.jlat;
            if (isStormRelativeWindProfile(prof)) {
                u[idx] = prof.smu;
                v[idx] = prof.smv;
            }
            else {
                u[idx] = 0;
                v[idx] = 0;
            }
        });

        return new RawVectorField(this.grid, u, v, {relative_to: 'grid'});
    }

    /** @internal */
    public getProfileCoords() {
        const {lats, lons} = this.grid.getEarthCoords();
        const prof_lats = new Float32Array(this.profiles.length);
        const prof_lons = new Float32Array(this.profiles.length);

        this.profiles.forEach((prof, iprof) => {
            const idx = prof.ilon + prof.jlat * this.grid.ni;
            prof_lats[iprof] = lats[idx];
            prof_lons[iprof] = lons[idx];
        });

        return {lats: prof_lats, lons: prof_lons};
    }
}

/** 
 * Type for an observation data point
 * @example
 * const obs : ObsRawData<'t' | 'td'> = {'t': 71, 'td': 66};
 */
type ObsRawData<ObsFieldName extends string> = Record<ObsFieldName, string | number | [number, number] | null>;

/** Raw observation data, given as a list of objects */
class RawObsField<GridType extends AutoZoomGrid<Grid>, ObsFieldName extends string> {
    public readonly grid: GridType;
    public readonly data: ObsRawData<ObsFieldName>[];

    /**
     * Create a field of observations
     * @param grid - The grid on which the obs are defined (can be either a structured or unstructured grid)
     * @param data - The observation data. Conceptually, obs are given as a list of individual observations.
     */
    constructor(grid: GridType, data: ObsRawData<ObsFieldName>[]) {
        this.grid = grid;
        this.data = data;
    }

    /** 
     * @internal
     * Get observation element as a list of scalar numbers 
     */
    getScalar(key: ObsFieldName) {
        const field_data = this.data.map(d => d[key]);
        if (!field_data.map(d => typeof d == 'number' || d === null).reduce((a, b) => a && b, true))
            throw `It doesn't look like ${key} contains scalar numerical data`;

        return field_data as (number | null)[];
    }

    /** 
     * @internal
     * Get observed element as a list of strings (internal method)
     */
    getStrings(key: ObsFieldName) {
        const field_data = this.data.map(d => d[key]);
        if (!field_data.map(d => typeof d == 'string' || d === null).reduce((a, b) => a && b, true))
            throw `It doesn't look like ${key} contains string data`;

        return field_data as (string | null)[];
    }

    /** 
     * @internal
     * Get observed element as a list of vectors (internal method) 
     */
    getVector(key: ObsFieldName) {
        const field_data = this.data.map(d => d[key]);
        if (!field_data.map(d => Array.isArray(d)).reduce((a, b) => a && b, true))
            throw `It doesn't look like ${key} contains vector data`;

        const vector_field_data = field_data as [number | null, number | null][];

        const vec2comp = (wspd: number, wdir: number) => {
            const u = -wspd * Math.sin(wdir * Math.PI / 180);
            const v = -wspd * Math.cos(wdir * Math.PI / 180);
            return [u, v];
        }

        const u_data = new Float16Array(this.grid.ni * this.grid.nj).fill(parseFloat('nan'));
        const v_data = new Float16Array(this.grid.ni * this.grid.nj).fill(parseFloat('nan'));

        vector_field_data.forEach(([wspd, wdir], idat) => {
            if (wspd === null || wdir === null) {
                return;
            }

            const [u, v] = vec2comp(wspd, wdir);
            u_data[idat] = u;
            v_data[idat] = v;
        });

        return new RawVectorField(this.grid, u_data, v_data, {relative_to: 'earth'});
    }
}

export {RawScalarField, RawVectorField, RawProfileField, RawObsField};
export type {RawVectorFieldOptions, VectorRelativeTo, TextureDataType, ObsRawData};