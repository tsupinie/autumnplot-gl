#version 300 es

in highp vec2 v_tex_coord;

#ifdef MASK
uniform sampler2D u_mask_sampler;
#endif

uniform highp float u_opacity;

#ifdef MASK
uniform int u_mask_val;
#endif

out highp vec4 fragColor;

void main() {
    highp float fill_val = get_field_value(v_tex_coord);

    int draw_mask = 1;

#ifdef MASK
    highp float mask_val = texture(u_mask_sampler, v_tex_coord).r;
    draw_mask = int(mask_val * 255.0) == u_mask_val ? 1 : 0;
#endif

    if (isnan(fill_val) && isnan(u_missing) || fill_val == u_missing || draw_mask == 0) {
        discard;
    }

    lowp vec4 color = apply_colormap(fill_val);
    color.a = color.a * u_opacity;
    fragColor = color;
}