
import { PlotComponent, getGLFormatTypeAlignment } from './PlotComponent';
import { ColorMap, makeTextureImage } from './Colormap';
import { WGLBuffer, WGLProgram, WGLTexture } from 'autumn-wgl';
import { DelayedScalarField, RawScalarField } from './RawField';
import { MapType } from './Map';
import { TypedArray, WebGLAnyRenderingContext } from './AutumnTypes';
import { Float16Array } from '@petamoriken/float16';

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

interface RasterOptions {
    /** The color map to use when creating the raster plot */
    cmap: ColorMap;

    /** 
     * The opacity for the raster plot
     * @default 1
     */
    opacity?: number;
}

interface PlotComponentFillGLElems {
    gl: WebGLAnyRenderingContext;
    program: WGLProgram;
    vertices: WGLBuffer;

    texcoords: WGLBuffer;
    cmap_texture: WGLTexture;
    cmap_nonlin_texture: WGLTexture;
}

class PlotComponentFill<ArrayType extends TypedArray> extends PlotComponent {
    private readonly field: DelayedScalarField<ArrayType>;
    public readonly cmap: ColorMap;
    public readonly opacity: number;

    private readonly cmap_image: HTMLCanvasElement;
    private readonly index_map: Float16Array;
    private readonly is_delayed: boolean

    private gl_elems: PlotComponentFillGLElems | null;
    private fill_texture: WGLTexture | null;
    protected image_mag_filter: number | null;
    protected cmap_mag_filter: number | null;

    constructor(field: RawScalarField<ArrayType> | DelayedScalarField<ArrayType>, opts: ContourFillOptions) {
        super();

        this.is_delayed = !RawScalarField.isa(field)
        this.field = RawScalarField.isa(field) ? DelayedScalarField.fromRawScalarField(field) : field;
        this.cmap = opts.cmap;
        this.opacity = opts.opacity || 1.;

        this.cmap_image = makeTextureImage(this.cmap);

        const levels = this.cmap.levels;
        const n_lev = levels.length - 1;

        // Build a texture to account for nonlinear colormaps (basically inverts the relationship between
        //  the normalized index and the normalized level)
        const n_nonlin = 101;
        const map_norm = [];
        for (let i = 0; i < n_nonlin; i++) {
            map_norm.push(i / (n_nonlin - 1));
        }

        const input_norm = levels.map((lev, ilev) => ilev / n_lev);
        const cmap_norm = levels.map(lev => (lev - levels[0]) / (levels[n_lev] - levels[0]));
        const inv_cmap_norm = map_norm.map(lev => {
            let jlev;
            for (jlev = 0; !(cmap_norm[jlev] <= lev && lev <= cmap_norm[jlev + 1]); jlev++) {}

            const alpha = (lev - cmap_norm[jlev]) / (cmap_norm[jlev + 1] - cmap_norm[jlev]);
            return input_norm[jlev] * (1 - alpha) + input_norm[jlev + 1] * alpha;
        });

        this.index_map = new Float16Array(inv_cmap_norm);

        this.gl_elems = null;
        this.fill_texture = null;
        this.image_mag_filter = null;
        this.cmap_mag_filter = null;
    }

    public async updateData(key: string) {
        if (this.gl_elems !== null) {
            const gl = this.gl_elems.gl;
            const tex_data = await this.field.getTextureData(key);
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
        }
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
            gl: gl, program: program, vertices: vertices, texcoords: texcoords, 
            cmap_texture: cmap_texture, cmap_nonlin_texture: cmap_nonlin_texture,
        };

        if (!this.is_delayed) await this.updateData('');
    }

    public render(gl: WebGLAnyRenderingContext, matrix: number[] | Float32Array) {
        if (this.gl_elems === null || this.fill_texture === null) return;
        const gl_elems = this.gl_elems;

        if (matrix instanceof Float32Array) 
            matrix = [...matrix];

        gl_elems.program.use(
            {'a_pos': gl_elems.vertices, 'a_tex_coord': gl_elems.texcoords},
            {'u_cmap_min': this.cmap.levels[0], 'u_cmap_max': this.cmap.levels[this.cmap.levels.length - 1], 'u_matrix': matrix, 'u_opacity': this.opacity,
             'u_n_index': this.index_map.length, 'u_offset': 0},
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
class Raster<ArrayType extends TypedArray> extends PlotComponentFill<ArrayType> {

    /**
     * Create a raster plot
     * @param field - The field to create the raster plot from
     * @param opts  - Options for creating the raster plot
     */
    constructor(field: RawScalarField<ArrayType>, opts: RasterOptions) {
        super(field, opts);
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
class ContourFill<ArrayType extends TypedArray> extends PlotComponentFill<ArrayType> {

    /**
     * Create a filled contoured field
     * @param field - The field to create filled contours from
     * @param opts  - Options for creating the filled contours
     */
    constructor(field: RawScalarField<ArrayType>, opts: ContourFillOptions) {
        super(field, opts);
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