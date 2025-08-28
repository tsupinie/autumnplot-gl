#version 300 es

uniform sampler2D u_dash_sampler;

#ifndef DATA
uniform lowp vec4 u_color;
#endif

uniform lowp float u_line_width;
uniform lowp float u_zoom;
uniform int u_dash_pattern_length;

#ifdef DATA
in highp float v_data;
#endif

in highp float v_dist;
in lowp float v_cross;

out highp vec4 fragColor;

void main() {
    lowp float dash_x = fract(v_dist * 2e2 * pow(2., floor(u_zoom)) / float(u_dash_pattern_length));
    lowp float dash = texture(u_dash_sampler, vec2(dash_x, 0.5)).r;

    lowp vec4 color;
#ifdef DATA
    color = apply_colormap(v_data);
#else
    color = u_color;
#endif

    lowp float feather = clamp((1. - abs(v_cross)) * u_line_width, 0., 1.);
    color.a *= (dash >= 1. ? 1. : 0.) * feather;

    fragColor = color;
}