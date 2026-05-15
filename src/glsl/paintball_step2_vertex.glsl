#version 300 es

uniform int u_offset;

in vec2 a_pos;
in vec2 a_tex_coord;

out highp vec2 v_tex_coord;

void main() {
    float globe_width = 1.;
    vec2 globe_offset = vec2(globe_width * float(u_offset), 0.);

    gl_Position = projectTile(a_pos.xy + globe_offset);
    v_tex_coord = a_tex_coord;
}