
import { TypedArray, WebGLAnyRenderingContext } from "./AutumnTypes";
import { MapType } from "./Map";
import { PlotComponent, getGLFormatTypeAlignment } from "./PlotComponent";
import { RawScalarField } from "./RawField";
import { Cache, hex2rgba } from "./utils";
import { WGLBuffer, WGLProgram, WGLTexture } from "autumn-wgl";

const paintball_vertex_shader_src = require('./glsl/paintball_vertex.glsl');
const paintball_fragment_shader_src = require('./glsl/paintball_fragment.glsl');
const program_cache = new Cache((gl: WebGLAnyRenderingContext) => new WGLProgram(gl, paintball_vertex_shader_src, paintball_fragment_shader_src));

interface PaintballOptions {
    /**
     * The list of colors (as hex strings) to use for each member in the paintball plot. The first color corresponds to member 1, the second to member 2, etc.
     */
    colors?: string[];

    /**
     * The opacity of the paintball plot
     * @default 1
     */
    opacity?: number;
}

interface PaintballGLElems {
    program: WGLProgram;
    vertices: WGLBuffer;
    fill_texture: WGLTexture;
    texcoords: WGLBuffer;
}

/** 
 * A class representing a paintball plot, which is a plot of objects in every member of an ensemble. Objects are usually defined by a single threshold on
 * a field (such as simulated reflectivity greater than 40 dBZ), but could in theory be defined by any arbitrarily complicated method. In autumnplot-gl,
 * the data for the paintball plot is given as a single field with the objects from each member encoded as "bits" in the field. Because the field is made up
 * of single-precision floats, this works for up to 24 members. (Technically speaking, I don't need the quotes around "bits", as they're bits of the 
 * significand of an IEEE 754 float.)
 */
class Paintball<ArrayType extends TypedArray> extends PlotComponent {
    private readonly field: RawScalarField<ArrayType>;
    public readonly colors: number[];
    public readonly opacity: number;

    private gl_elems: PaintballGLElems | null;

    /**
     * Create a paintball plot
     * @param field - A scalar field containing the member objects encoded as "bits." The numerical value of each grid point can be constructed like 
     *               `1.0 * M1 + 2.0 * M2 + 4.0 * M3 + 8.0 * M4 ...`, where `M1` is 1 if that grid point is in an object in member 1 and 0 otherwise,
     *               `M2` is the same thing for member 2, and `M3` and `M4` and up to `Mn` are the same thing for the rest of the members.
     * @param opts  - Options for creating the paintball plot
     */
    constructor(field: RawScalarField<ArrayType>, opts?: PaintballOptions) {
        super();

        this.field = field;

        opts = opts !== undefined ? opts : {};
        const colors = opts.colors !== undefined ? [...opts.colors] : ['#000000'];
        this.colors = colors.reverse().map(color => hex2rgba(color)).flat()
        this.opacity = opts.opacity !== undefined ? opts.opacity : 1.;

        this.gl_elems = null;
    }

    /**
     * @internal
     * Add the paintball plot to a map.
     */
    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        gl.getExtension('OES_texture_float');

        const program = program_cache.getValue(gl);

        const {vertices: verts_buf, texcoords: tex_coords_buf} = await this.field.grid.getWGLBuffers(gl);
        const vertices = verts_buf;
        const texcoords = tex_coords_buf;

        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 2);

        const {format, type, row_alignment} = getGLFormatTypeAlignment(gl, this.field.isFloat16());

        const fill_image = {'format': format, 'type': type,
            'width': this.field.grid.ni, 'height': this.field.grid.nj, 'image': this.field.getTextureData(),
            'mag_filter': gl.NEAREST, 'row_alignment': row_alignment,
        };

        const fill_texture = new WGLTexture(gl, fill_image);

        this.gl_elems = {
            program: program, vertices: vertices, fill_texture: fill_texture, texcoords: texcoords,
        };
    }

    /**
     * @internal
     * Render the paintball plot
     */
    public render(gl: WebGLAnyRenderingContext, matrix: number[]) {
        if (this.gl_elems === null) return;
        const gl_elems = this.gl_elems;

        // Render to framebuffer
        gl_elems.program.use(
            {'a_pos': gl_elems.vertices, 'a_tex_coord': gl_elems.texcoords},
            {'u_matrix': matrix, 'u_opacity': this.opacity, 'u_colors': this.colors, 'u_num_colors': this.colors.length / 4},
            {'u_fill_sampler': gl_elems.fill_texture}
        );

        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        gl_elems.program.draw();
    }
}

export default Paintball;
export type {PaintballOptions};