
import { TypedArray, WebGLAnyRenderingContext } from "./AutumnTypes";
import { Color } from "./Color";
import { MapLikeType } from "./Map";
import { PlotComponent, getGLFormatTypeAlignment } from "./PlotComponent";
import { RawScalarField } from "./RawField";
import { normalizeOptions } from "./utils";
import { WGLBuffer, WGLProgram, WGLTexture } from "autumn-wgl";

const paintball_vertex_shader_src = require('./glsl/paintball_vertex.glsl');
const paintball_fragment_shader_src = require('./glsl/paintball_fragment.glsl');

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

const paintball_opt_defaults: Required<PaintballOptions> = {
    colors: ['#000000'],
    opacity: 1
}

interface PaintballGLElems {
    gl: WebGLAnyRenderingContext;
    program: WGLProgram;
    vertices: WGLBuffer;
    texcoords: WGLBuffer;
}

/** 
 * A class representing a paintball plot, which is a plot of objects in every member of an ensemble. Objects are usually defined by a single threshold on
 * a field (such as simulated reflectivity greater than 40 dBZ), but could in theory be defined by any arbitrarily complicated method. In autumnplot-gl,
 * the data for the paintball plot is given as a single field with the objects from each member encoded as "bits" in the field. Because the field is made up
 * of single-precision floats, this works for up to 24 members. (Technically speaking, I don't need the quotes around "bits", as they're bits of the 
 * significand of an IEEE 754 float.)
 */
class Paintball<ArrayType extends TypedArray, MapType extends MapLikeType> extends PlotComponent<MapType> {
    private field: RawScalarField<ArrayType>;
    public readonly opts: Required<PaintballOptions>;
    private readonly color_components: number[];

    private gl_elems: PaintballGLElems | null;
    private fill_texture: WGLTexture | null;

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

        this.opts = normalizeOptions(opts, paintball_opt_defaults);
        this.color_components = [...this.opts.colors].reverse().map(color => Color.fromHex(color).toRGBATuple()).flat();
        
        this.gl_elems = null;
        this.fill_texture = null;
    }

    /**
     * Update the field displayed as a paintball plot
     * @param field - The new field to display as a paintball plot
     */
    public async updateField(field: RawScalarField<ArrayType>) {
        this.field = field;

        if (this.gl_elems === null) return;
        const gl = this.gl_elems.gl;

        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 2);

        const tex_data = this.field.getTextureData();
        const {format, type, row_alignment} = getGLFormatTypeAlignment(gl, !(tex_data instanceof Float32Array));

        const fill_image = {'format': format, 'type': type,
            'width': this.field.grid.ni, 'height': this.field.grid.nj, 'image': tex_data,
            'mag_filter': gl.NEAREST, 'row_alignment': row_alignment,
        };

        if (this.fill_texture === null) {
            this.fill_texture = new WGLTexture(gl, fill_image);
        }
        else {
            this.fill_texture.setImageData(fill_image);
        }
    }

    /**
     * @internal
     * Add the paintball plot to a map.
     */
    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        gl.getExtension('OES_texture_float');

        const program = new WGLProgram(gl, paintball_vertex_shader_src, paintball_fragment_shader_src);

        const {vertices: verts_buf, texcoords: tex_coords_buf} = await this.field.grid.getWGLBuffers(gl);
        const vertices = verts_buf;
        const texcoords = tex_coords_buf;

        this.gl_elems = {
            gl: gl, program: program, vertices: vertices, texcoords: texcoords,
        };

        this.updateField(this.field);
    }

    /**
     * @internal
     * Render the paintball plot
     */
    public render(gl: WebGLAnyRenderingContext, matrix: number[] | Float32Array) {
        if (this.gl_elems === null || this.fill_texture === null) return;
        const gl_elems = this.gl_elems;

        if (matrix instanceof Float32Array)
            matrix = [...matrix];

        // Render to framebuffer
        gl_elems.program.use(
            {'a_pos': gl_elems.vertices, 'a_tex_coord': gl_elems.texcoords},
            {'u_matrix': matrix, 'u_opacity': this.opts.opacity, 'u_colors': this.color_components, 'u_num_colors': this.opts.colors.length, 'u_offset': 0},
            {'u_fill_sampler': this.fill_texture}
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

export default Paintball;
export type {PaintballOptions};