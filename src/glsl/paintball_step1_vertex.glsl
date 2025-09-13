#version 300 es

in vec2 a_pos;
in vec2 a_tex_coord;

out highp vec2 v_tex_coord;

void main() {
    gl_Position = vec4(a_pos.xy, 0., 1.);
    v_tex_coord = a_tex_coord;
}