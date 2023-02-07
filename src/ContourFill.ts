
import { PlotComponent, layer_worker } from './PlotComponent';
import { ColorMap, makeTextureImage } from './ColorMap';
import { WGLBuffer, WGLProgram, WGLTexture } from './wgl';
import { RawScalarField } from './RawField';
import { MapType } from './Map';

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

/** 
 * A filled contoured field 
 * @example
 * // Create a field of filled contours with the provided color map
 * const fill = new ContourFill(wind_speed_field, {cmap: color_map});
 */
class ContourFill extends PlotComponent {
    readonly field: RawScalarField;
    readonly cmap: ColorMap;
    readonly opacity: number;

    /** @private */
    readonly cmap_image: HTMLCanvasElement;
    /** @private */
    readonly index_map: Float32Array;

    /** @private */
    program: WGLProgram | null;
    /** @private */
    vertices: WGLBuffer | null;

    /** @private */
    fill_texture: WGLTexture | null;
    /** @private */
    texcoords: WGLBuffer | null;
    /** @private */
    cmap_texture: WGLTexture | null;
    /** @private */
    cmap_nonlin_texture: WGLTexture | null;

    /**
     * Create a filled contoured field
     * @param field - The field to create filled contours from
     * @param opts  - Options for creating the filled contours
     */
    constructor(field: RawScalarField, opts: ContourFillOptions) {
        super();

        this.field = field;
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

        this.index_map = new Float32Array(inv_cmap_norm);

        this.program = null;
        this.vertices = null;
        this.fill_texture = null;
        this.texcoords = null;
        this.cmap_texture = null;
        this.cmap_nonlin_texture = null;
    }

    /**
     * @internal
     * Add the filled contours to a map
     */
    async onAdd(map: MapType, gl: WebGLRenderingContext) {
        // Basic procedure for the filled contours inspired by https://blog.mbq.me/webgl-weather-globe/
        gl.getExtension('OES_texture_float');
        gl.getExtension('OES_texture_float_linear');
        
        this.program = new WGLProgram(gl, contourfill_vertex_shader_src, contourfill_fragment_shader_src);

        const {lats: field_lats, lons: field_lons} = this.field.grid.getCoords();
        const {width: tex_width, height: tex_height, data: tex_data} = this.field.getPaddedData();

        const verts_tex_coords = await layer_worker.makeDomainVerticesAndTexCoords(field_lats, field_lons, tex_width, tex_height);

        this.vertices = new WGLBuffer(gl, verts_tex_coords['vertices'], 2, gl.TRIANGLE_STRIP);

        const fill_image = {'format': gl.LUMINANCE, 'type': gl.FLOAT, 
            'width': tex_width, 'height': tex_height, 'image': tex_data,
            'mag_filter': gl.LINEAR,
        };

        this.fill_texture = new WGLTexture(gl, fill_image);
        this.texcoords = new WGLBuffer(gl, verts_tex_coords['tex_coords'], 2, gl.TRIANGLE_STRIP);

        const cmap_image = {'format': gl.RGBA, 'type': gl.UNSIGNED_BYTE, 'image': this.cmap_image, 'mag_filter': gl.NEAREST};
        this.cmap_texture = new WGLTexture(gl, cmap_image);

        const cmap_nonlin_image = {'format': gl.LUMINANCE, 'type': gl.FLOAT, 
            'width': this.index_map.length, 'height': 1,
            'image': this.index_map, 
            'mag_filter': gl.LINEAR
        };

        this.cmap_nonlin_texture = new WGLTexture(gl, cmap_nonlin_image);
    }

    /**
     * @internal
     * Render the filled contours
     */
    render(gl: WebGLRenderingContext, matrix: number[]) {
        if (this.program === null || this.vertices === null || this.texcoords === null ||
            this.fill_texture === null || this.cmap_texture === null || this.cmap_nonlin_texture === null) return;

        this.program.use(
            {'a_pos': this.vertices, 'a_tex_coord': this.texcoords},
            {'u_cmap_min': this.cmap.levels[0], 'u_cmap_max': this.cmap.levels[this.cmap.levels.length - 1], 'u_matrix': matrix, 'u_opacity': this.opacity,
             'u_n_index': this.index_map.length},
            {'u_fill_sampler': this.fill_texture, 'u_cmap_sampler': this.cmap_texture, 'u_cmap_nonlin_sampler': this.cmap_nonlin_texture}
        );

        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        this.program.draw();
    }
}

export default ContourFill;
export type {ContourFillOptions};