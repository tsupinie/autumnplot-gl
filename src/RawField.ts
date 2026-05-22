
import { Float16Array } from "@petamoriken/float16";
import { ContourData, TypedArray, TypedArrayStr, WebGLAnyRenderingContext, WindProfile, isContourable, isStormRelativeWindProfile } from "./AutumnTypes";
import { FieldContourOpts } from "./ContourCreator.worker";
import { Grid } from "./grids/Grid";
import { Cache, getArrayConstructor, normalizeOptions, zip } from "./utils";
import { WGLTexture, WGLTextureSpec } from "autumn-wgl";
import { getContourWorkerPool, getGLFormatTypeAlignment } from "./PlotComponent";
import { AutoZoomGrid } from "./grids/AutoZoom";

type TextureDataType<ArrayType> = ArrayType extends Float32Array ? Float32Array : 
                                 (ArrayType extends Uint8Array ? Uint8Array : 
                                 (ArrayType extends Uint32Array ? Uint32Array : 
                                 (ArrayType extends Int32Array ? Int32Array : 
                                 (ArrayType extends Int16Array ? Int16Array : Uint16Array))));

function getArrayDType(ary: TypedArray) : TypedArrayStr {
    if (ary instanceof Float32Array) {
        return 'float32';
    }
    else if (ary instanceof Uint8Array) {
        return 'uint8';
    }
    else if (ary instanceof Uint16Array) {
        return 'uint16';
    }
    else if (ary instanceof Uint32Array) {
        return 'uint32';
    }
    else if (ary instanceof Int16Array) {
        return 'int16';
    }
    else if (ary instanceof Int32Array) {
        return 'int32';
    }
    return 'float16';
}

interface RawScalarFieldOpts {
    /**
     * Value to use as the "missing" value.
     * @default NaN
     */
    missing_value?: number;
};

const field_opt_defaults: Required<RawScalarFieldOpts> = {
    missing_value: NaN
};

abstract class ExpressionScalarField<ArrayType extends TypedArray, GridType extends Grid> {
    public abstract updateTexImageData(gl: WebGLAnyRenderingContext, image_mag_filter: number, fill_textures: Map<string, WGLTexture> | null) : Map<string, WGLTexture>;
    public abstract getSamplerIds(): string[];
    public abstract getExpression(): string;
    public abstract renderCPU(): RawScalarField<ArrayType, GridType>;
    public abstract iterateCPU(): Generator<number, void, unknown>;

    abstract get grid() : GridType;
    abstract get aryConstructor() : new(...args: any[]) => ArrayType;
    abstract get dtypes() : TypedArrayStr[];
    abstract get missing_value() : number;

    private operand(other: ExpressionScalarField<ArrayType, GridType> | number, operand: '+' | '-' | '*' | '/'): ComputedScalarField<ArrayType, GridType> {
        const FUNCS = {
            '+': (a: number, b: number) => a + b,
            '-': (a: number, b: number) => a - b,
            '*': (a: number, b: number) => a * b,
            '/': (a: number, b: number) => a / b,
        };

        if (typeof other === 'number') {
            return new ComputedScalarField([this], `{0} ${operand} ${other.toFixed(100)}`, v => FUNCS[operand](v, other));
        }

        return new ComputedScalarField([this, other], `{0} ${operand} {1}`, FUNCS[operand]);
    }

    /**
     * Multiply this field by another scalar. The computation occurs on the GPU if the resulting field is used in a plot component or on the CPU if 
     *  {@link ComputedScalarField.renderCPU | renderCPU()} is called on the resulting field.
     * @param other - Scalar to multiply this field by
     * @returns A `ComputedScalarField` representing the multiplied field
     */
    public multiply(other: ExpressionScalarField<ArrayType, GridType> | number): ComputedScalarField<ArrayType, GridType> {
        return this.operand(other, '*');
    }

