uniform mat4 u_matrix;

attribute vec2 a_pos;
attribute vec2 a_tex_coord;
attribute float a_latitude;

varying highp vec2 v_tex_coord;
varying highp float v_map_scale_fac;

void main() {
    gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);
    v_tex_coord = a_tex_coord;
    v_map_scale_fac = cos(a_latitude * 3.141592654 / 180.);
}