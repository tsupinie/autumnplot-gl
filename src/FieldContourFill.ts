
import { Field, layer_worker } from './Field';
import { Colormap, makeTextureImage } from './Colormap';
import { WGLBuffer, WGLProgram, WGLTexture } from './wgl';
import { RawDataField } from './RawDataField';
import { AutumnMap } from './AutumnMap';

/** A class representing a filled contoured field */
class FieldContourFill extends Field {
    readonly field: RawDataField;
    readonly cmap: Colormap;
    readonly opacity: number;

    /** @internal */
    readonly cmap_image: HTMLCanvasElement;
    /** @internal */
    readonly index_map: Float32Array;

    /** @internal */
    program: WGLProgram | null;
    /** @internal */
    vertices: WGLBuffer | null;

    /** @internal */
    fill_texture: WGLTexture | null;
    /** @internal */
    texcoords: WGLBuffer | null;
    /** @internal */
    cmap_texture: WGLTexture | null;
    /** @internal */
    cmap_nonlin_texture: WGLTexture | null;

    /**
     * Create a filled contoured field
     * @param field - The field to create filled contours from
     * @param opts  - Various options to use when creating the filled contours
     */
    constructor(field: RawDataField, opts: {'cmap': Colormap, 'opacity': number}) {
        super();

        this.field = field;
        this.cmap = opts['cmap'];
        this.opacity = opts['opacity'];

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

    async onAdd(map: AutumnMap, gl: WebGLRenderingContext) {
        // Basic procedure for the filled contours inspired by https://blog.mbq.me/webgl-weather-globe/
        gl.getExtension('OES_texture_float');
        gl.getExtension('OES_texture_float_linear');

        const vertexSource = `
        uniform mat4 u_matrix;

        attribute vec2 a_pos;
        attribute vec2 a_tex_coord;

        varying highp vec2 v_tex_coord;

        void main() {
            gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);
            v_tex_coord = a_tex_coord;
        }`;
        
        // create GLSL source for fragment shader
        const fragmentSource = `
        varying highp vec2 v_tex_coord;

        uniform sampler2D u_fill_sampler;
        uniform sampler2D u_cmap_sampler;
        uniform sampler2D u_cmap_nonlin_sampler;
        uniform highp float u_cmap_min;
        uniform highp float u_cmap_max;
        uniform highp float u_opacity;
        uniform int u_n_index;

        void main() {
            lowp float index_buffer = 1. / (2. * float(u_n_index));
            highp float fill_val = texture2D(u_fill_sampler, v_tex_coord).r;
            lowp float normed_val = (fill_val - u_cmap_min) / (u_cmap_max - u_cmap_min);
            
            if (normed_val < 0.0 || normed_val > 1.0) {
                discard;
            }

            normed_val = index_buffer + normed_val * (1. - 2. * index_buffer); // Chop off the half pixels on either end of the texture
            highp float nonlin_val = texture2D(u_cmap_nonlin_sampler, vec2(normed_val, 0.5)).r;
            lowp vec4 color = texture2D(u_cmap_sampler, vec2(nonlin_val, 0.5));
            color.a = color.a * u_opacity;
            gl_FragColor = color;
        }`;
        
        this.program = new WGLProgram(gl, vertexSource, fragmentSource);

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

export default FieldContourFill;