    /**
     * Divide this field by another scalar. The computation occurs on the GPU if the resulting field is used in a plot component or on the CPU if
     * {@link ComputedScalarField.renderCPU | renderCPU()} is called on the resulting field.
     * @param other - Scalar to divide this field by
     * @returns A `ComputedScalarField` representing the divided field
     */
    public divide(other: ExpressionScalarField<ArrayType, GridType> | number): ComputedScalarField<ArrayType, GridType> {
        return this.operand(other, '/');
    }

    /**
     * Add this field to another scalar. The computation occurs on the GPU if the resulting field is used in a plot component or on the CPU if 
     *  {@link ComputedScalarField.renderCPU | renderCPU()} is called on the resulting field.
     * @param other - Scalar to add to this field
     * @returns A `ComputedScalarField` representing the added field
     */
    public add(other: ExpressionScalarField<ArrayType, GridType> | number): ComputedScalarField<ArrayType, GridType> {
        return this.operand(other, '+');
    }

    /**
     * Subtract another scalar from this field. The computation occurs on the GPU if the resulting field is used in a plot component or on the CPU if
     *  {@link ComputedScalarField.renderCPU | renderCPU()} is called on the resulting field.
     * @param other - Scalar to subtract from this field
     * @returns A `ComputedScalarField` representing the subtracted field
     */
    public subtract(other: ExpressionScalarField<ArrayType, GridType> | number): ComputedScalarField<ArrayType, GridType> {
        return this.operand(other, '-');
    }

    public abstract getThinnedField(thin_fac: number, map_max_zoom: number) : this;

    public abstract sampleField(lon: number, lat: number) : number;
    public abstract sampleFieldWithCoord(lon: number, lat: number) : {sample: number, sample_lon: number, sample_lat: number};
}

/** A class representing a raw 2D field of gridded data, such as height or u wind. */
class RawScalarField<ArrayType extends TypedArray, GridType extends Grid> extends ExpressionScalarField<ArrayType, GridType> {
    public readonly grid: GridType;
    public readonly data: ArrayType;
    public readonly opts: Required<RawScalarFieldOpts>;

    private readonly contour_cache: Cache<[FieldContourOpts], Promise<ContourData>>;

    /**
     * Create a data field. 
     * @param grid - The grid on which the data are defined
     * @param data - The data, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid.
     */
    constructor(grid: GridType, data: ArrayType, opts?: RawScalarFieldOpts) {
        super();

        this.grid = grid;
        this.data = data;
        this.opts = normalizeOptions(opts, field_opt_defaults);

        if (grid.ni * grid.nj != data.length) {
            throw `Data size (${data.length}) doesn't match the grid dimensions (${grid.ni} x ${grid.nj}; expected ${grid.ni * grid.nj} points)`;
        }

        this.contour_cache = new Cache(async (opts: FieldContourOpts) => {
            if (getArrayDType(this.data) != 'float16' && getArrayDType(this.data) != 'float32') 
                throw `Grid is of type ${getArrayDType(this.data)}, which is not contourable (should be either float16 or float32)`;

            const tex_data = this.getTextureData();
            if (!isContourable(tex_data)) throw `Type check for contourable array failed`;

            const pool = getContourWorkerPool(undefined, 1); // 1 worker is the default; if the user requests more, the pool will be pre-created with the correct number of workers
            const contour_data = await pool.contourCreator(tex_data, grid.getGridCoords(), {...opts, missing_value: this.opts.missing_value});

            for (const v in contour_data) {
                for (let ic = 0; ic < contour_data[v].length; ic++) {
                    for (let ip = 0; ip < contour_data[v][ic].length; ip++) {
                        const [x, y] = contour_data[v][ic][ip];
                        contour_data[v][ic][ip] = grid.transform(x, y, {inverse: true});
                    }
                }
            }

            return contour_data;
        });
    }

    /** @internal */
    get aryConstructor() {
        return getArrayConstructor(this.data);
    }

    /** @internal */
    get dtypes() {
        return [getArrayDType(this.data)];
    }

    get missing_value() {
        return this.opts.missing_value;
    }

