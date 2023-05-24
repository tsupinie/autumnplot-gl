uniform mat4 u_matrix;

attribute vec2 a_pos;
attribute vec2 a_tex_coord;

varying highp vec2 v_tex_coord;

void main() {
    gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);
    v_tex_coord = a_tex_coord;
}