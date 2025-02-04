
uniform sampler2D u_cmap_sampler;
uniform sampler2D u_cmap_nonlin_sampler;
uniform highp float u_cmap_min;
uniform highp float u_cmap_max;
uniform highp vec4 u_underflow_color;
uniform highp vec4 u_overflow_color;
uniform int u_n_index;

lowp vec4 apply_colormap(highp float value) {
    lowp float normed_val = (value - u_cmap_min) / (u_cmap_max - u_cmap_min);
    
    lowp vec4 color;
    if (normed_val < 0.0) {
        color = u_underflow_color;
    }
    else if (normed_val > 1.0) {
        color = u_overflow_color;
    }
    else {
        lowp float index_buffer = 1. / (2. * float(u_n_index));
        normed_val = index_buffer + normed_val * (1. - 2. * index_buffer); // Chop off the half pixels on either end of the texture
        highp float nonlin_val = texture(u_cmap_nonlin_sampler, vec2(normed_val, 0.5)).r;
        color = texture(u_cmap_sampler, vec2(nonlin_val, 0.5));
    }

    return color;
}