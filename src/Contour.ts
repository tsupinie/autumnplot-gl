
import { MapType } from './Map';
import { PlotComponent, layer_worker } from './PlotComponent';
import { RawScalarField } from './RawField';
import { hex2rgba } from './utils';
import { WGLBuffer, WGLProgram, WGLTexture } from './wgl';

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

        const vertexSource = `
        uniform mat4 u_matrix;

        attribute vec2 a_pos;
        attribute vec2 a_tex_coord;
        attribute float a_latitude;

        varying highp vec2 v_tex_coord;
        varying highp float v_map_scale_fac;

        void main() {
            gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);
            v_tex_coord = a_tex_coord;
            v_map_scale_fac = cos(a_latitude * 3.141592654 / 180.);
        }`;
        
        // create GLSL source for fragment shader
        const fragmentSource = `
        #extension GL_OES_standard_derivatives : enable
        varying highp vec2 v_tex_coord;
        varying highp float v_map_scale_fac;

        uniform sampler2D u_fill_sampler;
        uniform highp float u_contour_interval;
        uniform lowp float u_line_cutoff;
        uniform lowp vec3 u_color;
        uniform lowp vec2 u_step_size;
        uniform lowp float u_zoom_fac;
        uniform highp float u_grid_spacing;

        void main() {
            highp float field_val = texture2D(u_fill_sampler, v_tex_coord).r;

            // Find the gradient magnitude of the grid (the y component divides by 2 to cheat for high latitudes)
            lowp vec2 ihat = vec2(u_step_size.x, 0.0);
            lowp vec2 jhat = vec2(0.0, u_step_size.y);
            highp float fv_xp1 = texture2D(u_fill_sampler, v_tex_coord + ihat).r;
            highp float fv_xm1 = texture2D(u_fill_sampler, v_tex_coord - ihat).r;
            highp float fv_yp1 = texture2D(u_fill_sampler, v_tex_coord + jhat).r;
            highp float fv_ym1 = texture2D(u_fill_sampler, v_tex_coord - jhat).r;
            highp float fwidth_field = sqrt((fv_xp1 - fv_xm1) * (fv_xp1 - fv_xm1) + (fv_yp1 - fv_ym1) * (fv_yp1 - fv_ym1) * v_map_scale_fac * v_map_scale_fac) 
                                        / (2. * u_grid_spacing);

            //gl_FragColor = vec4(fwidth_field, fwidth_field, fwidth_field, 1.0);

            lowp float plot_val = fract(field_val / u_contour_interval);
            if (plot_val > 0.5) plot_val = 1.0 - plot_val;
            plot_val = plot_val / (max(0.001, fwidth_field / (u_zoom_fac * 0.125)));

            if (plot_val > u_line_cutoff) discard;

            gl_FragColor = vec4(u_color, 1. - (plot_val * plot_val / (u_line_cutoff * u_line_cutoff)));
        }`;
        
        this.program = new WGLProgram(gl, vertexSource, fragmentSource);

        const {lats: field_lats, lons: field_lons} = this.field.grid.getCoords();
        const {width: tex_width, height: tex_height, data: tex_data} = this.field.getPaddedData();

        const verts_tex_coords = await layer_worker.makeDomainVerticesAndTexCoords(field_lats, field_lons, tex_width, tex_height);
        const latitudes = new Float32Array([...field_lats].map(lat => [lat, lat]).flat());
        this.grid_spacing = Math.abs(latitudes[2] - latitudes[0]);

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