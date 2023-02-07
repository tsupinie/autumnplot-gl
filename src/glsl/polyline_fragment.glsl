varying highp vec2 v_tex_coord;

uniform sampler2D u_sampler;

void main() {
    if (v_tex_coord.x > 1.0) {
        discard;
    }

    lowp vec4 tex_color = texture2D(u_sampler, v_tex_coord);
    gl_FragColor = tex_color;
}