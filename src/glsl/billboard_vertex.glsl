uniform mat4 u_matrix;
uniform int u_offset;

attribute vec3 a_pos;    // Has position, zoom, and corner info
attribute vec2 a_tex_coord;
uniform lowp float u_bb_size;
uniform lowp float u_map_aspect;
uniform lowp float u_zoom;
uniform highp float u_map_bearing;
uniform lowp float u_bb_width;  // Normalized by texture width
uniform lowp float u_bb_height; // Normalized by texture height
uniform highp float u_bb_mag_bin_size;
//uniform highp float u_bb_max_mag;
uniform highp float u_bb_mag_wrap;

uniform sampler2D u_u_sampler;
uniform sampler2D u_v_sampler;

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

    vec4 pivot_pos = u_matrix * vec4(a_pos.xy + globe_offset, 0.0, 1.0);
    highp float zoom_corner = a_pos.z;
    lowp float min_zoom = floor(zoom_corner / 4.0);
    lowp float corner = mod(zoom_corner, 4.0);

    highp float u = texture2D(u_u_sampler, a_tex_coord).r;
    highp float v = texture2D(u_v_sampler, a_tex_coord).r;

    lowp float bb_aspect = u_bb_width / u_bb_height;
    lowp float ang = (abs(u) < 1e-6 && abs(v) < 1e-6) ? 0. : atan(v, u) - 3.141592654 / 2.0;
    highp float mag = length(vec2(u, v));
    mag = floor(mag / u_bb_mag_bin_size + 0.5) * u_bb_mag_bin_size;

    vec4 offset = vec4(0.0, 0.0, 0.0, 0.0);
    vec2 texcoord = vec2(0.0, 0.0);
    
    if (u_zoom >= min_zoom) {
        vec2 tex_loc = vec2(mod(mag, u_bb_mag_wrap) / u_bb_mag_bin_size * u_bb_width, floor(mag / u_bb_mag_wrap) * u_bb_height);

        if (corner < 0.5) {
            offset = vec4(-u_bb_size, u_bb_size, 0., 0.);
            texcoord = tex_loc;
        }
        else if (corner < 1.5) {
            offset = vec4(u_bb_size, u_bb_size, 0., 0.);
            texcoord = tex_loc + vec2(u_bb_width, 0.0);
        }
        else if (corner < 2.5) {
            offset = vec4(-u_bb_size, -u_bb_size * (2. / bb_aspect - 1.), 0., 0.);
            texcoord = tex_loc + vec2(0.0, u_bb_height);
        }
        else if (corner < 3.5) {
            offset = vec4(u_bb_size, -u_bb_size * (2. / bb_aspect - 1.), 0., 0.);
            texcoord = tex_loc + vec2(u_bb_width, u_bb_height);
        }

        mat4 barb_rotation = rotationZMatrix(ang + radians(u_map_bearing));
        mat4 map_stretch_matrix = scalingMatrix(1.0, 1. / u_map_aspect, 1.0);
        offset = map_stretch_matrix * barb_rotation * offset;
    }

    gl_Position = pivot_pos + offset;
    v_tex_coord = texcoord;
}