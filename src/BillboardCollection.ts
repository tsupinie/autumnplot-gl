
import { BillboardSpec, RenderMethodArg, TypedArray, WebGLAnyRenderingContext, getRendererData } from "./AutumnTypes";
import { Color } from "./Color";
import { ColorMap, ColorMapGPUInterface } from "./Colormap";
import { Grid } from "./Grid";
import { RawVectorField } from "./RawField";
import { WGLBuffer, WGLTexture, WGLTextureSpec } from "autumn-wgl";
import { ShaderProgramManager } from "./ShaderManager";

const billboard_vertex_shader_src = require('./glsl/billboard_vertex.glsl');
const billboard_fragment_shader_src = require('./glsl/billboard_fragment.glsl');

interface BillboardCollectionOpts {
    color?: Color;
    cmap?: ColorMap;
    rotate_with_map?: boolean;
}

interface BillboardCollectionGLElems {
    gl: WebGLAnyRenderingContext;
    shader_manager: ShaderProgramManager;
    vertices: WGLBuffer;
    texcoords: WGLBuffer;
    texture: WGLTexture;
    proj_rot_texture: WGLTexture;
    cmap_gpu: ColorMapGPUInterface | null;
}

class BillboardCollection<ArrayType extends TypedArray, GridType extends Grid> {
    private field: RawVectorField<ArrayType, GridType>;
    public readonly spec: BillboardSpec;
    public readonly color: Color;
    public readonly cmap: ColorMap | null;
    public readonly rotate_with_map: boolean;
    public readonly size_multiplier: number;
    public readonly thin_fac: number;
    public readonly max_zoom: number;
    public readonly billboard_image: WGLTextureSpec;

    private gl_elems: BillboardCollectionGLElems | null;
    private wind_textures: {u: WGLTexture, v: WGLTexture} | null;

    constructor(field: RawVectorField<ArrayType, GridType>, thin_fac: number, max_zoom: number, 
                billboard_image: WGLTextureSpec, billboard_spec: BillboardSpec, billboard_size_mult: number, opts?: BillboardCollectionOpts) {

        opts = opts === undefined ? {} : opts;
        this.color = opts.color === undefined ? new Color([0, 0, 0, 1]) : opts.color;
        this.cmap = opts.cmap === undefined ? null : opts.cmap;
        this.rotate_with_map = opts.rotate_with_map === undefined ? true : opts.rotate_with_map;

        this.field = field;
        this.spec = billboard_spec;
        this.size_multiplier = billboard_size_mult;
        this.thin_fac = thin_fac;
        this.max_zoom = max_zoom;
        this.billboard_image = billboard_image;
        this.gl_elems = null;
        this.wind_textures = null;
    }

    public updateField(field: RawVectorField<ArrayType, GridType>) {
        this.field = field;

        if (this.gl_elems === null) return;

        const gl = this.gl_elems.gl;
        const data = this.field.getThinnedField(this.thin_fac, this.max_zoom);

        const {u: u_image, v: v_image} = data.getWGLTextureSpecs(gl, gl.NEAREST);

        if (this.wind_textures === null) {
            this.wind_textures = {u: new WGLTexture(gl, u_image), v: new WGLTexture(gl, v_image)};
        }
        else {
            this.wind_textures.u.setImageData(u_image);
            this.wind_textures.v.setImageData(v_image);
        }
    }

    public async setup(gl: WebGLAnyRenderingContext) {
        const thinned_grid = this.field.grid.getThinnedGrid(this.thin_fac, this.max_zoom);
        const {vertices, texcoords} = await thinned_grid.getWGLBillboardBuffers(gl, this.thin_fac, this.max_zoom);
        const {rotation: proj_rotation_tex} = thinned_grid.getVectorRotationTexture(gl, this.field.relative_to == 'earth');

        const texture = new WGLTexture(gl, this.billboard_image);

        const shader_defines: string[] = [];
        let fragment_src = billboard_fragment_shader_src;
        let cmap_gpu = null;
        if (this.cmap !== null) {
            fragment_src = ColorMapGPUInterface.applyShader(fragment_src);

            cmap_gpu = new ColorMapGPUInterface(this.cmap);
            cmap_gpu.setupShaderVariables(gl, gl.NEAREST);

            shader_defines.push('COLORMAP');
        }

        const shader_manager = new ShaderProgramManager(billboard_vertex_shader_src, fragment_src, shader_defines);

        this.gl_elems = {gl: gl, shader_manager: shader_manager, vertices: vertices, texcoords: texcoords, texture: texture, proj_rot_texture: proj_rotation_tex, cmap_gpu: cmap_gpu};
    }

    public render(gl: WebGLAnyRenderingContext, arg: RenderMethodArg, [map_width, map_height]: [number, number], map_zoom: number, map_bearing: number, map_pitch: number) {
        if (this.gl_elems === null || this.wind_textures === null) return;

        const render_data = getRendererData(arg);
        const program = this.gl_elems.shader_manager.getShaderProgram(gl, render_data.shaderData);

        const gl_elems = this.gl_elems;

        const bb_size = this.spec.BB_HEIGHT * (map_height / map_width) * this.size_multiplier;
        const bb_width = this.spec.BB_WIDTH / this.spec.BB_TEX_WIDTH;
        const bb_height = this.spec.BB_HEIGHT / this.spec.BB_TEX_HEIGHT;

        program.use(
            {'a_pos': gl_elems.vertices, 'a_tex_coord': gl_elems.texcoords},
            {'u_bb_size': bb_size, 'u_bb_width': bb_width, 'u_bb_height': bb_height,
             'u_bb_mag_bin_size': this.spec.BB_MAG_BIN_SIZE, 'u_bb_mag_wrap': this.spec.BB_MAG_WRAP, 'u_offset': 0,
             'u_map_aspect': map_height / map_width, 'u_zoom': map_zoom, 'u_rotate_with_map': this.rotate_with_map ? 1 : 0,
              ...this.gl_elems.shader_manager.getShaderUniforms(render_data)},
            {'u_sampler': gl_elems.texture, 'u_u_sampler': this.wind_textures.u, 'u_v_sampler': this.wind_textures.v, 'u_rot_sampler': gl_elems.proj_rot_texture}
        );

        if (gl_elems.cmap_gpu !== null) {
            gl_elems.cmap_gpu.bindShaderVariables(program);
        }
        else {
            program.setUniforms({'u_bb_color': this.color.toRGBATuple()});
        }

        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        program.draw();

        if (render_data.type != 'maplibre' || !render_data.shaderData.define.includes('GLOBE')) {
            program.setUniforms({'u_offset': -2});
            program.draw();

            program.setUniforms({'u_offset': -1});
            program.draw();

            program.setUniforms({'u_offset': 1});
            program.draw();
        }
    }
}

export {BillboardCollection};