
import { WGLBuffer, WGLProgram, WGLTexture, WGLTextureSpec } from "./wgl";

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

        const vertexSource = `
        uniform mat4 u_matrix;

        attribute vec3 a_pos;    // Has position and zoom info
        attribute vec2 a_offset; // Has corner and orientation info
        attribute vec2 a_tex_coord;
        uniform lowp float u_billboard_size;
        uniform lowp float u_billboard_aspect;
        uniform lowp float u_map_aspect;
        uniform lowp float u_zoom;
        uniform highp float u_map_bearing;

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
            vec4 pivot_pos = u_matrix * vec4(a_pos.xy, 0.0, 1.0);
            lowp float min_zoom = a_pos.z;

            lowp float corner = a_offset.x;
            lowp float ang = radians(180.0 - a_offset.y);

            vec4 offset = vec4(0.0, 0.0, 0.0, 0.0);
            
            if (u_zoom >= min_zoom) {
                if (corner < 0.5) {
                    offset = vec4(-u_billboard_size, u_billboard_size, 0., 0.);
                }
                else if (corner < 1.5) {
                    offset = vec4(u_billboard_size, u_billboard_size, 0., 0.);
                }
                else if (corner < 2.5) {
                    offset = vec4(-u_billboard_size, -u_billboard_size * (2. / u_billboard_aspect - 1.), 0., 0.);
                }
                else if (corner < 3.5) {
                    offset = vec4(u_billboard_size, -u_billboard_size * (2. / u_billboard_aspect - 1.), 0., 0.);
                }

                mat4 barb_rotation = rotationZMatrix(ang + radians(u_map_bearing));
                mat4 map_stretch_matrix = scalingMatrix(1.0, 1. / u_map_aspect, 1.0);
                offset = map_stretch_matrix * barb_rotation * offset;
            }

            gl_Position = pivot_pos + offset;
            v_tex_coord = a_tex_coord;
        }`;

        const fragmentSource = `
        varying highp vec2 v_tex_coord;

        uniform sampler2D u_sampler;
        uniform lowp vec3 u_billboard_color;

        void main() {
            lowp vec4 tex_color = texture2D(u_sampler, v_tex_coord);
            gl_FragColor = vec4(u_billboard_color, tex_color.a); //mix(vec4(1.0, 0.0, 0.0, 0.5), tex_color, tex_color.a);
        }`;

        this.program = new WGLProgram(gl, vertexSource, fragmentSource);

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