#version 300 es

in highp vec2 v_tex_coord;

uniform sampler2D u_fill_sampler;
uniform lowp vec4 u_color;
uniform highp float u_opacity;

out highp vec4 fragColor;

void main() {
    highp float fill_val = texture(u_fill_sampler, v_tex_coord).r;
    
    if (fill_val < 0.4) {
        discard;
    }

    lowp vec4 color = u_color;

    color.a = color.a * u_opacity;
    fragColor = color;
}