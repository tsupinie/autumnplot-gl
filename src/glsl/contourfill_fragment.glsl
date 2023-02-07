varying highp vec2 v_tex_coord;

uniform sampler2D u_fill_sampler;
uniform sampler2D u_cmap_sampler;
uniform sampler2D u_cmap_nonlin_sampler;
uniform highp float u_cmap_min;
uniform highp float u_cmap_max;
uniform highp float u_opacity;
uniform int u_n_index;

void main() {
    lowp float index_buffer = 1. / (2. * float(u_n_index));
    highp float fill_val = texture2D(u_fill_sampler, v_tex_coord).r;
    lowp float normed_val = (fill_val - u_cmap_min) / (u_cmap_max - u_cmap_min);
    
    if (normed_val < 0.0 || normed_val > 1.0) {
        discard;
    }

    normed_val = index_buffer + normed_val * (1. - 2. * index_buffer); // Chop off the half pixels on either end of the texture
    highp float nonlin_val = texture2D(u_cmap_nonlin_sampler, vec2(normed_val, 0.5)).r;
    lowp vec4 color = texture2D(u_cmap_sampler, vec2(nonlin_val, 0.5));
    color.a = color.a * u_opacity;
    gl_FragColor = color;
}