
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
    latitudes: WGLBuffer | null;
    /** @private */
    fill_texture: WGLTexture | null;
    /** @private */
    texcoords: WGLBuffer | null;
    /** @private */
    grid_spacing: number | null;

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
        this.latitudes = null;
        this.fill_texture = null;
        this.texcoords = null;
        this.grid_spacing = null;

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
        this.grid_spacing = Math.abs(field_lons[1] - field_lons[0]);

        const latitudes = new Float32Array(verts_tex_coords['vertices'].length / 2);
        let ivert = 0;

        for (let i = 0; i < this.field.grid.ni; i++) {
            for (let j = 0; j < this.field.grid.nj; j++) {
                const idx = i + j * this.field.grid.ni;

                if (j == 0) {
                    latitudes[ivert] = field_lats[idx]; latitudes[ivert + 1] = field_lats[idx];
                    ivert += 2;
                }
    
                latitudes[ivert    ] = field_lats[idx]; latitudes[ivert + 1] = field_lats[idx];
                latitudes[ivert + 3] = field_lats[idx]; latitudes[ivert + 4] = field_lats[idx];
                ivert += 4;
    
                if (j == this.field.grid.nj - 1) {
                    latitudes[ivert] = field_lats[idx]; latitudes[ivert + 1] = field_lats[idx];
                    ivert += 2;
                }
            }
        }

        this.vertices = new WGLBuffer(gl, verts_tex_coords['vertices'], 2, gl.TRIANGLE_STRIP);
        this.latitudes = new WGLBuffer(gl, latitudes, 1, gl.TRIANGLE_STRIP);

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
        if (this.map === null || this.program === null || this.vertices === null || this.latitudes === null || 
            this.fill_texture === null || this.texcoords === null || this.grid_spacing === null || this.tex_width === null || this.tex_height === null) return;

        const zoom = this.map.getZoom();
        const intv = this.thinner(zoom) * this.interval;
        const cutoff = 0.5 / intv;
        const step_size = [0.25 / this.tex_width, 0.25 / this.tex_height];
        const zoom_fac = Math.pow(2, zoom);

        this.program.use(
            {'a_pos': this.vertices, 'a_latitude': this.latitudes, 'a_tex_coord': this.texcoords},
            {'u_contour_interval': intv, 'u_line_cutoff': cutoff, 'u_color': this.color, 'u_step_size': step_size, 'u_zoom_fac': zoom_fac,
             'u_grid_spacing': this.grid_spacing, 'u_matrix': matrix},
            {'u_fill_sampler': this.fill_texture}
        );

        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        this.program.draw();
    }
}

export default Contour;
export type {ContourOptions};