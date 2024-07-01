varying highp vec2 v_tex_coord;

uniform sampler2D u_sampler;
uniform lowp vec4 u_bb_color;

void main() {
    lowp vec4 tex_color = texture2D(u_sampler, v_tex_coord);
    lowp vec4 color = u_bb_color;
    color.a *= tex_color.a;
    gl_FragColor = color; // mix(vec4(1.0, 0.0, 0.0, 0.5), color, tex_color.a);
}