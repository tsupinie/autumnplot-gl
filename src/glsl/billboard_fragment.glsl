varying highp vec2 v_tex_coord;

#ifdef COLORMAP
varying highp float v_mag;
#else
uniform lowp vec4 u_bb_color;
#endif

uniform sampler2D u_sampler;

void main() {
    lowp vec4 tex_color = texture2D(u_sampler, v_tex_coord);

    lowp vec4 color;
#ifdef COLORMAP
    color = apply_colormap(v_mag);
#else
    color = u_bb_color;
#endif

    color.a *= tex_color.a;
    gl_FragColor = color; // mix(vec4(1.0, 0.0, 0.0, 0.5), color, tex_color.a);
}