    /** @internal */
    private getTextureData() : TextureDataType<ArrayType> {
        // Need to give float16 data as uint16s to make WebGL happy: https://github.com/petamoriken/float16/issues/105
        const raw_data = this.data;
        const raw_data_type = getArrayDType(raw_data);
        const data: any = ['float32', 'uint8', 'uint32', 'uint16', 'int32', 'int16'].includes(raw_data_type) ? raw_data : new Uint16Array(raw_data.buffer);
        return data as TextureDataType<ArrayType>;
    }

    private getWGLTextureSpec(gl: WebGLAnyRenderingContext, image_mag_filter: number) : Map<string, WGLTextureSpec> {
        const tex_data = this.getTextureData();
        const {format, type, row_alignment} = getGLFormatTypeAlignment(gl, getArrayDType(this.data));
    
        return new Map([['_0', {'format': format, 'type': type,
            'width': this.grid.ni, 'height': this.grid.nj, 'image': tex_data,
            'mag_filter': image_mag_filter, 'min_filter': image_mag_filter, 'row_alignment': row_alignment,
        }]]);
    }

    public updateTexImageData(gl: WebGLAnyRenderingContext, image_mag_filter: number, fill_textures: Map<string, WGLTexture> | null) {
        const fill_texture_specs = this.getWGLTextureSpec(gl, image_mag_filter);

        if (fill_textures === null) {
            fill_textures = new Map(this.getSamplerIds().map(key => {
                const key_fill_image = fill_texture_specs.get(key);

                if (key_fill_image === undefined)
                    throw `Missing key '${key}' in fill_texture_specs`;

                return [key, new WGLTexture(gl, key_fill_image)];
            }));
        }
        else {
            this.getSamplerIds().forEach(key => {
                const key_fill_image = fill_texture_specs.get(key);
                if (key_fill_image === undefined)
                    throw `Missing key '${key}' in fill_texture_specs`;

                const tex = fill_textures?.get(key);
                if (tex === undefined)
                    throw `Missing key '${key}' in fill_textures`; 

                tex.setImageData(key_fill_image);
            });
        }

        return fill_textures;
    }

    /** @internal */
    public getSamplerIds() : string[] {
        return ['_0'];
    }

    /** @internal */
    public getExpression() : string {
        return '_0';
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
     * Create a new field by aggregating a number of fields using a specific function. This computation occurs on the CPU.
     * @param func - A function that will be applied each element of the field. It should take the same number of arguments as fields you have and return a single number.
     * @param args - The RawScalarFields to aggregate
     * @returns a new gridded field
     * @example
     * // Compute wind speed from u and v
     * wind_speed_field = RawScalarField.aggreateFields(Math.hypot, u_field, v_field);
     */
    public static aggregateFields<ArrayType extends TypedArray, GridType extends Grid>(func: (...args: number[]) => number, ...args: RawScalarField<ArrayType, GridType>[]) {
        return (new ComputedScalarField(args, '', func)).renderCPU();
    }

    /**
     * Run computations on a scalar field on the CPU (for a `RawScalarField`, this is a no-op). The function blocks the main thread, so avoid calling it if possible.
     * @returns The computed grid in a `RawScalarField`
     */
    public renderCPU(): RawScalarField<ArrayType, GridType> {
        return this;
    }

    /** @internal */
    public *iterateCPU() {
        for (let i = 0; i < this.data.length; i++) {
            yield this.data[i];
        }
    }

    /** @internal */
    public getThinnedField(thin_fac: number, map_max_zoom: number) {
        const new_grid = this.grid.getThinnedGrid(thin_fac, map_max_zoom)
        const thin_data = new_grid.thinDataArray(this.grid, this.data);

        return new RawScalarField(new_grid, thin_data, this.opts) as this;
    }

    /**
     * Sample this field at a given latitude and longitude.
     * @param lon - Longitude of the sample in degrees east
     * @param lat - Latitude of the sample in degrees north
     * @returns The value of the nearest grid point along with the grid point latitude and longitude, or NaNs if the point is outside the grid.
     */
    public sampleFieldWithCoord(lon: number, lat: number) {
        return this.grid.sampleNearestGridPoint(lon, lat, this.data);
    }

    /**
     * Sample this field at a given latitude and longitude.
     * @param lon - Longitude of the sample in degrees east
     * @param lat - Latitude of the sample in degrees north
     * @returns The value of the nearest grid point, or NaN if the point is outside the grid.
     */
    public sampleField(lon: number, lat: number) {
        return this.sampleFieldWithCoord(lon, lat).sample;
    }
}

const chars = 'abcdefghijklmnopqrstuvwxyz';

class ComputedScalarField<ArrayType extends TypedArray, GridType extends Grid> extends ExpressionScalarField<ArrayType, GridType> {
    private readonly raw_fields: ExpressionScalarField<ArrayType, GridType>[];
    private readonly expression: string;
    private readonly cpu_func: (...arg: number[]) => number;

