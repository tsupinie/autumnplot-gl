
import { PlotComponent } from './PlotComponent';
import { ColorMap, ColorMapGPUInterface} from './Colormap';
import { WGLBuffer, WGLTexture } from 'autumn-wgl';
import { RawScalarField } from './RawField';
import { MapLikeType } from './Map';
import { RenderMethodArg, TypedArray, WebGLAnyRenderingContext, getRendererData } from './AutumnTypes';
import { normalizeOptions } from './utils';
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

const default_cmap = new ColorMap([0, 1], ['#000000'], {overflow_color: '#000000', underflow_color: '#000000'})

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
     * A 1 in the mask means to use the first colormap, a 2 means to use the second colormap, etc.
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

class PlotComponentFill<ArrayType extends TypedArray, GridType extends DomainBufferGrid, MapType extends MapLikeType> extends PlotComponent<MapType> {
    private field: RawScalarField<ArrayType, GridType>;
    public readonly opts: Required<ContourFillOptions>;

    private readonly cmap_gpu: ColorMapGPUInterface[];

    private gl_elems: PlotComponentFillGLElems<MapType> | null;
    private fill_texture: WGLTexture | null;
    private mask_texture: WGLTexture | null;
    protected image_mag_filter: number | null;
    protected cmap_mag_filter: number | null;

    constructor(field: RawScalarField<ArrayType, GridType>, opts: ContourFillOptions) {
        super();

        this.field = field;
        this.opts = normalizeOptions(opts, contour_fill_opt_defaults);
        this.opts.cmap = Array.isArray(this.opts.cmap) ? this.opts.cmap : [this.opts.cmap];

        this.cmap_gpu = this.opts.cmap.map(cm => new ColorMapGPUInterface(cm));

        this.gl_elems = null;
        this.fill_texture = null;
        this.mask_texture = null;
        this.image_mag_filter = null;
        this.cmap_mag_filter = null;
    }

    public async updateField(field: RawScalarField<ArrayType, GridType>, mask?: Uint8Array) {
        this.field = field;

        if (this.image_mag_filter === null || this.cmap_mag_filter === null) {
            throw `Implement magnification filters in a subclass`;
        }

        if (this.gl_elems === null) return;

        const gl = this.gl_elems.gl;
        const map = this.gl_elems.map;
    
        const fill_image = this.field.getWGLTextureSpec(gl, this.image_mag_filter);

        if (this.fill_texture === null) {
            this.fill_texture = new WGLTexture(gl, fill_image);
        }
        else {
            this.fill_texture.setImageData(fill_image);
        }

        if (mask !== undefined) {
            if (this.opts.cmap_mask === null) {
                console.warn("A mask was passed to updateField on a Fill component that didn't have a mask. The updated mask will be ignored.");
                return;
            }

            const mask_field = new RawScalarField(this.field.grid, mask);
            const mask_image = mask_field.getWGLTextureSpec(gl, gl.NEAREST);
            
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

        this.cmap_gpu.forEach(cmg => {
            if (this.image_mag_filter === null || this.cmap_mag_filter === null) {
                throw `Implement magnification filters in a subclass`;
            }

            cmg.setupShaderVariables(gl, this.cmap_mag_filter);
        });

        const shader_defines = [];

        if (this.opts.cmap_mask !== null) {
            shader_defines.push('MASK');
        }

        const shader_manger = new ShaderProgramManager(contourfill_vertex_shader_src, ColorMapGPUInterface.applyShader(contourfill_fragment_shader_src), shader_defines);

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

        program.use(
            {'a_pos': gl_elems.vertices, 'a_tex_coord': gl_elems.texcoords},
            {'u_opacity': this.opts.opacity, ...this.gl_elems.shader_manager.getShaderUniforms(render_data)},
            {'u_fill_sampler': this.fill_texture}
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
    constructor(field: RawScalarField<ArrayType, GridType>, opts: RasterOptions) {
        super(field, opts);
    }

    /**
     * Update the data displayed as a raster plot
     * @param field - The new field to display as a raster plot
     */
    public async updateField(field: RawScalarField<ArrayType, GridType>, mask?: Uint8Array) {
        await super.updateField(field, mask);
    }

    /**
     * @internal
     * Add the raster plot to a map
     */
    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        this.image_mag_filter = gl.NEAREST;
        this.cmap_mag_filter = gl.LINEAR;
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
    constructor(field: RawScalarField<ArrayType, GridType>, opts: ContourFillOptions) {
        super(field, opts);
    }

    /**
     * Update the data displayed as filled contours
     * @param field - The new field to display as filled contours
     */
    public async updateField(field: RawScalarField<ArrayType, GridType>, mask?: Uint8Array) {
        await super.updateField(field, mask);
    }

    /**
     * @internal
     * Add the filled contours to a map
     */
    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        this.image_mag_filter = gl.LINEAR;
        this.cmap_mag_filter = gl.NEAREST;
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