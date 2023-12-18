uniform mat4 u_matrix;

attribute vec2 a_pos;
attribute vec2 a_extrusion;
attribute float a_data;

#ifdef ZOOM
attribute float a_min_zoom;
#endif

#ifdef OFFSET
attribute vec2 a_offset;
#endif

uniform lowp float u_line_width;
uniform lowp float u_map_width;
uniform lowp float u_map_height;
uniform highp float u_map_bearing;

#ifdef ZOOM
uniform lowp float u_zoom;
#endif

#ifdef OFFSET
uniform lowp float u_offset_scale;
#endif

#ifdef DATA
varying highp float v_data;
#endif

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

#ifdef ZOOM
    if (u_zoom >= a_min_zoom) {
#endif

        vec2 offset_ext = u_line_width * a_extrusion;

        mat4 map_stretch_matrix = scalingMatrix(u_map_height / u_map_width, 1., 1.);
        mat4 rotation_matrix = rotationZMatrix(radians(u_map_bearing));  
        offset = map_stretch_matrix * rotation_matrix * vec4(offset_ext, 0., 0.);

#ifdef OFFSET
        map_stretch_matrix = scalingMatrix(1., u_map_width / u_map_height, 1.);
        vec2 offset_offset = u_offset_scale * a_offset;
        offset += map_stretch_matrix * rotation_matrix * vec4(offset_offset, 0., 0.);
#endif

#ifdef ZOOM
    }
#endif

    gl_Position = center_pos + offset;

#ifdef DATA
    v_data = a_data;
#endif
}