    constructor(raw_fields: ExpressionScalarField<ArrayType, GridType>[], expression: string, cpu_func: (...arg: number[]) => number) {
        super();

        this.raw_fields = raw_fields;
        this.expression = expression;
        this.cpu_func = cpu_func;
    }

    /** @internal */
    get grid(): GridType {
        return this.raw_fields[0].grid;
    }

    /** @internal */
    get aryConstructor() {
        return this.raw_fields[0].aryConstructor;
    }

    /** @internal */
    get dtypes(): TypedArrayStr[] {
        return this.raw_fields.map(f => f.dtypes).flat();
    }

    get missing_value() {
        return this.raw_fields[0].missing_value;
    }

    /** @internal */
    public updateTexImageData(gl: WebGLAnyRenderingContext, image_mag_filter: number, fill_textures: Map<string, WGLTexture> | null) {
        const fill_textures_ret: Map<string, WGLTexture> = new Map();

        this.raw_fields.forEach((field, idx) => {
            let fill_textures_pre_field: Map<string, WGLTexture> | null = null;
            if (fill_textures !== null) {
                fill_textures_pre_field = new Map();

                for (let [key, val] of fill_textures) {
                    if (key[key.length - 1] == chars[idx])
                        fill_textures_pre_field.set(key.slice(0, -1), val);
                }
            }

            const fill_textures_field = field.updateTexImageData(gl, image_mag_filter, fill_textures_pre_field);

            for (let [key, val] of fill_textures_field) {
                fill_textures_ret.set(`${key}${chars[idx]}`, val);
            }

        });

        return fill_textures_ret;
    }

    /** @internal */
    public getSamplerIds(): string[] {
        return this.raw_fields.map((f, i) => f.getSamplerIds().map(id => `${id}${chars[i]}`)).flat();
    }

    /** @internal */
    public getExpression(): string {
        let expression = this.expression;
        this.raw_fields.forEach((field, idx) => {
            let field_expr = field.getExpression();
            const matches = field_expr.match(/_0[a-z]*/g);
            if (matches === null)
                throw `Field expression not found`;

            matches.forEach(m => field_expr = field_expr.replace(m, `${m}${chars[idx]}`));
            expression = expression.replace(`{${idx}}`, field_expr);
        });

        return `(${expression})`;
    }

    /** @internal */
    public getThinnedField(thin_fac: number, map_max_zoom: number) {
        return new ComputedScalarField(this.raw_fields.map(f => f.getThinnedField(thin_fac, map_max_zoom)), this.expression, this.cpu_func) as this;
    }

    /**
     * Sample this field at a given latitude and longitude.
     * @param lon - Longitude of the sample in degrees east
     * @param lat - Latitude of the sample in degrees north
     * @returns The value of the nearest grid point along with the grid point latitude and longitude, or NaNs if the point is outside the grid.
     */
    public sampleFieldWithCoord(lon: number, lat: number) {
        const field_samples = this.raw_fields.map(f => f.sampleFieldWithCoord(lon, lat));
        const any_missing = field_samples.map(s => isNaN(s.sample) && isNaN(this.missing_value) || s.sample == this.missing_value).reduce((a, b) => a || b, false);

        if (any_missing) 
            return {sample: this.missing_value, sample_lon: field_samples[0].sample_lon, sample_lat: field_samples[0].sample_lat};

        return {sample: this.cpu_func(...field_samples.map(s => s.sample)), sample_lon: field_samples[0].sample_lon, sample_lat: field_samples[0].sample_lat};
    }

