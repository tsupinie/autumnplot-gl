#extension GL_OES_standard_derivatives : enable
varying highp vec2 v_tex_coord;
varying highp float v_map_scale_fac;

uniform sampler2D u_fill_sampler;
uniform highp float u_contour_interval;
uniform lowp float u_line_cutoff;
uniform lowp vec3 u_color;
uniform lowp vec2 u_step_size;
uniform lowp float u_zoom_fac;
uniform highp float u_grid_spacing;

void main() {
    highp float field_val = texture2D(u_fill_sampler, v_tex_coord).r;

    // Find the gradient magnitude of the grid (the y component divides by 2 to cheat for high latitudes)
    lowp vec2 ihat = vec2(u_step_size.x, 0.0);
    lowp vec2 jhat = vec2(0.0, u_step_size.y);
    highp float fv_xp1 = texture2D(u_fill_sampler, v_tex_coord + ihat).r;
    highp float fv_xm1 = texture2D(u_fill_sampler, v_tex_coord - ihat).r;
    highp float fv_yp1 = texture2D(u_fill_sampler, v_tex_coord + jhat).r;
    highp float fv_ym1 = texture2D(u_fill_sampler, v_tex_coord - jhat).r;
    highp float fwidth_field = sqrt((fv_xp1 - fv_xm1) * (fv_xp1 - fv_xm1) + (fv_yp1 - fv_ym1) * (fv_yp1 - fv_ym1) * v_map_scale_fac * v_map_scale_fac) 
                                / (2. * u_grid_spacing);

    //gl_FragColor = vec4(fwidth_field, fwidth_field, fwidth_field, 1.0);

    lowp float plot_val = fract(field_val / u_contour_interval);
    if (plot_val > 0.5) plot_val = 1.0 - plot_val;
    plot_val = plot_val / (max(0.001, fwidth_field / (u_zoom_fac * 0.125)));

    if (plot_val > u_line_cutoff) discard;

    gl_FragColor = vec4(u_color, 1. - (plot_val * plot_val / (u_line_cutoff * u_line_cutoff)));
}