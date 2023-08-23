varying highp vec2 v_tex_coord;

uniform sampler2D u_sampler;
uniform lowp vec3 u_bb_color;

void main() {
    lowp vec4 tex_color = texture2D(u_sampler, v_tex_coord);
    gl_FragColor = vec4(u_bb_color, tex_color.a); // mix(vec4(1.0, 0.0, 0.0, 0.5), vec4(u_bb_color, 1.0), tex_color.a);
}