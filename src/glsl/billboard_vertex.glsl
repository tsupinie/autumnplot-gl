#version 300 es

uniform int u_offset;

in vec2 a_pos;    // Has grid point position
in vec2 a_tex_coord; // zoom info is on the x coordinate
in lowp float a_geom; // Has corner info
uniform lowp float u_bb_size;
uniform lowp float u_map_aspect;
uniform lowp float u_zoom;
uniform lowp float u_bb_width;  // Normalized by texture width
uniform lowp float u_bb_height; // Normalized by texture height
uniform highp float u_bb_mag_bin_size;
uniform highp float u_bb_mag_wrap;
uniform int u_rotate_with_map;

uniform sampler2D u_u_sampler;
uniform sampler2D u_v_sampler;
uniform sampler2D u_rot_sampler;

out highp vec2 v_tex_coord;
#ifdef COLORMAP
out highp float v_mag;
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
    float globe_width = 1.;
    vec2 globe_offset = vec2(globe_width * float(u_offset), 0.);

    mat4 map_stretch_matrix = scalingMatrix(1.0, 1. / u_map_aspect, 1.0);

    vec4 pivot_pos = projectTile(a_pos.xy + globe_offset);
    float globe_rotation = 0.0;

    if (u_rotate_with_map == 1) {
        vec4 pivot_pos_ihat = projectTile(a_pos.xy + globe_offset + vec2(1e-5, 0.));
        // Surely there's a more linear-algebra-y way to do this than converting all the rotations to an angle.
        vec2 pivot_east = normalize((inverse(map_stretch_matrix) * (pivot_pos_ihat - pivot_pos)).xy);
        globe_rotation = atan(pivot_east.x, pivot_east.y) - 3.141592654 / 2.0;
    }

    highp float min_zoom = floor(a_tex_coord.x);
    lowp float corner = a_geom;

    vec2 data_texcoord = a_tex_coord;
    data_texcoord.x = fract(data_texcoord.x);

    highp float u = texture(u_u_sampler, data_texcoord).r;
    highp float v = texture(u_v_sampler, data_texcoord).r;
    highp float rot = texture(u_rot_sampler, data_texcoord).r;

    lowp float bb_aspect = u_bb_width / u_bb_height;
    lowp float ang = (abs(u) < 1e-6 && abs(v) < 1e-6) ? 0. : atan(v, u) - 3.141592654 / 2.0;
    highp float mag = length(vec2(u, v));
#ifdef COLORMAP
    v_mag = mag;
#endif
    mag = floor(mag / u_bb_mag_bin_size + 0.5) * u_bb_mag_bin_size;

    vec4 offset = vec4(0.0, 0.0, 0.0, 0.0);
    vec2 texcoord = vec2(0.0, 0.0);
    
    if (u_zoom >= min_zoom) {
        // Subtracting a small number off of u_bb_mag_wrap fixes (I think) a precision issue on some GPUs
        vec2 tex_loc = vec2(mod(mag, u_bb_mag_wrap - 1e-5) / u_bb_mag_bin_size * u_bb_width, floor(mag / (u_bb_mag_wrap - 1e-5)) * u_bb_height);

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

        mat4 barb_rotation = rotationZMatrix(ang - globe_rotation - rot);
        offset = map_stretch_matrix * barb_rotation * offset;
    }

    gl_Position = pivot_pos + offset;
    v_tex_coord = texcoord;
}