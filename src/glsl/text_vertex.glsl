#version 300 es

uniform mat4 u_matrix;
uniform int u_offset;
uniform highp float u_map_width;
uniform highp float u_map_height;
uniform highp float u_map_zoom;
uniform highp float u_font_size;

in vec3 a_pos;
in vec2 a_offset;
in vec2 a_tex_coord;

out highp vec2 v_tex_coord;

mat4 scalingMatrix(float x_scale, float y_scale, float z_scale) {
    return mat4(x_scale, 0.0,     0.0,     0.0,
                0.0,     y_scale, 0.0,     0.0,
                0.0,     0.0,     z_scale, 0.0,
                0.0,     0.0,     0.0,     1.0);
}

void main() {
    float min_zoom = a_pos.z;

    vec2 offset = a_offset;
    if (u_map_zoom < min_zoom)
        offset = vec2(0., 0.);

    float globe_width = 1.;
    vec2 globe_offset = vec2(globe_width * float(u_offset), 0.);

    mat4 map_stretch_matrix = scalingMatrix(u_map_height / u_map_width, 1., 1.);

    gl_Position = u_matrix * vec4(a_pos.xy + globe_offset, 0.0, 1.0) + u_font_size / 12. * 1.5 * map_stretch_matrix * vec4(offset, 0., 0.);
    v_tex_coord = a_tex_coord;
}