
import { BillboardSpec, TypedArray, WebGLAnyRenderingContext } from "./AutumnTypes";
import { getGLFormatTypeAlignment } from "./PlotComponent";
import { RawVectorField } from "./RawField";
import { WGLBuffer, WGLProgram, WGLTexture, WGLTextureSpec } from "autumn-wgl";
import { Cache } from "./utils";

const billboard_vertex_shader_src = require('./glsl/billboard_vertex.glsl');
const billboard_fragment_shader_src = require('./glsl/billboard_fragment.glsl');
const program_cache = new Cache((gl: WebGLAnyRenderingContext) => new WGLProgram(gl, billboard_vertex_shader_src, billboard_fragment_shader_src))

class BillboardCollection<ArrayType extends TypedArray> {
    public readonly spec: BillboardSpec;
    public readonly color: [number, number, number];
    public readonly size_multiplier: number;

    private readonly program: WGLProgram;
    private vertices: WGLBuffer | null;
    private texcoords: WGLBuffer | null;
    private readonly texture: WGLTexture;
    private readonly u_texture: WGLTexture;
    private readonly v_texture: WGLTexture;

    constructor(gl: WebGLAnyRenderingContext, field: RawVectorField<ArrayType>, thin_fac: number, max_zoom: number, 
                billboard_image: WGLTextureSpec, billboard_spec: BillboardSpec, billboard_color: [number, number, number], billboard_size_mult: number) {

        this.spec = billboard_spec;
        this.color = billboard_color;
        this.size_multiplier = billboard_size_mult;

        this.program = program_cache.getValue(gl);
        this.vertices = null;
        this.texcoords = null;

        const n_density_tiers = Math.log2(thin_fac);
        const n_inaccessible_tiers = Math.max(n_density_tiers + 1 - max_zoom, 0);
        const trim_inaccessible = Math.pow(2, n_inaccessible_tiers);

        const earth_relative = field.getThinnedField(trim_inaccessible, trim_inaccessible).toEarthRelative();

        const u_thin = earth_relative.u;
        const v_thin = earth_relative.v;

        (async () => {
            const {vertices, texcoords} = await earth_relative.grid.getWGLBillboardBuffers(gl, thin_fac / trim_inaccessible, max_zoom);
            this.vertices = vertices;
            this.texcoords = texcoords;
        })();

        const {format, type, row_alignment} = getGLFormatTypeAlignment(gl, u_thin.isFloat16());

        const u_image = {'format': format, 'type': type,
            'width': u_thin.grid.ni, 'height': u_thin.grid.nj, 'image': u_thin.getTextureData(),
            'mag_filter': gl.NEAREST, 'row_alignment': row_alignment,
        };

        const v_image = {'format': format, 'type': type,
            'width': v_thin.grid.ni, 'height': v_thin.grid.nj, 'image': v_thin.getTextureData(),
            'mag_filter': gl.NEAREST, 'row_alignment': row_alignment,
        };

        this.texture = new WGLTexture(gl, billboard_image);
        this.u_texture = new WGLTexture(gl, u_image);
        this.v_texture = new WGLTexture(gl, v_image);
    }

    public render(gl: WebGLAnyRenderingContext, matrix: number[], [map_width, map_height]: [number, number], map_zoom: number, map_bearing: number, map_pitch: number) {
        if (this.vertices === null || this.texcoords === null) return;

        const bb_size = this.spec.BB_HEIGHT * (map_height / map_width) * this.size_multiplier;
        const bb_width = this.spec.BB_WIDTH / this.spec.BB_TEX_WIDTH;
        const bb_height = this.spec.BB_HEIGHT / this.spec.BB_TEX_HEIGHT;

        this.program.use(
            {'a_pos': this.vertices, 'a_tex_coord': this.texcoords},
            {'u_bb_size': bb_size, 'u_bb_width': bb_width, 'u_bb_height': bb_height,
             'u_bb_mag_bin_size': this.spec.BB_MAG_BIN_SIZE, 'u_bb_mag_wrap': this.spec.BB_MAG_WRAP, // 'u_bb_max_mag': this.spec.BB_MAG_MAX,
             'u_bb_color': this.color, 'u_matrix': matrix, 'u_map_aspect': map_height / map_width, 'u_zoom': map_zoom, 'u_map_bearing': map_bearing},
            {'u_sampler': this.texture, 'u_u_sampler': this.u_texture, 'u_v_sampler': this.v_texture}
        );

        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        this.program.draw();
    }
}

export {BillboardCollection};