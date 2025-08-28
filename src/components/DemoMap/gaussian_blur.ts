import { Grid } from "autumnplot-gl";

export function guassian_blur<GridType extends Grid>(grid: GridType, ary: Float32Array, sigma: number) {
    function gauss(mean: number, std: number) {
        const scale = 1 / (std * Math.sqrt(2 * Math.PI));
        const exp_scale = 1 / (2 * std * std);
        return (x: number) => {
            return Math.exp(-(x - mean) * (x - mean) * exp_scale) * scale;
        }
    }

    const cutoff_sigma = 3;

    const n_gauss_point_half = sigma * cutoff_sigma
    const n_gauss_points = n_gauss_point_half * 2 + 1;
    const gauss_coeffs = new Float32Array(n_gauss_points);

    const dist = gauss(sigma * cutoff_sigma, sigma);

    for (let i = 0; i < n_gauss_points; i++) {
        gauss_coeffs[i] = dist(i);
    }

    const buffer_a = new Float32Array(grid.ni * grid.nj);
    const buffer_b = new Float32Array(grid.ni * grid.nj);
    let input_buffer: Float32Array, output_buffer: Float32Array;

    input_buffer = ary;
    output_buffer = buffer_a;

    for (let idx = 0; idx < grid.ni * grid.nj; idx++) {
        output_buffer[idx] = 0;

        const i = idx % grid.ni;

        for (let icoeff = 0; icoeff < n_gauss_points; icoeff++) {
            if (i + icoeff - n_gauss_point_half >= 0 && i + icoeff - n_gauss_point_half < grid.ni) {
                output_buffer[idx] += input_buffer[idx + icoeff - n_gauss_point_half] * gauss_coeffs[icoeff];
            }
        }
    }

    input_buffer = buffer_a;
    output_buffer = buffer_b;

    for (let idx = 0; idx < grid.ni * grid.nj; idx++) {
        output_buffer[idx] = 0;

        const j = Math.floor(idx / grid.ni);

        for (let icoeff = 0; icoeff < n_gauss_points; icoeff++) {
            if (j + icoeff - n_gauss_point_half >= 0 && j + icoeff - n_gauss_point_half < grid.nj) {
                output_buffer[idx] += input_buffer[idx + (icoeff - n_gauss_point_half) * grid.ni] * gauss_coeffs[icoeff];
            }
        }
    }

    return output_buffer;
}
