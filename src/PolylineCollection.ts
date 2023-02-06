
import { WGLBuffer, WGLProgram, WGLTexture, WGLTextureSpec } from "./wgl";
import { PolylineSpec, LineSpec } from "./AutumnTypes";

class PolylineCollection {
    readonly width: number;
    readonly scale: number;

    readonly program: WGLProgram;
    readonly origin: WGLBuffer;
    readonly offset: WGLBuffer;
    readonly extrusion: WGLBuffer;
    readonly min_zoom: WGLBuffer;

    readonly texture: WGLTexture;
    readonly texcoords: WGLBuffer;

    constructor(gl: WebGLRenderingContext, polyline: PolylineSpec, tex_image: WGLTextureSpec, line_width: number, offset_scale: number) {
        this.width = line_width;
        this.scale = offset_scale;

        const vertexSource = `
        uniform mat4 u_matrix;

        attribute vec2 a_pos;
        attribute float a_min_zoom;
        attribute vec2 a_extrusion;
        attribute vec2 a_offset;
        attribute vec2 a_tex_coord;
        uniform lowp float u_offset_scale;
        uniform lowp float u_map_aspect;
        uniform lowp float u_zoom;
        uniform lowp float u_line_width;
        uniform highp float u_map_bearing;
        //uniform highp float u_map_pitch;

        varying highp vec2 v_tex_coord;

        mat4 scalingMatrix(float x_scale, float y_scale, float z_scale) {
            return mat4(x_scale, 0.0,     0.0,     0.0,
                        0.0,     y_scale, 0.0,     0.0,
                        0.0,     0.0,     z_scale, 0.0,
                        0.0,     0.0,     0.0,     1.0);
        }

        mat4 rotationZMatrix(float angle) {
            float s = sin(angle);
            float c = cos(angle);

            return mat4( c,  s,  0., 0.,
                        -s,  c,  0., 0.,
                         0., 0., 1., 0.,
                         0., 0., 0., 1.);
        }

        mat4 rotationXMatrix(float angle) {
            float s = sin(angle);
            float c = cos(angle);

            return mat4( 1.,  0., 0., 0.,
                         0.,  c,  s,  0.,
                         0., -s,  c,  0.,
                         0.,  0., 0., 1.);
        }

        void main() {
            vec4 center_pos = u_matrix * vec4(a_pos.xy, 0.0, 1.0);
            vec4 offset = vec4(0.0, 0.0, 0.0, 0.0);
            
            if (u_zoom >= a_min_zoom) {
                vec2 offset_2d = a_offset + u_line_width * a_extrusion;

                mat4 rotation_matrix = rotationZMatrix(radians(u_map_bearing));
                mat4 map_stretch_matrix = scalingMatrix(u_offset_scale, u_offset_scale / u_map_aspect, 1.);
                offset = map_stretch_matrix * rotation_matrix * vec4(offset_2d, 0., 0.);
            }

            gl_Position = center_pos + offset;
            v_tex_coord = a_tex_coord;
        }`;

        const fragmentSource = `
        varying highp vec2 v_tex_coord;

        uniform sampler2D u_sampler;

        void main() {
            if (v_tex_coord.x > 1.0) {
                discard;
            }

            lowp vec4 tex_color = texture2D(u_sampler, v_tex_coord);
            gl_FragColor = tex_color;
        }`;

        this.program = new WGLProgram(gl, vertexSource, fragmentSource);

        this.origin = new WGLBuffer(gl, polyline['origin'], 2, gl.TRIANGLE_STRIP);
        this.offset = new WGLBuffer(gl, polyline['verts'], 2, gl.TRIANGLE_STRIP);
        this.extrusion = new WGLBuffer(gl, polyline['extrusion'], 2, gl.TRIANGLE_STRIP);
        this.min_zoom = new WGLBuffer(gl, polyline['zoom'], 1, gl.TRIANGLE_STRIP);

        this.texture = new WGLTexture(gl, tex_image);
        this.texcoords = new WGLBuffer(gl, polyline['texcoords'], 2, gl.TRIANGLE_STRIP);
    }

    render(gl: WebGLRenderingContext, matrix: number[], [map_width, map_height]: [number, number], map_zoom: number, map_bearing: number, map_pitch: number) {
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