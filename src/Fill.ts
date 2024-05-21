
import { PlotComponent, getGLFormatTypeAlignment } from './PlotComponent';
import { ColorMap, makeIndexMap, makeTextureImage } from './Colormap';
import { WGLBuffer, WGLProgram, WGLTexture } from 'autumn-wgl';
import { RawScalarField } from './RawField';
import { MapLikeType } from './Map';
import { TypedArray, WebGLAnyRenderingContext } from './AutumnTypes';
import { Float16Array } from '@petamoriken/float16';
import { hex2rgb, normalizeOptions } from './utils';

const contourfill_vertex_shader_src = require('./glsl/contourfill_vertex.glsl');
const contourfill_fragment_shader_src = require('./glsl/contourfill_fragment.glsl');

interface ContourFillOptions {
    /** The color map to use when creating the fills */
    cmap: ColorMap;

    /** 
     * The opacity for the filled contours 
     * @default 1
     */
    opacity?: number;
}

const default_cmap = new ColorMap([0, 1], ['#000000'], {overflow_color: '#000000', underflow_color: '#000000'})

const contour_fill_opt_defaults: Required<ContourFillOptions> = {
    cmap: default_cmap,
    opacity: 1,
}

interface RasterOptions {
    /** The color map to use when creating the raster plot */
    cmap: ColorMap;

    /** 
     * The opacity for the raster plot
     * @default 1
     */
    opacity?: number;
}

const raster_opt_defaults: Required<RasterOptions> = {
    cmap: default_cmap,
    opacity: 1,
}

interface PlotComponentFillGLElems<MapType extends MapLikeType> {
    gl: WebGLAnyRenderingContext;
    map: MapType;
    program: WGLProgram;
    vertices: WGLBuffer;

    texcoords: WGLBuffer;
    cmap_texture: WGLTexture;
    cmap_nonlin_texture: WGLTexture;
}

class PlotComponentFill<ArrayType extends TypedArray, MapType extends MapLikeType> extends PlotComponent<MapType> {
    private field: RawScalarField<ArrayType>;
    public readonly opts: Required<ContourFillOptions>;

    private readonly cmap_image: HTMLCanvasElement;
    private readonly index_map: Float16Array;

    private gl_elems: PlotComponentFillGLElems<MapType> | null;
    private fill_texture: WGLTexture | null;
    protected image_mag_filter: number | null;
    protected cmap_mag_filter: number | null;

    constructor(field: RawScalarField<ArrayType>, opts: ContourFillOptions) {
        super();

        this.field = field;
        this.opts = normalizeOptions(opts, contour_fill_opt_defaults);

        this.cmap_image = makeTextureImage(this.opts.cmap);
        this.index_map = makeIndexMap(this.opts.cmap);

        this.gl_elems = null;
        this.fill_texture = null;
        this.image_mag_filter = null;
        this.cmap_mag_filter = null;
    }

    public async updateField(field: RawScalarField<ArrayType>) {
        this.field = field;

        if (this.gl_elems === null) return;

        const gl = this.gl_elems.gl;
        const map = this.gl_elems.map;
        
        const tex_data = this.field.getTextureData();
        const {format, type, row_alignment} = getGLFormatTypeAlignment(gl, !(tex_data instanceof Float32Array));
    
        const fill_image = {'format': format, 'type': type,
            'width': this.field.grid.ni, 'height': this.field.grid.nj, 'image': tex_data,
            'mag_filter': this.image_mag_filter, 'row_alignment': row_alignment,
        };

        if (this.fill_texture === null) {
            this.fill_texture = new WGLTexture(gl, fill_image);
        }
        else {
            this.fill_texture.setImageData(fill_image);
        }

        map.triggerRepaint();
    }

    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        // Basic procedure for the filled contours inspired by https://blog.mbq.me/webgl-weather-globe/
        
        if (this.image_mag_filter === null || this.cmap_mag_filter === null) {
            throw `Implement magnification filtes in a subclass`;
        }
        
        const program = new WGLProgram(gl, contourfill_vertex_shader_src, contourfill_fragment_shader_src);

        const {vertices: verts_buf, texcoords: tex_coords_buf} = await this.field.grid.getWGLBuffers(gl);
        const vertices = verts_buf;
        const texcoords = tex_coords_buf;

