uniform mat4 u_matrix;

attribute vec2 a_pos;
attribute float a_grid_cell_size;
attribute vec2 a_tex_coord;

varying highp vec2 v_tex_coord;
varying highp float v_grid_cell_size;
varying highp float v_map_scale_fac;

void main() {
    gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);
    v_tex_coord = a_tex_coord;
    v_grid_cell_size = a_grid_cell_size;

    // Figure out the latitude from the position vector
    highp float lat = 2. * atan(exp(a_pos.y / 6371229.0)) - 3.1414592654 / 2.;
    v_map_scale_fac = cos(lat);
}