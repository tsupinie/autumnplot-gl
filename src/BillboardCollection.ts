
import { WGLBuffer, WGLProgram, WGLTexture, WGLTextureSpec } from "./wgl";

const billboard_vertex_shader_src = require('./glsl/billboard_vertex.glsl');
const billboard_fragment_shader_src = require('./glsl/billboard_fragment.glsl');

interface BillboardSpec {
    pts: Float32Array;
    offset: Float32Array;
    tex_coords: Float32Array;
}

class BillboardCollection {
    readonly size: number;
    readonly aspect: number;
    readonly color: [number, number, number];

    readonly program: WGLProgram;
    readonly vertices: WGLBuffer;
    readonly offsets: WGLBuffer;

    readonly texture: WGLTexture;
    readonly texcoords: WGLBuffer;

    constructor(gl: WebGLRenderingContext, billboard_elements: BillboardSpec, billboard_image: WGLTextureSpec, billboard_size: [number, number], 
                billboard_color: [number, number, number]) {

        const [billboard_width, billboard_height] = billboard_size;

        this.size = billboard_height;
        this.aspect = billboard_width / billboard_height;
        this.color = billboard_color;

        this.program = new WGLProgram(gl, billboard_vertex_shader_src, billboard_fragment_shader_src);

        this.vertices = new WGLBuffer(gl, billboard_elements['pts'], 3, gl.TRIANGLE_STRIP);
        this.offsets = new WGLBuffer(gl, billboard_elements['offset'], 2, gl.TRIANGLE_STRIP);

        this.texcoords = new WGLBuffer(gl, billboard_elements['tex_coords'], 2, gl.TRIANGLE_STRIP);
        this.texture = new WGLTexture(gl, billboard_image);
    }

    render(gl: WebGLRenderingContext, matrix: number[], [map_width, map_height]: [number, number], map_zoom: number, map_bearing: number, map_pitch: number) {
        this.program.use(
            {'a_pos': this.vertices, 'a_offset': this.offsets, 'a_tex_coord': this.texcoords},
            {'u_billboard_size': this.size * (map_height / map_width), 'u_billboard_aspect': this.aspect, 'u_billboard_color': this.color,
             'u_matrix': matrix, 'u_map_aspect': map_height / map_width, 'u_zoom': map_zoom, 'u_map_bearing': map_bearing},
            {'u_sampler': this.texture}
        );

        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        this.program.draw();
    }
}

export {BillboardCollection};
export type {BillboardSpec};