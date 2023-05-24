
import { MapType } from "./Map";
import { PlotComponent } from "./PlotComponent";
import { RawScalarField } from "./RawField";
import { hex2rgba } from "./utils";
import { WGLBuffer, WGLProgram, WGLTexture } from "./wgl";

const paintball_vertex_shader_src = require('./glsl/paintball_vertex.glsl');
const paintball_fragment_shader_src = require('./glsl/paintball_fragment.glsl');

interface PaintballOptions {
    colors?: string[];
    threshold?: number;
    opacity?: number;
}

class Paintball extends PlotComponent {
    readonly field: RawScalarField;
    readonly colors: number[];
    readonly opacity: number;

    /** @private */
    program: WGLProgram | null;
    /** @private */
    vertices: WGLBuffer | null;

    /** @private */
    fill_texture: WGLTexture | null;
    /** @private */
    texcoords: WGLBuffer | null;

    constructor(field: RawScalarField, opts?: PaintballOptions) {
        super();

        this.field = field;

        opts = opts !== undefined ? opts : {};
        const colors = opts.colors !== undefined ? [...opts.colors] : ['#000000'];
        this.colors = colors.reverse().map(color => hex2rgba(color)).flat()
        this.opacity = opts.opacity !== undefined ? opts.opacity : 1.;

        this.program = null;
        this.vertices = null;
        this.fill_texture = null;
        this.texcoords = null;
    }

    async onAdd(map: MapType, gl: WebGLRenderingContext) {
        this.program = new WGLProgram(gl, paintball_vertex_shader_src, paintball_fragment_shader_src);

        const {vertices: verts_buf, texcoords: tex_coords_buf} = await this.field.grid.getWGLBuffers(gl);
        this.vertices = verts_buf;
        this.texcoords = tex_coords_buf;

        const fill_image = {'format': gl.LUMINANCE, 'type': gl.FLOAT,
            'width': this.field.grid.ni, 'height': this.field.grid.nj, 'image': this.field.data,
            'mag_filter': gl.NEAREST,
        };

        this.fill_texture = new WGLTexture(gl, fill_image);
    }

    render(gl: WebGLRenderingContext, matrix: number[]) {
        if (this.program === null || this.vertices === null || this.texcoords === null || this.fill_texture === null) return;

        this.program.use(
            {'a_pos': this.vertices, 'a_tex_coord': this.texcoords},
            {'u_matrix': matrix, 'u_opacity': this.opacity, 'u_colors': this.colors, 'u_num_colors': this.colors.length / 4},
            {'u_fill_sampler': this.fill_texture}
        );

        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        this.program.draw();
    }
}

export default Paintball;
export type {PaintballOptions};