#version 300 es

in highp vec2 v_tex_coord;

uniform int u_imem;

out highp vec4 fragColor;

void main() {
    uint fill_val = uint(get_field_value(v_tex_coord));
    
    if (fill_val < uint(1)) {
        discard;
    }

    lowp vec4 off_color = vec4(0., 0., 0., 1.);
    lowp vec4 on_color = vec4(1., 1., 1., 1.);

    uint mask = uint(1) << u_imem;
    lowp float mem_active = float((fill_val & mask) > uint(0));
    fragColor = mix(off_color, on_color, mem_active);
}