    /**
     * Sample this field at a given latitude and longitude.
     * @param lon - Longitude of the sample in degrees east
     * @param lat - Latitude of the sample in degrees north
     * @returns The value of the nearest grid point, or NaN if the point is outside the grid.
     */
    public sampleField(lon: number, lat: number) {
        return this.sampleFieldWithCoord(lon, lat).sample;
    }

    /**
     * Run computations on a scalar field on the CPU. The function blocks the main thread, so avoid calling it if possible.
     * @returns The computed grid in a `RawScalarField`
     */
    public renderCPU(): RawScalarField<ArrayType, GridType> {
        const ary = new this.aryConstructor([...this.iterateCPU()]);
        return new RawScalarField<ArrayType, GridType>(this.grid, ary);
    }

    /** @internal */
    public *iterateCPU(): Generator<number, void, unknown> {
        function* mapGenerator<T extends any[], U>(gen: Generator<T>, func: (...arg: T) => U) {
            for (const elem of gen) {
                yield func(...elem);
            }
        }

        const zipped_args = zip(...this.raw_fields.map(a => a.iterateCPU()));

        for (const elem of mapGenerator(zipped_args, this.cpu_func)) {
            yield elem;
        }
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

    /**
     * Value to use as the "missing" value.
     * @default NaN
     */
    missing_value?: number;
}

function scalarIdToVectorComponentId(id: string, component: 'u' | 'v') {
    return `_${component}${id.slice(1)}`;
}

function vectorComponentIdToScalarId(id: string) {
    return `_${id.slice(2)}`;
}

abstract class ExpressionVectorField<ArrayType extends TypedArray, GridType extends AutoZoomGrid> {
    protected readonly u: ExpressionScalarField<ArrayType, GridType>;
    protected readonly v: ExpressionScalarField<ArrayType, GridType>;
    public readonly relative_to: VectorRelativeTo;
    public readonly missing_value: number;

    constructor(u: ExpressionScalarField<ArrayType, GridType>, v: ExpressionScalarField<ArrayType, GridType>, opts?: RawVectorFieldOptions) {
        this.u = u;
        this.v = v;

        opts = opts === undefined ? {}: opts;
        this.relative_to = opts.relative_to === undefined ? 'grid' : opts.relative_to;
        this.missing_value = opts.missing_value === undefined ? NaN : opts.missing_value;
    }

    private operandScalar(other: ExpressionScalarField<ArrayType, GridType> | number, operand: '*' | '/'): ComputedVectorField<ArrayType, GridType> {
        const FUNCS = {
            '*': (a: number, b: number) => a * b,
            '/': (a: number, b: number) => a / b,
        };

        if (typeof other === 'number') {
            const u = new ComputedScalarField([this.u], `{0} ${operand} ${other.toFixed(100)}`, v => FUNCS[operand](v, other));
            const v = new ComputedScalarField([this.v], `{0} ${operand} ${other.toFixed(100)}`, v => FUNCS[operand](v, other));
            return new ComputedVectorField(u, v, {relative_to: this.relative_to, missing_value: this.missing_value});
        }

        const u = new ComputedScalarField([this.u, other], `{0} ${operand} {1}`, FUNCS[operand]);
        const v = new ComputedScalarField([this.v, other], `{0} ${operand} {1}`, FUNCS[operand]);
        return new ComputedVectorField(u, v, {relative_to: this.relative_to, missing_value: this.missing_value});
    }

