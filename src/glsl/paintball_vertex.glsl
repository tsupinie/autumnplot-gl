uniform mat4 u_matrix;
uniform int u_offset;

attribute vec2 a_pos;
attribute vec2 a_tex_coord;

varying highp vec2 v_tex_coord;

void main() {
    float globe_width = 1.;
    vec2 globe_offset = vec2(globe_width * float(u_offset), 0.);

    gl_Position = u_matrix * vec4(a_pos + globe_offset, 0.0, 1.0);
    v_tex_coord = a_tex_coord;
}