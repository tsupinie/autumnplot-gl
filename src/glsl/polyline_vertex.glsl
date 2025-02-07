#version 300 es

uniform int u_offset;

in vec3 a_pos;
in vec2 a_extrusion;
in float a_data;

#ifdef ZOOM
in float a_min_zoom;
#endif

#ifdef OFFSET
in vec2 a_offset;
#endif

uniform lowp float u_line_width;
uniform lowp float u_map_width;
uniform lowp float u_map_height;
//uniform highp float u_map_bearing;

#ifdef ZOOM
uniform lowp float u_zoom;
#endif

#ifdef OFFSET
uniform int u_offset_rotates_with_map;
uniform lowp float u_offset_scale;
#endif

#ifdef DATA
out highp float v_data;
#endif

out highp float v_dist;
out lowp float v_cross;

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

    v_dist = abs(a_pos.z);
    v_cross = sign(a_pos.z);
    vec4 center_pos = projectTile(a_pos.xy + globe_offset);
    vec4 offset = vec4(0.0, 0.0, 0.0, 0.0);

#ifdef ZOOM
    if (u_zoom >= a_min_zoom) {
#endif

        vec2 offset_ext = u_line_width * 2. * a_extrusion;

        mat4 map_stretch_matrix = scalingMatrix(u_map_height / u_map_width, 1., 1.);
        
        vec4 center_pos_ihat = projectTile(a_pos.xy + globe_offset + vec2(1e-5, 0.));
        // Surely there's a more linear-algebra-y way to do this than converting all the rotations to an angle.
        vec2 center_east = normalize((inverse(map_stretch_matrix) * (center_pos_ihat - center_pos)).xy);
        float globe_rotation = atan(center_east.x, center_east.y) - 3.141592654 / 2.0;
        mat4 rotation_matrix = rotationZMatrix(-globe_rotation);

        offset = map_stretch_matrix * rotation_matrix * vec4(offset_ext, 0., 0.);

#ifdef OFFSET
        mat4 offset_matrix = scalingMatrix(1., u_map_width / u_map_height, 1.);
        if (u_offset_rotates_with_map == 1) {
            offset_matrix = offset_matrix * rotation_matrix;
        }
        else {
            offset = map_stretch_matrix * vec4(offset_ext, 0., 0.);
        }

        vec2 offset_offset = u_offset_scale * a_offset;
        offset += offset_matrix * vec4(offset_offset, 0., 0.);
#endif

#ifdef ZOOM
    }
#endif

    gl_Position = center_pos + offset;

#ifdef DATA
    v_data = a_data;
#endif
}