    private operandVector(other: ExpressionVectorField<ArrayType, GridType>, operand: '+' | '-'): ComputedVectorField<ArrayType, GridType> {
        const FUNCS = {
            '+': (a: number, b: number) => a + b,
            '-': (a: number, b: number) => a - b,
        };

        const u = new ComputedScalarField([this.u, other.u], `{0} ${operand} {1}`, FUNCS[operand]);
        const v = new ComputedScalarField([this.v, other.v], `{0} ${operand} {1}`, FUNCS[operand]);
        return new ComputedVectorField(u, v, {relative_to: this.relative_to, missing_value: this.missing_value});
    }

    /**
     * Multiply this vector field by a scalar. The multiplication occurs on the GPU if the resulting field is used in a plot component.
     * @param other - Scalar to multiply by. Can be either a number or a scalar field.
     * @returns A `ComputedVectorField` representing the multiplied vector field
     */
    public multiply(other: ExpressionScalarField<ArrayType, GridType> | number): ComputedVectorField<ArrayType, GridType> {
        return this.operandScalar(other, '*');
    }

    /**
     * Divide this vector field by a scalar. The division occurs on the GPU if the resulting field is used in a plot component.
     * @param other - Scalar to divide by. Can be either a number or a scalar field.
     * @returns A `ComputedVectorField` representing the divided vector field
     */
    public divide(other: ExpressionScalarField<ArrayType, GridType> | number): ComputedVectorField<ArrayType, GridType> {
        return this.operandScalar(other, '/');
    }

    /**
     * Add this vector field to another vector field. The addition occurs on the GPU if the resulting field is used in a plot component.
     * @param other Vector field to add.
     * @returns A `ComputedVectorField` representing the added vector field
     */
    public add(other: ExpressionVectorField<ArrayType, GridType>): ComputedVectorField<ArrayType, GridType> {
        return this.operandVector(other, '+');
    }

    /**
     * Subtract another vector field from this vector field. The subtraction occurs on the GPU if the resulting field is used in a plot component.
     * @param other Vector field to subtract.
     * @returns A `ComputedVectorField` representing the subtracted vector field
     */
    public subtract(other: ExpressionVectorField<ArrayType, GridType>): ComputedVectorField<ArrayType, GridType> {
        return this.operandVector(other, '-');
    }

    /** @internal */
    public updateTexImageData(gl: WebGLAnyRenderingContext, image_mag_filter: number, fill_textures: {u: Map<string, WGLTexture>, v: Map<string, WGLTexture>} | null) {
        const translateKeys = <V>(map: Map<string, V>, component: 'u' | 'v', reverse: boolean) => {
            const map_trans = new Map<string, V>();

            const translator = reverse ? vectorComponentIdToScalarId : scalarIdToVectorComponentId;

            map.forEach((value, key) => {
                map_trans.set(translator(key, component), value);
            })

            return map_trans;
        }

        const tex_u = this.u.updateTexImageData(gl, image_mag_filter, fill_textures === null ? null : translateKeys(fill_textures.u, 'u', true));
        const tex_v = this.v.updateTexImageData(gl, image_mag_filter, fill_textures === null ? null : translateKeys(fill_textures.v, 'v', true));

        return {u: translateKeys(tex_u, 'u', false), v: translateKeys(tex_v, 'v', false)};
    }

    /**
     * Get the magnitude of the vector field as a scalar field. The magnitude calculation occurs on the GPU if this field is used in a plot component.
     * @returns A `ComputedScalarField` representing the subtracted vector field
     */
    public magnitude() {
        return new ComputedScalarField([this.u, this.v], 'length(vec2({0}, {1}))', Math.hypot);
    }

    /** @internal */
    public getThinnedField(thin_fac: number, map_max_zoom: number) {
        const thin_u = this.u.getThinnedField(thin_fac, map_max_zoom);
        const thin_v = this.v.getThinnedField(thin_fac, map_max_zoom);

        return new ComputedVectorField(thin_u, thin_v, {relative_to: this.relative_to});
    }

    /** @internal */
    public get grid() {
        return this.u.grid
    }

