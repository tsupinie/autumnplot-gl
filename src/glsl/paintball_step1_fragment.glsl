#version 300 es

in highp vec2 v_tex_coord;

uniform sampler2D u_fill_sampler;
uniform int u_imem;

out highp vec4 fragColor;

void main() {
    int fill_val = int(texture(u_fill_sampler, v_tex_coord).r);
    
    if (fill_val < 1) {
        discard;
    }

    lowp vec4 off_color = vec4(0., 0., 0., 1.);
    lowp vec4 on_color = vec4(1., 1., 1., 1.);

    int mask = 1 << u_imem;
    lowp float mem_active = float((fill_val & mask) > 0);
    fragColor = mix(off_color, on_color, mem_active);
}