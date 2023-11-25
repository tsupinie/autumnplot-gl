uniform mat4 u_matrix;
uniform int u_offset;

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
    float globe_width = 1.;
    vec2 globe_offset = vec2(globe_width * float(u_offset), 0.);

    vec4 center_pos = u_matrix * vec4(a_pos.xy + globe_offset, 0.0, 1.0);
    vec4 offset = vec4(0.0, 0.0, 0.0, 0.0);
    
    if (u_zoom >= a_min_zoom) {
        vec2 offset_2d = a_offset + u_line_width * a_extrusion;

        mat4 rotation_matrix = rotationZMatrix(radians(u_map_bearing));
        mat4 map_stretch_matrix = scalingMatrix(u_offset_scale, u_offset_scale / u_map_aspect, 1.);
        offset = map_stretch_matrix * rotation_matrix * vec4(offset_2d, 0., 0.);
    }

    gl_Position = center_pos + offset;
    v_tex_coord = a_tex_coord;
}