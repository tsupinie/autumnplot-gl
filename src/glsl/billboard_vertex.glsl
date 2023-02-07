uniform mat4 u_matrix;

attribute vec3 a_pos;    // Has position and zoom info
attribute vec2 a_offset; // Has corner and orientation info
attribute vec2 a_tex_coord;
uniform lowp float u_billboard_size;
uniform lowp float u_billboard_aspect;
uniform lowp float u_map_aspect;
uniform lowp float u_zoom;
uniform highp float u_map_bearing;

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
    vec4 pivot_pos = u_matrix * vec4(a_pos.xy, 0.0, 1.0);
    lowp float min_zoom = a_pos.z;

    lowp float corner = a_offset.x;
    lowp float ang = radians(180.0 - a_offset.y);

    vec4 offset = vec4(0.0, 0.0, 0.0, 0.0);
    
    if (u_zoom >= min_zoom) {
        if (corner < 0.5) {
            offset = vec4(-u_billboard_size, u_billboard_size, 0., 0.);
        }
        else if (corner < 1.5) {
            offset = vec4(u_billboard_size, u_billboard_size, 0., 0.);
        }
        else if (corner < 2.5) {
            offset = vec4(-u_billboard_size, -u_billboard_size * (2. / u_billboard_aspect - 1.), 0., 0.);
        }
        else if (corner < 3.5) {
            offset = vec4(u_billboard_size, -u_billboard_size * (2. / u_billboard_aspect - 1.), 0., 0.);
        }

        mat4 barb_rotation = rotationZMatrix(ang + radians(u_map_bearing));
        mat4 map_stretch_matrix = scalingMatrix(1.0, 1. / u_map_aspect, 1.0);
        offset = map_stretch_matrix * barb_rotation * offset;
    }

    gl_Position = pivot_pos + offset;
    v_tex_coord = a_tex_coord;
}