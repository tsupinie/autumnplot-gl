
import { Float16Array } from "@petamoriken/float16";
import { ContourData, TypedArray, WindProfile } from "./AutumnTypes";
import { contourCreator, FieldContourOpts } from "./ContourCreator";
import { Grid } from "./Grid";
import { Cache, zip } from "./utils";

type TextureDataType<ArrayType> = ArrayType extends Float32Array ? Float32Array : Uint16Array;

function getArrayConstructor<ArrayType extends TypedArray>(ary: ArrayType) : new(...args: any[]) => ArrayType {
    return ary.constructor as new(...args: any[]) => ArrayType;
}

/** A class representing a raw 2D field of gridded data, such as height or u wind. */
class RawScalarField<ArrayType extends TypedArray> {
    public readonly grid: Grid;
    public readonly data: ArrayType;

    private readonly contour_cache: Cache<[FieldContourOpts], Promise<ContourData>>;

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

        this.contour_cache = new Cache(async (opts: FieldContourOpts) => {
            return await contourCreator(this.data, this.grid, opts);
        });
    }

    /** @internal */
    public getTextureData() : TextureDataType<ArrayType> {
        // Need to give float16 data as uint16s to make WebGL happy: https://github.com/petamoriken/float16/issues/105
        const raw_data = this.data;
        let data: any;
        if (raw_data instanceof Float32Array) {
            data = raw_data;
        }
        else {
            data = new Uint16Array(raw_data.buffer);
        }

        return data as TextureDataType<ArrayType>;
    }

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

    /**
     * Create a vector field.
     * @param grid - The grid on which the vector components are defined
     * @param u    - The u (east/west) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid
     * @param v    - The v (north/south) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid
     * @param opts - Options for creating the vector field.
     */
    constructor(grid: Grid, u: ArrayType, v: ArrayType, opts?: RawVectorFieldOptions) {
        opts = opts === undefined ? {}: opts;

        this.u = new RawScalarField(grid, u);
        this.v = new RawScalarField(grid, v);
        this.relative_to = opts.relative_to === undefined ? 'grid' : opts.relative_to;
    }

    public getTextureData() {
        // Need to give float16 data as uint16s to make WebGL happy: https://github.com/petamoriken/float16/issues/105
        const raw_u = this.u.data;
        const raw_v = this.v.data;

        const u: any = raw_u instanceof Float32Array ? raw_u : new Uint16Array(raw_u.buffer);
        const v: any = raw_v instanceof Float32Array ? raw_v : new Uint16Array(raw_v.buffer);

        return {u: u as TextureDataType<ArrayType>, v: v as TextureDataType<ArrayType>};
    }

    public getThinnedField(thin_x: number, thin_y: number) {
        const new_grid = this.grid.getThinnedGrid(thin_x, thin_y);

        const thinGrid = (data: ArrayType) => {
            const arrayType = getArrayConstructor(data);
            const new_data = new arrayType(new_grid.ni * new_grid.nj);
    
            for (let i = 0; i < new_grid.ni; i++) {
                for (let j = 0 ; j < new_grid.nj; j++) {
                    const idx_old = i * thin_x + this.grid.ni * j * thin_y;
                    const idx = i + new_grid.ni * j;
    
                    new_data[idx] = data[idx_old];
                }
            }

            return new_data;
        }

        const thin_u = thinGrid(this.u.data);
        const thin_v = thinGrid(this.v.data);

        return new RawVectorField(new_grid, thin_u, thin_v, {relative_to: this.relative_to});
    }

    public get grid() {
        return this.u.grid
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
        const profiles = this.profiles
        const u = new Float16Array(this.grid.ni * this.grid.nj).fill(parseFloat('nan'));
        const v = new Float16Array(this.grid.ni * this.grid.nj).fill(parseFloat('nan'));

        profiles.forEach(prof => {
            const idx = prof.ilon + this.grid.ni * prof.jlat;
            u[idx] = prof.smu;
            v[idx] = prof.smv;
        });

        return new RawVectorField(this.grid, u, v, {relative_to: 'grid'});
    }
}

export {RawScalarField, RawVectorField, RawProfileField};
export type {RawVectorFieldOptions, VectorRelativeTo, TextureDataType};