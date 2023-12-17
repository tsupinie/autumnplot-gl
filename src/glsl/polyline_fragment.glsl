#ifdef DATA
varying highp float v_data;

uniform sampler2D u_sampler;
uniform highp float u_cmap_min;
uniform highp float u_cmap_max;
#else
uniform lowp vec4 u_color;
#endif

void main() {
    lowp vec4 color;
#ifdef DATA
    lowp float tex_coord = (v_data - u_cmap_min) / (u_cmap_max - u_cmap_min);

    if (tex_coord > 1.0) {
        discard;
    }

    color = texture2D(u_sampler, vec2(tex_coord, 0.5));
#else
    color = u_color;
#endif
    gl_FragColor = color;
}