#extension GL_OES_standard_derivatives : enable
#define MAX_N_CONTOURS 40

varying highp vec2 v_tex_coord;
varying highp float v_grid_cell_size;
varying highp float v_map_scale_fac;

uniform sampler2D u_fill_sampler;
uniform highp float u_contour_interval;
uniform highp float u_contour_levels[MAX_N_CONTOURS];
uniform int u_num_contours;
uniform lowp float u_line_cutoff;
uniform lowp vec3 u_color;
uniform lowp vec2 u_step_size;
uniform lowp float u_zoom_fac;

void main() {
    highp float field_val = texture2D(u_fill_sampler, v_tex_coord).r;

    // Find the gradient magnitude of the grid (the y component divides by 2 to cheat for high latitudes)
    lowp vec2 ihat = vec2(u_step_size.x, 0.0);
    lowp vec2 jhat = vec2(0.0, u_step_size.y);
    highp float fv_xp1 = texture2D(u_fill_sampler, v_tex_coord + ihat).r;
    highp float fv_xm1 = texture2D(u_fill_sampler, v_tex_coord - ihat).r;
    highp float fv_yp1 = texture2D(u_fill_sampler, v_tex_coord + jhat).r;
    highp float fv_ym1 = texture2D(u_fill_sampler, v_tex_coord - jhat).r;
    highp float fwidth_field = sqrt(((fv_xp1 - fv_xm1) * (fv_xp1 - fv_xm1) + (fv_yp1 - fv_ym1) * (fv_yp1 - fv_ym1)) / (5e5 * v_grid_cell_size));

    //gl_FragColor = vec4(fwidth_field, fwidth_field, fwidth_field, 1.0);
    lowp float plot_val;

    if (u_num_contours > 0) {
        highp float min_contour_diff = u_contour_levels[1] - u_contour_levels[0];
        bool assigned_contour = false;
        highp float low_contour;
        highp float high_contour;
        highp float highest_contour;

        for (int ncnt = 0; ncnt < MAX_N_CONTOURS; ncnt++) {
            if (ncnt > u_num_contours) { break; }

            min_contour_diff = min(min_contour_diff, u_contour_levels[ncnt + 1] - u_contour_levels[ncnt]);

            if (u_contour_levels[ncnt] < field_val && field_val < u_contour_levels[ncnt + 1]) {
                assigned_contour = true;

                low_contour = u_contour_levels[ncnt];
                high_contour = u_contour_levels[ncnt + 1];
            }

            highest_contour = u_contour_levels[ncnt];
        }

        if (!assigned_contour) {
            if (field_val < u_contour_levels[0]) {
                plot_val = (u_contour_levels[0] - field_val) / min_contour_diff;
            }
            else if (field_val > highest_contour) {
                plot_val = (field_val - highest_contour) / min_contour_diff;
            }
        }
        else {
            plot_val = min(field_val - low_contour, high_contour - field_val) / min_contour_diff;
        }
    }
    else {
        plot_val = fract(field_val / u_contour_interval);
        if (plot_val > 0.5) plot_val = 1.0 - plot_val;
    }

    plot_val = plot_val / (max(0.001, fwidth_field / (u_zoom_fac * 0.125)));

    if (plot_val > u_line_cutoff) discard;

    gl_FragColor = vec4(u_color, 1. - (plot_val * plot_val / (u_line_cutoff * u_line_cutoff)));
}