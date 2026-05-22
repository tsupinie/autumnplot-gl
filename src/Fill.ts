
import { PlotComponent, getGLFormatTypeAlignment } from './PlotComponent';
import { ColorMap, ColorMapDiscrete, ColorMapGPUInterface } from './Colormap';
import { WGLBuffer, WGLTexture } from 'autumn-wgl';
import { ExpressionScalarField } from './RawField';
import { MapLikeType } from './Map';
import { RenderMethodArg, TypedArray, WebGLAnyRenderingContext, getRendererData } from './AutumnTypes';
import { applySamplerCodeScalar, normalizeOptions } from './utils';
import { ShaderProgramManager } from './ShaderManager';
import { DomainBufferGrid } from './grids/DomainBuffer';

const contourfill_vertex_shader_src = require('./glsl/contourfill_vertex.glsl');
const contourfill_fragment_shader_src = require('./glsl/contourfill_fragment.glsl');

/** Options for {@link ContourFill} components */
interface ContourFillOptions {
    /** The color maps to use when creating the fills */
    cmap: ColorMap | ColorMap[];

    /** 
     * A mask specifying where to use each color map. This should be on the same grid as the RawScalarField passed. 
     * A 1 in the mask means to use the first colormap, a 2 means to use the second colormap, etc.
     */
    cmap_mask?: Uint8Array | null;

    /** 
     * The opacity for the filled contours 
     * @default 1
     */
    opacity?: number;
}

const default_cmap = new ColorMapDiscrete([0, 1], ['#000000'], {overflow_color: '#000000', underflow_color: '#000000'})

const contour_fill_opt_defaults: Required<ContourFillOptions> = {
    cmap: [default_cmap],
    cmap_mask: null,
    opacity: 1,
}

/** Options for {@link Raster} components */
interface RasterOptions {
    /** The color map to use when creating the raster plot */
    cmap: ColorMap | ColorMap[];

    /** 
     * A mask specifying where to use each color map. This should be on the same grid as the RawScalarField passed. 
     * A 1 in the mask means to use the first ColorMapDiscrete, a 2 means to use the second ColorMapDiscrete, etc.
     */
    cmap_mask?: Uint8Array | null;

    /** 
     * The opacity for the raster plot
     * @default 1
     */
    opacity?: number;
}

const raster_opt_defaults: Required<RasterOptions> = {
    cmap: [default_cmap],
    cmap_mask: null,
    opacity: 1,
}

interface PlotComponentFillGLElems<MapType extends MapLikeType> {
    gl: WebGLAnyRenderingContext;
    map: MapType;
    shader_manager: ShaderProgramManager;
    vertices: WGLBuffer;

    texcoords: WGLBuffer;
}

abstract class PlotComponentFill<ArrayType extends TypedArray, GridType extends DomainBufferGrid, MapType extends MapLikeType> extends PlotComponent<MapType> {
    private field: ExpressionScalarField<ArrayType, GridType>;
    public readonly opts: Required<ContourFillOptions>;

    private readonly cmap_gpu: ColorMapGPUInterface[];
    private readonly cmaps: ColorMap[];

    private gl_elems: PlotComponentFillGLElems<MapType> | null;
    private fill_texture: Map<string, WGLTexture> | null;
    private mask_texture: WGLTexture | null;

    constructor(field: ExpressionScalarField<ArrayType, GridType>, opts: ContourFillOptions) {
        super();

        this.field = field;
        this.opts = normalizeOptions(opts, contour_fill_opt_defaults);

        this.cmaps = Array.isArray(this.opts.cmap) ? this.opts.cmap : [this.opts.cmap];
        this.cmap_gpu = this.cmaps.map(cm => new ColorMapGPUInterface(cm));

        this.gl_elems = null;
        this.fill_texture = null;
        this.mask_texture = null;
    }

    protected abstract getImageMagFilter(gl: WebGLAnyRenderingContext): number;

    public async updateField(field: ExpressionScalarField<ArrayType, GridType>, mask?: Uint8Array) {
        this.field = field;

        if (this.gl_elems === null) return;

        const gl = this.gl_elems.gl;
        const map = this.gl_elems.map;
    
        this.fill_texture = this.field.updateTexImageData(gl, this.getImageMagFilter(gl), this.fill_texture);

        if (mask !== undefined) {
            if (this.opts.cmap_mask === null) {
                console.warn("A mask was passed to updateField on a Fill component that didn't have a mask. The updated mask will be ignored.");
                return;
            }

            const {format, type, row_alignment} = getGLFormatTypeAlignment(gl, 'uint8');
            const mask_image = {'format': format, 'type': type,
                'width': this.field.grid.ni, 'height': this.field.grid.nj, 'image': mask,
                'mag_filter': gl.NEAREST, 'row_alignment': row_alignment,
            };
            
            if (this.mask_texture === null) {
                this.mask_texture = new WGLTexture(gl, mask_image);
            }
            else {
                this.mask_texture.setImageData(mask_image);
            }
        }

        map.triggerRepaint();
    }

    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        // Basic procedure for the filled contours inspired by https://blog.mbq.me/webgl-weather-globe/

        const {vertices: vertices, texcoords: texcoords} = await this.field.grid.getDomainBuffers(gl);

        this.cmap_gpu.forEach((cmg, icmg) => {
            cmg.setupShaderVariables(gl, this.cmaps[icmg].getMagFilter(gl));
        });

        const shader_defines = [];

        if (this.opts.cmap_mask !== null) {
            shader_defines.push('MASK');
        }

        const sampler_keys = this.field.getSamplerIds();
        const sampler_expression = this.field.getExpression();
        const data_types = this.field.dtypes;

