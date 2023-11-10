
import { WGLBuffer, WGLProgram, WGLTexture, WGLTextureSpec } from "autumn-wgl";
import { PolylineSpec, LineSpec, WebGLAnyRenderingContext } from "./AutumnTypes";
import { Cache } from "./utils";

const polyline_vertex_src = require('./glsl/polyline_vertex.glsl');
const polyline_fragment_src = require('./glsl/polyline_fragment.glsl');
const program_cache = new Cache((gl: WebGLAnyRenderingContext) => new WGLProgram(gl, polyline_vertex_src, polyline_fragment_src));

class PolylineCollection {
    public readonly width: number;
    public readonly scale: number;

    private readonly program: WGLProgram;
    private readonly origin: WGLBuffer;
    private readonly offset: WGLBuffer;
    private readonly extrusion: WGLBuffer;
    private readonly min_zoom: WGLBuffer;

    private readonly texture: WGLTexture;
    private readonly texcoords: WGLBuffer;

    constructor(gl: WebGLAnyRenderingContext, polyline: PolylineSpec, tex_image: WGLTextureSpec, line_width: number, offset_scale: number) {
        this.width = line_width;
        this.scale = offset_scale;

        this.program = program_cache.getValue(gl);

        this.origin = new WGLBuffer(gl, polyline['origin'], 2, gl.TRIANGLE_STRIP);
        this.offset = new WGLBuffer(gl, polyline['verts'], 2, gl.TRIANGLE_STRIP);
        this.extrusion = new WGLBuffer(gl, polyline['extrusion'], 2, gl.TRIANGLE_STRIP);
        this.min_zoom = new WGLBuffer(gl, polyline['zoom'], 1, gl.TRIANGLE_STRIP);

        this.texture = new WGLTexture(gl, tex_image);
        this.texcoords = new WGLBuffer(gl, polyline['texcoords'], 2, gl.TRIANGLE_STRIP);
    }

    public render(gl: WebGLAnyRenderingContext, matrix: number[], [map_width, map_height]: [number, number], map_zoom: number, map_bearing: number, map_pitch: number) {
        this.program.use(
            {'a_pos': this.origin, 'a_offset': this.offset, 'a_extrusion': this.extrusion, 'a_min_zoom': this.min_zoom, 'a_tex_coord': this.texcoords},
            {'u_offset_scale': this.scale * (map_height / map_width), 'u_line_width': this.width, 'u_matrix': matrix,
             'u_map_aspect': map_height / map_width, 'u_zoom': map_zoom, 'u_map_bearing': map_bearing},
            {'u_sampler': this.texture}
        );

        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        this.program.draw();
    }
}

export {PolylineCollection};
export type {PolylineSpec, LineSpec};