    /**
     * Sample this field at a given latitude and longitude.
     * @param lon - Longitude of the sample in degrees east
     * @param lat - Latitude of the sample in degrees north
     * @returns A tuple containing the [`bearing`, `magnitude`] of the vector field at the nearest grid point. The bearing is given as degrees from north, increasing clockwise. 
     *  If the point is outside the grid, it returns [NaN, NaN] instead.
     */
    public sampleField(lon: number, lat: number) : [number, number] {
        const u_sample = this.u.sampleFieldWithCoord(lon, lat);
        const v_sample = this.v.sampleFieldWithCoord(lon, lat);

        if (isNaN(u_sample.sample) && isNaN(this.missing_value) || u_sample.sample == this.missing_value ||
            isNaN(v_sample.sample) && isNaN(this.missing_value) || v_sample.sample == this.missing_value) {
            return [this.missing_value, this.missing_value];
        }

        const rot = this.relative_to == 'earth' ? 0 : this.grid.getVectorRotationAtPoint(u_sample.sample_lon, u_sample.sample_lat);
        const mag = Math.hypot(u_sample.sample, v_sample.sample);
        let brg = (Math.PI / 2 - Math.atan2(-v_sample.sample, -u_sample.sample) + rot) * 180 / Math.PI;

        if (brg > 360) brg -= 360;
        if (brg < 0) brg += 360;

        return [brg, mag];
    }

    /** @internal */
    public getSamplerIds() : {u: string[], v: string[]} {
        return {
            u: this.u.getSamplerIds().map(id => scalarIdToVectorComponentId(id, 'u')), 
            v: this.v.getSamplerIds().map(id => scalarIdToVectorComponentId(id, 'v')),
        };
    }

    /** @internal */
    public getExpressions() : {u: string, v: string} {
        const translateVariables = (expr: string, component: 'u' | 'v') => {
            const matches = expr.match(/_0[a-z]*/g);
            if (matches === null)
                throw `Field expression not found`;

            matches.forEach(m => expr = expr.replace(m, scalarIdToVectorComponentId(m, component)));
            return expr;
        }

        return {
            u: translateVariables(this.u.getExpression(), 'u'), 
            v: translateVariables(this.v.getExpression(), 'v'),
        };
    }
}

/** A class representing a 2D gridded field of vectors */
class RawVectorField<ArrayType extends TypedArray, GridType extends AutoZoomGrid> extends ExpressionVectorField<ArrayType, GridType> {
    private readonly u_ary: ArrayType;
    private readonly v_ary: ArrayType;

    /**
     * Create a vector field.
     * @param grid - The grid on which the vector components are defined
     * @param u_ary - The u (east/west) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid
     * @param v_ary - The v (north/south) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid
     * @param opts - Options for creating the vector field.
     */
    constructor(grid: GridType, u_ary: ArrayType, v_ary: ArrayType, opts?: RawVectorFieldOptions) {
        opts = opts === undefined ? {} : opts;
        const missing_value = opts.missing_value === undefined ? NaN : opts.missing_value;

        const u = new RawScalarField(grid, u_ary, {missing_value: missing_value});
        const v = new RawScalarField(grid, v_ary, {missing_value: missing_value});
        super(u, v, opts);

        this.u_ary = u_ary;
        this.v_ary = v_ary;
    }

    /** @internal */
    public getSamplerIds() : {u: string[], v: string[]} {
        return {u: ['_u0'], v: ['_v0']};
    }

    /** @internal */
    public getExpressions() : {u: string, v: string} {
        return {u: '_u0', v: '_v0'};
    }
}

class ComputedVectorField<ArrayType extends TypedArray, GridType extends AutoZoomGrid> extends ExpressionVectorField<ArrayType, GridType> {}

/** A class grid of wind profiles */
class RawProfileField<GridType extends AutoZoomGrid> {
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
class RawObsField<GridType extends AutoZoomGrid, ObsFieldName extends string> {
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

export {RawScalarField, ComputedScalarField, RawVectorField, ComputedVectorField, RawProfileField, RawObsField};
export type {ExpressionScalarField, RawVectorFieldOptions, ExpressionVectorField, VectorRelativeTo, TextureDataType, ObsRawData};