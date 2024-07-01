
import { BillboardSpec, TypedArray, WebGLAnyRenderingContext } from "./AutumnTypes";
import { Color } from "./Color";
import { getGLFormatTypeAlignment } from "./PlotComponent";
import { RawVectorField } from "./RawField";
import { WGLBuffer, WGLProgram, WGLTexture, WGLTextureSpec } from "autumn-wgl";

const billboard_vertex_shader_src = require('./glsl/billboard_vertex.glsl');
const billboard_fragment_shader_src = require('./glsl/billboard_fragment.glsl');

class BillboardCollectionGLElems {
    gl: WebGLAnyRenderingContext;
    program: WGLProgram;
    vertices: WGLBuffer;
    texcoords: WGLBuffer;
    texture: WGLTexture;
    proj_rot_texture: WGLTexture;
}

class BillboardCollection<ArrayType extends TypedArray> {
    private field: RawVectorField<ArrayType>;
    public readonly spec: BillboardSpec;
    public readonly color: Color;
    public readonly size_multiplier: number;
    public readonly thin_fac: number;
    public readonly max_zoom: number;
    public readonly billboard_image: WGLTextureSpec;

    private gl_elems: BillboardCollectionGLElems | null;
    private wind_textures: {u: WGLTexture, v: WGLTexture} | null;
    private readonly trim_inaccessible: number;
    private show_field: boolean;

    constructor(field: RawVectorField<ArrayType>, thin_fac: number, max_zoom: number, 
                billboard_image: WGLTextureSpec, billboard_spec: BillboardSpec, billboard_color: Color, billboard_size_mult: number) {

        this.field = field;
        this.spec = billboard_spec;
        this.color = billboard_color;
        this.size_multiplier = billboard_size_mult;
        this.thin_fac = thin_fac;
        this.max_zoom = max_zoom;
        this.billboard_image = billboard_image;
        this.gl_elems = null;
        this.wind_textures = null;

        const n_density_tiers = Math.log2(thin_fac);
        const n_inaccessible_tiers = Math.max(n_density_tiers + 1 - max_zoom, 0);
        this.trim_inaccessible = Math.pow(2, n_inaccessible_tiers);
        this.show_field = true;
    }

    public updateField(field: RawVectorField<ArrayType>) {
        this.field = field;

        if (this.gl_elems === null) return;

        const gl = this.gl_elems.gl;
        const data = this.field.getThinnedField(this.trim_inaccessible, this.trim_inaccessible);

        const {u: u_thin, v: v_thin} = data.getTextureData();
        this.show_field = u_thin !== null;
        const {format, type, row_alignment} = getGLFormatTypeAlignment(gl, !(u_thin instanceof Float32Array));

        const u_image = {'format': format, 'type': type,
            'width': data.grid.ni, 'height': data.grid.nj, 'image': u_thin,
            'mag_filter': gl.NEAREST, 'row_alignment': row_alignment,
        };

        const v_image = {'format': format, 'type': type,
            'width': data.grid.ni, 'height': data.grid.nj, 'image': v_thin,
            'mag_filter': gl.NEAREST, 'row_alignment': row_alignment,
        };

        if (this.wind_textures === null) {
            this.wind_textures = {u: new WGLTexture(gl, u_image), v: new WGLTexture(gl, v_image)};
        }
        else {
            this.wind_textures.u.setImageData(u_image);
            this.wind_textures.v.setImageData(v_image);
        }
    }

    public async setup(gl: WebGLAnyRenderingContext) {
        const program = new WGLProgram(gl, billboard_vertex_shader_src, billboard_fragment_shader_src);

        const thinned_field = this.field.getThinnedField(this.trim_inaccessible, this.trim_inaccessible);
        const {vertices, texcoords} = await thinned_field.grid.getWGLBillboardBuffers(gl, this.thin_fac / this.trim_inaccessible, this.max_zoom);
        const {rotation: proj_rotation_tex} = thinned_field.grid.getVectorRotationTexture(gl);

        const texture = new WGLTexture(gl, this.billboard_image);

        this.gl_elems = {gl: gl, program: program, vertices: vertices, texcoords: texcoords, texture: texture, proj_rot_texture: proj_rotation_tex};
    }

    public render(gl: WebGLAnyRenderingContext, matrix: number[] | Float32Array, [map_width, map_height]: [number, number], map_zoom: number, map_bearing: number, map_pitch: number) {
        if (this.gl_elems === null || this.wind_textures === null || !this.show_field) return;

        if (matrix instanceof Float32Array)
            matrix = [...matrix];

        const gl_elems = this.gl_elems;

        const bb_size = this.spec.BB_HEIGHT * (map_height / map_width) * this.size_multiplier;
        const bb_width = this.spec.BB_WIDTH / this.spec.BB_TEX_WIDTH;
        const bb_height = this.spec.BB_HEIGHT / this.spec.BB_TEX_HEIGHT;

        gl_elems.program.use(
            {'a_pos': gl_elems.vertices, 'a_tex_coord': gl_elems.texcoords},
            {'u_bb_size': bb_size, 'u_bb_width': bb_width, 'u_bb_height': bb_height,
             'u_bb_mag_bin_size': this.spec.BB_MAG_BIN_SIZE, 'u_bb_mag_wrap': this.spec.BB_MAG_WRAP, 'u_offset': 0,
             'u_bb_color': this.color.toRGBATuple(), 'u_matrix': matrix, 'u_map_aspect': map_height / map_width, 'u_zoom': map_zoom, 'u_map_bearing': map_bearing},
            {'u_sampler': gl_elems.texture, 'u_u_sampler': this.wind_textures.u, 'u_v_sampler': this.wind_textures.v, 'u_rot_sampler': gl_elems.proj_rot_texture}
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

export {BillboardCollection};