        const frag_shader_src = applySamplerCodeScalar(ColorMapGPUInterface.applyShader(contourfill_fragment_shader_src), sampler_keys, sampler_expression, data_types);

        const shader_manger = new ShaderProgramManager(contourfill_vertex_shader_src, frag_shader_src, shader_defines);

        this.gl_elems = {
            gl: gl, shader_manager: shader_manger, map: map, vertices: vertices, texcoords: texcoords,
        };

        this.updateField(this.field, this.opts.cmap_mask === null ? undefined : this.opts.cmap_mask);
    }

    public render(gl: WebGLAnyRenderingContext, arg: RenderMethodArg) {
        if (this.gl_elems === null || this.fill_texture === null) return;
        const gl_elems = this.gl_elems;

        const render_data = getRendererData(arg);
        const program = this.gl_elems.shader_manager.getShaderProgram(gl, render_data.shaderData);

        const samplers = Object.fromEntries([...this.fill_texture.entries()])

        program.use(
            {'a_pos': gl_elems.vertices, 'a_tex_coord': gl_elems.texcoords},
            {'u_opacity': this.opts.opacity, 'u_missing': this.field.missing_value, 'u_pixel_size': [1 / this.field.grid.ni, 1 / this.field.grid.nj],
             ...this.gl_elems.shader_manager.getShaderUniforms(render_data)},
            samplers
        );

        this.cmap_gpu.forEach((cmg, icmg) => {
            program.setUniforms({'u_offset': 0});

            if (this.opts.cmap_mask !== null && this.mask_texture !== null) {
                program.setUniforms({'u_mask_val': icmg + 1});
                program.bindTextures({'u_mask_sampler': this.mask_texture});
            }

            cmg.bindShaderVariables(program);

            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    
            program.draw();
    
            if (render_data.type != 'maplibre' || !render_data.shaderData.define.includes('GLOBE')) {
                program.setUniforms({'u_offset': -2});
                program.draw();
    
                program.setUniforms({'u_offset': -1});
                program.draw();
    
                program.setUniforms({'u_offset': 1});
                program.draw();
            }
        });
    }
}

/** 
 * A raster (i.e. pixel) plot 
 * 
 * ## Grid Compatibility
 * - :white_check_mark: `PlateCarreeGrid`
 * - :white_check_mark: `PlateCarreeRotatedGrid`
 * - :white_check_mark: `LambertGrid`
 * - :x:                `UnstructuredGrid`
 * - :white_check_mark: `RadarSweepGrid`
 * - :white_check_mark: `Geostationary`
 * 
 * @example
 * // Create a raster plot with the provided color map
 * const raster = new Raster(wind_speed_field, {cmap: color_map});
 */
class Raster<ArrayType extends TypedArray, GridType extends DomainBufferGrid, MapType extends MapLikeType> extends PlotComponentFill<ArrayType, GridType, MapType> {

    /**
     * Create a raster plot
     * @param field - The field to create the raster plot from
     * @param opts  - Options for creating the raster plot
     */
    constructor(field: ExpressionScalarField<ArrayType, GridType>, opts: RasterOptions) {
        super(field, opts);
    }

    protected getImageMagFilter(gl: WebGLAnyRenderingContext): number {
        return gl.NEAREST;
    }

    /**
     * Update the data displayed as a raster plot
     * @param field - The new field to display as a raster plot
     */
    public async updateField(field: ExpressionScalarField<ArrayType, GridType>, mask?: Uint8Array) {
        await super.updateField(field, mask);
    }

    /**
     * @internal
     * Add the raster plot to a map
     */
    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        await super.onAdd(map, gl);
    }

    /**
     * @internal
     * Render the raster plot
     */
    public render(gl: WebGLAnyRenderingContext, matrix: number[] | Float32Array) {
        super.render(gl, matrix);
    }
}

/** 
 * A filled contoured field 
 * 
 * ## Grid Compatibility
 * - :white_check_mark: `PlateCarreeGrid`
 * - :white_check_mark: `PlateCarreeRotatedGrid`
 * - :white_check_mark: `LambertGrid`
 * - :x:                `UnstructuredGrid`
 * - :white_check_mark: `RadarSweepGrid`
 * - :white_check_mark: `Geostationary`
 * 
 * @example
 * // Create a field of filled contours with the provided color map
 * const fill = new ContourFill(wind_speed_field, {cmap: color_map});
 */
class ContourFill<ArrayType extends TypedArray, GridType extends DomainBufferGrid, MapType extends MapLikeType> extends PlotComponentFill<ArrayType, GridType, MapType> {

    /**
     * Create a filled contoured field
     * @param field - The field to create filled contours from
     * @param opts  - Options for creating the filled contours
     */
    constructor(field: ExpressionScalarField<ArrayType, GridType>, opts: ContourFillOptions) {
        super(field, opts);
    }

    protected getImageMagFilter(gl: WebGLAnyRenderingContext): number {
        return gl.LINEAR;
    }

    /**
     * Update the data displayed as filled contours
     * @param field - The new field to display as filled contours
     */
    public async updateField(field: ExpressionScalarField<ArrayType, GridType>, mask?: Uint8Array) {
        await super.updateField(field, mask);
    }

    /**
     * @internal
     * Add the filled contours to a map
     */
    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        await super.onAdd(map, gl);
    }

    /**
     * @internal
     * Render the filled contours
     */
    public render(gl: WebGLAnyRenderingContext, matrix: number[] | Float32Array) {
        super.render(gl, matrix);
    }
}

export {ContourFill, Raster};
export type {ContourFillOptions, RasterOptions};