        const cmap_image = {'format': gl.RGBA, 'type': gl.UNSIGNED_BYTE, 'image': this.cmap_image, 'mag_filter': this.cmap_mag_filter};
        const cmap_texture = new WGLTexture(gl, cmap_image);

        const {format: format_nonlin , type: type_nonlin, row_alignment: row_alignment_nonlin} = getGLFormatTypeAlignment(gl, true);

        const cmap_nonlin_image = {'format': format_nonlin, 'type': type_nonlin, 
            'width': this.index_map.length, 'height': 1,
            'image': new Uint16Array(this.index_map.buffer), 
            'mag_filter': gl.LINEAR, 'row_alignment': row_alignment_nonlin,
        };

        const cmap_nonlin_texture = new WGLTexture(gl, cmap_nonlin_image);
        this.gl_elems = {
            gl: gl, map: map, program: program, vertices: vertices, texcoords: texcoords, 
            cmap_texture: cmap_texture, cmap_nonlin_texture: cmap_nonlin_texture,
        };

        this.updateField(this.field);
    }

    public render(gl: WebGLAnyRenderingContext, matrix: number[] | Float32Array) {
        if (this.gl_elems === null || this.fill_texture === null) return;
        const gl_elems = this.gl_elems;

        if (matrix instanceof Float32Array) 
            matrix = [...matrix];

        const cmap = this.opts.cmap;
        const underflow_color = cmap.underflow_color === null ? [0, 0, 0, 0] : hex2rgb(cmap.underflow_color.color).concat(cmap.underflow_color.opacity);
        const overflow_color = cmap.overflow_color === null ? [0, 0, 0, 0] : hex2rgb(cmap.overflow_color.color).concat(cmap.overflow_color.opacity);

        gl_elems.program.use(
            {'a_pos': gl_elems.vertices, 'a_tex_coord': gl_elems.texcoords},
            {'u_cmap_min': cmap.levels[0], 'u_cmap_max': cmap.levels[cmap.levels.length - 1], 'u_matrix': matrix, 'u_opacity': this.opts.opacity,
             'u_n_index': this.index_map.length, 'u_underflow_color': underflow_color, 'u_overflow_color': overflow_color, 'u_offset': 0},
            {'u_fill_sampler': this.fill_texture, 'u_cmap_sampler': gl_elems.cmap_texture, 'u_cmap_nonlin_sampler': gl_elems.cmap_nonlin_texture}
        );

        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        gl_elems.program.draw();

        gl_elems.program.setUniforms({'u_offset': -2});
        gl_elems.program.draw();

        gl_elems.program.setUniforms({'u_offset': -1});
        gl_elems.program.draw();

        gl_elems.program.setUniforms({'u_offset': 1});
        gl_elems.program.draw();
    }
}

/** 
 * A raster (i.e. pixel) plot 
 * @example
 * // Create a raster plot with the provided color map
 * const raster = new Raster(wind_speed_field, {cmap: color_map});
 */
class Raster<ArrayType extends TypedArray, MapType extends MapLikeType> extends PlotComponentFill<ArrayType, MapType> {

    /**
     * Create a raster plot
     * @param field - The field to create the raster plot from
     * @param opts  - Options for creating the raster plot
     */
    constructor(field: RawScalarField<ArrayType>, opts: RasterOptions) {
        super(field, opts);
    }

    /**
     * Update the data displayed as a raster plot
     * @param field - The new field to display as a raster plot
     */
    public async updateField(field: RawScalarField<ArrayType>) {
        await super.updateField(field);
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
class ContourFill<ArrayType extends TypedArray, MapType extends MapLikeType> extends PlotComponentFill<ArrayType, MapType> {

    /**
     * Create a filled contoured field
     * @param field - The field to create filled contours from
     * @param opts  - Options for creating the filled contours
     */
    constructor(field: RawScalarField<ArrayType>, opts: ContourFillOptions) {
        super(field, opts);
    }

    /**
     * Update the data displayed as filled contours
     * @param field - The new field to display as filled contours
     */
    public async updateField(field: RawScalarField<ArrayType>) {
        await super.updateField(field);
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