
import { MapType } from './Map';
import { PlotComponent, layer_worker } from './PlotComponent';
import { RawScalarField } from './RawField';
import { hex2rgba } from './utils';
import { WGLBuffer, WGLProgram, WGLTexture } from './wgl';

const contour_vertex_shader_src = require('./glsl/contour_vertex.glsl');
const contour_fragment_shader_src = require('./glsl/contour_fragment.glsl');

interface ContourOptions {
    /** 
     * The color of the contours as a hex color string 
     * @default '#000000'
     */
    color?: string;

    /** 
     * The contour interval 
     * @default 1
     */
    interval?: number;

    /** 
     * A function to thin the contours based on zoom level. The function should take a zoom level and return a number `n` that means to only show every 
     * `n`th contour.
     * @default Don't thin the contours on any zoom level
     */
    thinner?: (zoom: number) => number;
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
    readonly thinner: (zoom: number) => number;

    /** @private */
    map: MapType | null;
    /** @private */
    program: WGLProgram | null;
    /** @private */
    vertices: WGLBuffer | null;
    /** @private */
    grid_cell_size: WGLBuffer | null;
    /** @private */
    fill_texture: WGLTexture | null;
    /** @private */
    texcoords: WGLBuffer | null;
    /** @private */
    //grid_spacing: number | null;

    /** @private */
    tex_width: number | null;
    /** @private */
    tex_height: number | null;

    /**
     * Create a contoured field
     * @param field - The field to contour
     * @param opts  - Options for creating the contours
     */
    constructor(field: RawScalarField, opts: ContourOptions) {
        super();

        this.field = field;

        this.interval = opts.interval || 1;

        const color = hex2rgba(opts.color || '#000000');
        this.color = [color[0], color[1], color[2]];

        this.thinner = opts.thinner || (() => 1);

        this.map = null;
        this.program = null;
        this.vertices = null;
        this.grid_cell_size = null;
        this.fill_texture = null;
        this.texcoords = null;

        this.tex_width = null;
        this.tex_height = null;
    }

    /**
     * @internal
     * Add the contours to a map
     */
    async onAdd(map: MapType, gl: WebGLRenderingContext) {
        // Basic procedure for these contours from https://www.shadertoy.com/view/lltBWM
        this.map = map;

        gl.getExtension('OES_texture_float');
        gl.getExtension('OES_texture_float_linear');
        gl.getExtension('OES_standard_derivatives');
        
        this.program = new WGLProgram(gl, contour_vertex_shader_src, contour_fragment_shader_src);

        const {lats: field_lats, lons: field_lons} = this.field.grid.getCoords();
        const {width: tex_width, height: tex_height, data: tex_data} = this.field.getPaddedData();

        const verts_tex_coords = await layer_worker.makeDomainVerticesAndTexCoords(field_lats, field_lons, this.field.grid.ni, this.field.grid.nj, tex_width, tex_height);

        const grid_cell_size = new Float32Array(verts_tex_coords['vertices'].length / 2);
        let igcs = 0;

        for (let i = 0; i < this.field.grid.ni - 1; i++) {
            for (let j = 0; j < this.field.grid.nj - 1; j++) {
                const ivert = j == 0 ? 2 * (igcs + 1) : 2 * igcs;
                const x_ll = verts_tex_coords['vertices'][ivert],     y_ll = verts_tex_coords['vertices'][ivert + 1],
                      x_lr = verts_tex_coords['vertices'][ivert + 2], y_lr = verts_tex_coords['vertices'][ivert + 3],
                      x_ul = verts_tex_coords['vertices'][ivert + 4], y_ul = verts_tex_coords['vertices'][ivert + 5],
                      x_ur = verts_tex_coords['vertices'][ivert + 6], y_ur = verts_tex_coords['vertices'][ivert + 7];

                const area = 0.5 * Math.abs(x_ll * (y_lr - y_ul) + x_lr * (y_ul - y_ll) + x_ul * (y_ll - y_lr) + 
                                            x_ur * (y_ul - y_lr) + x_ul * (y_lr - y_ur) + x_lr * (y_ur - y_ul));

                if (j == 0) {
                    grid_cell_size[igcs] = area;
                    igcs += 1;
                }
    
                grid_cell_size[igcs] = area; grid_cell_size[igcs + 1] = area;
                igcs += 2;
    
                if (j == this.field.grid.nj - 2) {
                    grid_cell_size[igcs] = area; grid_cell_size[igcs + 1] = area; 
                    grid_cell_size[igcs + 2] = area;
                    igcs += 3;
                }
            }
        }

        this.vertices = new WGLBuffer(gl, verts_tex_coords['vertices'], 2, gl.TRIANGLE_STRIP);
        this.grid_cell_size = new WGLBuffer(gl, grid_cell_size, 1, gl.TRIANGLE_STRIP);

        this.tex_width = tex_width;
        this.tex_height = tex_height;

        const fill_image = {'format': gl.LUMINANCE, 'type': gl.FLOAT, 
            'width': tex_width, 'height': tex_height, 'image': tex_data,
            'mag_filter': gl.LINEAR,
        };

        this.fill_texture = new WGLTexture(gl, fill_image);
        this.texcoords = new WGLBuffer(gl, verts_tex_coords['tex_coords'], 2, gl.TRIANGLE_STRIP);
    }

    /**
     * @internal
     * Render the contours
     */
    render(gl: WebGLRenderingContext, matrix: number[]) {
        if (this.map === null || this.program === null || this.vertices === null || this.grid_cell_size === null || 
            this.fill_texture === null || this.texcoords === null || this.tex_width === null || this.tex_height === null) return;

        const zoom = this.map.getZoom();
        const intv = this.thinner(zoom) * this.interval;
        const cutoff = 0.5 / intv;
        const step_size = [0.25 / this.tex_width, 0.25 / this.tex_height];
        const zoom_fac = Math.pow(2, zoom);

        this.program.use(
            {'a_pos': this.vertices, 'a_grid_cell_size': this.grid_cell_size, 'a_tex_coord': this.texcoords},
            {'u_contour_interval': intv, 'u_line_cutoff': cutoff, 'u_color': this.color, 'u_step_size': step_size, 'u_zoom_fac': zoom_fac,
             'u_matrix': matrix},
            {'u_fill_sampler': this.fill_texture}
        );

        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        this.program.draw();
    }
}

export default Contour;
export type {ContourOptions};