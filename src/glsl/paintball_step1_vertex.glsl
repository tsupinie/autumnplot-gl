#version 300 es

in vec2 a_pos;

out highp vec2 v_tex_coord;

void main() {
    gl_Position = vec4(a_pos.xy, 0., 1.);
    v_tex_coord = 0.5 * a_pos.xy + vec2(0.5, 0.5);
}