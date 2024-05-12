#ifdef DATA
varying highp float v_data;

uniform sampler2D u_cmap_sampler;
uniform sampler2D u_cmap_nonlin_sampler;
uniform highp float u_cmap_min;
uniform highp float u_cmap_max;
uniform int u_n_index;
#else
uniform lowp vec4 u_color;
#endif

void main() {
    lowp vec4 color;
#ifdef DATA
    lowp float index_buffer = 1. / (2. * float(u_n_index));
    lowp float normed_val = (v_data - u_cmap_min) / (u_cmap_max - u_cmap_min);

    if (normed_val < 0.0 || normed_val > 1.0) {
        discard;
    }

    normed_val = index_buffer + normed_val * (1. - 2. * index_buffer); // Chop off the half pixels on either end of the texture
    highp float nonlin_val = texture2D(u_cmap_nonlin_sampler, vec2(normed_val, 0.5)).r;
    color = texture2D(u_cmap_sampler, vec2(nonlin_val, 0.5));
#else
    color = u_color;
#endif
    gl_FragColor = color;
}