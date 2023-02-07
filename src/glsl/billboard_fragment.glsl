varying highp vec2 v_tex_coord;

uniform sampler2D u_sampler;
uniform lowp vec3 u_billboard_color;

void main() {
    lowp vec4 tex_color = texture2D(u_sampler, v_tex_coord);
    gl_FragColor = vec4(u_billboard_color, tex_color.a); //mix(vec4(1.0, 0.0, 0.0, 0.5), tex_color, tex_color.a);
}