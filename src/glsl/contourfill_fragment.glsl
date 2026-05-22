#version 300 es

in highp vec2 v_tex_coord;

uniform lowp vec2 u_pixel_size;

#ifdef MASK
uniform sampler2D u_mask_sampler;
#endif

uniform highp float u_opacity;

#ifdef MASK
uniform int u_mask_val;
#endif

out highp vec4 fragColor;

void main() {
    lowp vec2 pixel_sub = mod(v_tex_coord + 0.5 * u_pixel_size, u_pixel_size);
    lowp vec2 pixel_pos = v_tex_coord - pixel_sub;

    highp float fill_val = get_field_value(v_tex_coord);
    highp float fill_val_sw = get_field_value(pixel_pos);
    highp float fill_val_se = get_field_value(pixel_pos + vec2(u_pixel_size.x, 0.));
    highp float fill_val_ne = get_field_value(pixel_pos + u_pixel_size);
    highp float fill_val_nw = get_field_value(pixel_pos + vec2(0., u_pixel_size.y));

    int draw_mask = 1;

#ifdef MASK
    highp float mask_val = texture(u_mask_sampler, v_tex_coord).r;
    draw_mask = int(mask_val * 255.0) == u_mask_val ? 1 : 0;
#endif

    if (isnan(u_missing) && (isnan(fill_val_sw) || isnan(fill_val_se) || isnan(fill_val_ne) || isnan(fill_val_nw)) || 
        u_missing == fill_val_sw || u_missing == fill_val_se || u_missing == fill_val_ne || u_missing == fill_val_nw || 
        draw_mask == 0) {
        discard;
    }

    lowp vec4 color = apply_colormap(fill_val);
    color.a = color.a * u_opacity;
    fragColor = color;
}