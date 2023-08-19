
import { MapType } from './Map';
import { PlotComponent, layer_worker } from './PlotComponent';
import { RawScalarField } from './RawField';
import { hex2rgba } from './utils';
import { WGLBuffer, WGLProgram, WGLTexture } from 'autumn-wgl';

const contour_vertex_shader_src = require('./glsl/contour_vertex.glsl');
const contour_fragment_shader_src = require('./glsl/contour_fragment.glsl');

interface ContourOptions {
    /** 
     * The color of the contours as a hex color string 
     * @default '#000000'
     */
    color?: string;

    /** 
     * The contour interval for drawing contours at regular intervals
     * @default 1
     */
    interval?: number;

    /**
     * A list of arbitrary levels (up to 40) to contour. This overrides the `interval` option.
     * @default Draw contours at regular intervals given by the `interval` option.
     */
    levels?: number[];

    /** 
     * A function to thin the contours based on zoom level. The function should take a zoom level and return a number `n` that means to only show every 
     * `n`th contour.
     * @default Don't thin the contours on any zoom level
     */
    thinner?: (zoom: number) => number;
}

interface ContourGLElems {
    map: MapType;
    program: WGLProgram;
    vertices: WGLBuffer;
    grid_cell_size: WGLBuffer;
    fill_texture: WGLTexture;
    texcoords: WGLBuffer;
}

/** 
 * A field of contoured data. The contours can optionally be thinned based on map zoom level.
 * @example
 * // Create a contoured height field, with black contours every 30 m (assuming the height field is in 
 * // meters) and only using every other contour when the map zoom level is less than 5.
 * const contours = new Contour(height_field, {color: '#000000', interval: 30, 
 *                                                  thinner: zoom => zoom < 5 ? 2 : 1});
 */
class Contour extends PlotComponent {
    readonly field: RawScalarField;
    readonly color: [number, number, number];
    readonly interval: number;
    readonly levels: number[];
    readonly thinner: (zoom: number) => number;

    /** @private */
    gl_elems: ContourGLElems | null;

    /**
     * Create a contoured field
     * @param field - The field to contour
     * @param opts  - Options for creating the contours
     */
    constructor(field: RawScalarField, opts: ContourOptions) {
        super();

        this.field = field;

        this.interval = opts.interval || 1;
        this.levels = opts.levels || [];

        const color = hex2rgba(opts.color || '#000000');
        this.color = [color[0], color[1], color[2]];

        this.thinner = opts.thinner || (() => 1);

        this.gl_elems = null;
    }

    /**
     * @internal
     * Add the contours to a map
     */
    async onAdd(map: MapType, gl: WebGLRenderingContext) {
        // Basic procedure for these contours from https://www.shadertoy.com/view/lltBWM
        gl.getExtension('OES_texture_float');
        gl.getExtension('OES_texture_float_linear');
        gl.getExtension('OES_standard_derivatives');
        
        const program = new WGLProgram(gl, contour_vertex_shader_src, contour_fragment_shader_src);

        const {vertices: verts_buf, texcoords: tex_coords_buf, cellsize: cellsize_buf} = await this.field.grid.getWGLBuffers(gl);
        const vertices = verts_buf;
        const texcoords = tex_coords_buf;
        const grid_cell_size = cellsize_buf;

        const fill_image = {'format': gl.LUMINANCE, 'type': gl.FLOAT, 
            'width': this.field.grid.ni, 'height': this.field.grid.nj, 'image': this.field.data,
            'mag_filter': gl.LINEAR,
        };

        const fill_texture = new WGLTexture(gl, fill_image);
        this.gl_elems = {
            map: map, program: program, vertices: vertices, texcoords: texcoords, grid_cell_size: grid_cell_size, fill_texture: fill_texture
        };
    }

    /**
     * @internal
     * Render the contours
     */
    render(gl: WebGLRenderingContext, matrix: number[]) {
        if (this.gl_elems === null) return;
        const gl_elems = this.gl_elems;

        const zoom = gl_elems.map.getZoom();
        const intv = this.thinner(zoom) * this.interval;
        const cutoff = 0.5 / intv;
        const step_size = [0.25 / this.field.grid.ni, 0.25 / this.field.grid.nj];
        const zoom_fac = Math.pow(2, zoom);

        let uniforms = {'u_contour_interval': intv, 'u_line_cutoff': cutoff, 'u_color': this.color, 'u_step_size': step_size, 'u_zoom_fac': zoom_fac,
                        'u_matrix': matrix, 'u_num_contours': 0, 'u_contour_levels': [0]};

        if (this.levels.length > 0) {
            uniforms = {...uniforms, 'u_num_contours': this.levels.length, 'u_contour_levels': this.levels}
        }

        gl_elems.program.use(
            {'a_pos': gl_elems.vertices, 'a_grid_cell_size': gl_elems.grid_cell_size, 'a_tex_coord': gl_elems.texcoords},
            uniforms,
            {'u_fill_sampler': gl_elems.fill_texture}
        );

        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        gl_elems.program.draw();
    }
}

export default Contour;
export type {ContourOptions};