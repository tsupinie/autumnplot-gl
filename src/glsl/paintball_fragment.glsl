#version 300 es

#define MAX_N_COLORS 24

in highp vec2 v_tex_coord;

uniform sampler2D u_fill_sampler;
uniform lowp vec4 u_colors[MAX_N_COLORS];
uniform int u_num_colors;
uniform highp float u_opacity;

out highp vec4 fragColor;

void main() {
    highp float fill_val = texture(u_fill_sampler, v_tex_coord).r;
    
    if (fill_val < 0.5) {
        discard;
    }

    lowp vec4 color = vec4(0., 0., 0., 0.);

    for (int nclr = 0; nclr < MAX_N_COLORS ; nclr++) {
        if (nclr >= u_num_colors || fill_val < 0.99) { break; }

        lowp float mem_active = mod(fill_val, 2.);
        color = mix(color, u_colors[nclr], mem_active);
        fill_val = floor(fill_val / 2.);
    }

    color.a = color.a * u_opacity;
    fragColor = color;
}