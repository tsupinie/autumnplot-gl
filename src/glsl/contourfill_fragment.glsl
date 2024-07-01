varying highp vec2 v_tex_coord;

uniform sampler2D u_fill_sampler;
uniform highp float u_opacity;

void main() {
    highp float fill_val = texture2D(u_fill_sampler, v_tex_coord).r;

    lowp vec4 color = apply_colormap(fill_val);
    color.a = color.a * u_opacity;
    gl_FragColor = color;
}