
import { RenderMethodArg, TypedArray, WebGLAnyRenderingContext, getRendererData } from "./AutumnTypes";
import { Color } from "./Color";
import { StructuredGrid } from "./grids/StructuredGrid";
import { MapLikeType } from "./Map";
import { PlotComponent, getGLFormatTypeAlignment } from "./PlotComponent";
import { RawScalarField } from "./RawField";
import { ShaderProgramManager } from "./ShaderManager";
import { normalizeOptions } from "./utils";
import { WGLBuffer, WGLFramebuffer, WGLProgram, WGLTexture } from "autumn-wgl";

const paintball_step1_vertex_shader_src = require('./glsl/paintball_step1_vertex.glsl');
const paintball_step2_vertex_shader_src = require('./glsl/paintball_step2_vertex.glsl');
const paintball_step1_fragment_shader_src = require('./glsl/paintball_step1_fragment.glsl');
const paintball_step2_fragment_shader_src = require('./glsl/paintball_step2_fragment.glsl');

/** Options for {@link Paintball} components */
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

interface PaintballGLElems<MapType extends MapLikeType> {
    gl: WebGLAnyRenderingContext;
    map: MapType;
    shader_program_1: WGLProgram;
    shader_manager_2: ShaderProgramManager;
    vertices_step1: WGLBuffer;
    vertices_step2: WGLBuffer;
    texcoords_step2: WGLBuffer;
    framebuffer: WGLFramebuffer;
}

/** 
 * A class representing a paintball plot, which is a plot of objects in every member of an ensemble. Objects are usually defined by a single threshold on
 * a field (such as simulated reflectivity greater than 40 dBZ), but could in theory be defined by any arbitrarily complicated method. In autumnplot-gl,
 * the data for the paintball plot is given as a single field with the objects from each member encoded as "bits" in the field. Because the field is made up
 * of single-precision floats, this works for up to 24 members. (Technically speaking, I don't need the quotes around "bits", as they're bits of the 
 * significand of an IEEE 754 float.)
 */
class Paintball<ArrayType extends TypedArray, GridType extends StructuredGrid, MapType extends MapLikeType> extends PlotComponent<MapType> {
    private field: RawScalarField<ArrayType, GridType>;
    public readonly opts: Required<PaintballOptions>;
    private readonly color_components: [number, number, number, number][];

    private gl_elems: PaintballGLElems<MapType> | null;
    private fill_texture: WGLTexture | null;

    /**
     * Create a paintball plot
     * @param field - A scalar field containing the member objects encoded as "bits." The numerical value of each grid point can be constructed like 
     *               `1.0 * M1 + 2.0 * M2 + 4.0 * M3 + 8.0 * M4 ...`, where `M1` is 1 if that grid point is in an object in member 1 and 0 otherwise,
     *               `M2` is the same thing for member 2, and `M3` and `M4` and up to `Mn` are the same thing for the rest of the members.
     * @param opts  - Options for creating the paintball plot
     */
    constructor(field: RawScalarField<ArrayType, GridType>, opts?: PaintballOptions) {
        super();

        this.field = field;

        this.opts = normalizeOptions(opts, paintball_opt_defaults);
        this.color_components = this.opts.colors.map(color => Color.fromHex(color).toRGBATuple());
        
        this.gl_elems = null;
        this.fill_texture = null;
    }

    /**
     * Update the field displayed as a paintball plot
     * @param field - The new field to display as a paintball plot
     */
    public async updateField(field: RawScalarField<ArrayType, GridType>) {
        this.field = field;

        if (this.gl_elems === null) return;
        const gl = this.gl_elems.gl;

        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 2);

        const fill_image = this.field.getWGLTextureSpec(gl, gl.NEAREST);

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

        const vertices_step1 = new WGLBuffer(gl, new Float32Array([-1., -1., 1., -1., -1., 1., 1., 1.]), 2, gl.TRIANGLE_STRIP);
        const {vertices: vertices_step2, texcoords: texcoords_step2} = await this.field.grid.getWGLBuffers(gl);

        const shader_program_step1 = new WGLProgram(gl, paintball_step1_vertex_shader_src, paintball_step1_fragment_shader_src);
        const shader_manager_step2 = new ShaderProgramManager(paintball_step2_vertex_shader_src, paintball_step2_fragment_shader_src, []);

        const {format, type, row_alignment} = getGLFormatTypeAlignment(gl, 'float16');

        const fb_texture = new WGLTexture(gl, {format: format, type: type,
            width: this.field.grid.ni, height: this.field.grid.nj, image: null,
            mag_filter: gl.LINEAR, row_alignment: row_alignment});

        const fb = new WGLFramebuffer(gl, fb_texture);

        this.gl_elems = {
            gl: gl, map: map, shader_program_1: shader_program_step1, shader_manager_2: shader_manager_step2, 
            vertices_step1: vertices_step1, vertices_step2: vertices_step2, texcoords_step2: texcoords_step2,
            framebuffer: fb
        };

        this.updateField(this.field);
    }

    /**
     * @internal
     * Render the paintball plot
     */
    public render(gl: WebGLAnyRenderingContext, arg: RenderMethodArg) {
        if (this.gl_elems === null || this.fill_texture === null) return;
        const gl_elems = this.gl_elems;
        const fill_texture = this.fill_texture;

        const map = gl_elems.map;
        const viewport_width = map.getCanvas().width;
        const viewport_height = map.getCanvas().height;

        const render_data = getRendererData(arg);
        const program_step1 = this.gl_elems.shader_program_1;
        const program_step2 = this.gl_elems.shader_manager_2.getShaderProgram(gl, render_data.shaderData);

        this.color_components.forEach((color, icolor) => {
            // Render to framebuffer to pull out an individual member from the packed field
            program_step1.use(
                {'a_pos': gl_elems.vertices_step1},
                {'u_imem': icolor},
                {'u_fill_sampler': fill_texture}
            );

            gl_elems.framebuffer.clear([0, 0, 0, 1]);
            gl_elems.framebuffer.renderTo(0, 0, this.field.grid.ni, this.field.grid.nj);

            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

            program_step1.draw();

            // Now render the framebuffer as a filled contour
            program_step2.use(
                {'a_pos': gl_elems.vertices_step2, 'a_tex_coord': gl_elems.texcoords_step2},
                {'u_opacity': this.opts.opacity, 'u_color': color, 'u_offset': 0,
                ...gl_elems.shader_manager_2.getShaderUniforms(render_data)},
                {'u_fill_sampler': gl_elems.framebuffer.texture}
            );

            WGLFramebuffer.screen(gl).renderTo(0, 0, viewport_width, viewport_height);

            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

            program_step2.draw();

            if (render_data.type != 'maplibre' || !render_data.shaderData.define.includes('GLOBE')) {
                program_step2.setUniforms({'u_offset': -2});
                program_step2.draw();
        
                program_step2.setUniforms({'u_offset': -1});
                program_step2.draw();
        
                program_step2.setUniforms({'u_offset': 1});
                program_step2.draw();
            }
        });
    }
}

export default Paintball;
export type {PaintballOptions};