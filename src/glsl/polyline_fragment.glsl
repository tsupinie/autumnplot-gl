#ifdef DATA
varying highp float v_data;
#else
uniform lowp vec4 u_color;
#endif

void main() {
    lowp vec4 color;
#ifdef DATA
    color = apply_colormap(v_data);
#else
    color = u_color;
#endif
    gl_FragColor = color;
}