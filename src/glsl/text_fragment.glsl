#version 300 es

in highp vec2 v_tex_coord;
uniform sampler2D u_sdf_sampler;
uniform int u_is_halo;

uniform lowp vec4 u_text_color;
uniform lowp vec4 u_halo_color;

#define SDF_FILL 0.75
#define SDF_HALO 0.45

out highp vec4 fragColor;

void main() {
    highp float sdf_val = texture(u_sdf_sampler, v_tex_coord).r;

    lowp float step_width = 0.08;
    lowp float alpha = smoothstep(SDF_FILL - step_width, SDF_FILL + step_width, sdf_val);

    lowp vec4 color = u_is_halo == 1 ? u_halo_color : u_text_color;

    if (u_is_halo == 1) {
        alpha = min(smoothstep(SDF_HALO - step_width, SDF_HALO + step_width, sdf_val), 1.0 - alpha);
    }

    color.a *= alpha;
    fragColor = color;
}