import { hex2rgb, hsv2rgb, rgb2hex, rgb2hsv } from "./utils";

import spd500_colormap_data from "./json/pw500speed_colormap.json";
import spd850_colormap_data from "./json/pw850speed_colormap.json";
import cape_colormap_data from "./json/pwcape_colormap.json";
import t2m_colormap_data from "./json/pwt2m_colormap.json";
import td2m_colormap_data from "./json/pwtd2m_colormap.json";
import nws_storm_clear_refl_colormap_data from "./json/nws_storm_clear_refl_colormap.json";

interface Color {
    /** The color as a hex color string */
    color: string;

    /** The opacity as a number from 0 to 1 */
    opacity: number;
}

function isColor(obj: any): obj is Color {
    return (typeof obj == 'object') && 'color' in obj && 'opacity' in obj;
}

/** A mapping from values to colors */
class ColorMap {
    public readonly levels: number[];
    public readonly colors: Color[];

    /**
     * Create a color map
     * @param levels - The list of levels. The number of levels should always be one more than the number of colors.
     * @param colors - A list of colors
     */
    constructor(levels: number[], colors: Color[] | string[]) {
        if (levels.length != colors.length + 1) {
            throw `Mismatch between number of levels (${levels.length}) and number of colors (${colors.length}; expected ${levels.length - 1})`;
        }

        this.levels = levels;
        this.colors = colors.map(c => isColor(c) ? c : {'color': c, 'opacity': 1.});
    }

    /**
     * @returns an array of hex color strings
     */
    public getColors() : string[] {
        return this.colors.map(s => s['color']);
    }

    /**
     * @returns an array of opacities, one for each color in the color map
     */
    public getOpacities() : number[] {
        return this.colors.map(s => s['opacity']);
    }

    /**
     * Make a new color map with different opacities. The opacities are set by func.
     * @param func - A function which takes the two levels associated with a color (an upper and lower bound) and returns an opacity in the range from 0 to 1.
     * @returns A new color map
     */
    public withOpacity(func: (level_lower: number, level_upper: number) => number) {
        const new_colors: Color[] = [];
        const new_levels: number[] = [];

        for (let ic = 0 ; ic < this.colors.length ; ic++) {
            const color = this.colors[ic];
            const level_lower = this.levels[ic];
            const level_upper = this.levels[ic + 1];

            const new_color = {'color': color['color'], 'opacity': func(level_lower, level_upper)};
            if (new_color['opacity'] > 0) {
                if (new_levels[new_levels.length - 1] != level_lower)
                    new_levels.push(level_lower)
                new_levels.push(level_upper);
                new_colors.push(new_color);
            }
        }
        
        return new ColorMap(new_levels, new_colors);
    }

    /**
     * Create a diverging color map using two input colors
     * @param color1    - The color corresponding to the lowest value in the color map
     * @param color2    - The color corresponding to the highest value in the color map
     * @param level_min - The lowest value in the color map
     * @param level_max - The highest value in the color map
     * @param n_colors  - The number of colors to use
     * @returns a Colormap object
     */
    public static diverging(color1: string, color2: string, level_min: number, level_max: number, n_colors: number) {
        const stops: Color[] = [];
        const levels: number[] = [];

        const level_step = (level_max - level_min) / (n_colors - 1);
        const crossover = (level_max + level_min) / 2;
        const crossover_hsv: [number, number, number] = [0, 0, 0.9];

        const color1_hsv = rgb2hsv(hex2rgb(color1));
        const color2_hsv = rgb2hsv(hex2rgb(color2));

        for (let istop = 0; istop < n_colors; istop++) {
            const level = level_min + istop * level_step;
            let h, s, v;
            let interp_fac;
            if (level < crossover) {
                interp_fac = (crossover - level) / (crossover - level_min);

                [h, s, v] = [
                    color1_hsv[0], 
                    crossover_hsv[1] + (color1_hsv[1] - crossover_hsv[1]) * interp_fac,
                    crossover_hsv[2] + (color1_hsv[2] - crossover_hsv[2]) * interp_fac]
            }
            else if (level >= crossover) {
                interp_fac = (level - crossover) / (level_max - crossover);
                
                [h, s, v] = [
                    color2_hsv[0], 
                    crossover_hsv[1] + (color2_hsv[1] - crossover_hsv[1]) * interp_fac,
                    crossover_hsv[2] + (color2_hsv[2] - crossover_hsv[2]) * interp_fac]
            }
            const color = rgb2hex(hsv2rgb([h, s, v]));
            stops.push({'color': color, 'opacity': Math.min(2 * interp_fac, 1)});
        }

        for (let ilev = 0; ilev <= n_colors; ilev++) {
            const level_step = (level_max - level_min) / n_colors;
            levels.push(level_min + ilev * level_step);
        }

        return new ColorMap(levels, stops);
    }
}

// Some built-in colormaps
const pw_speed500mb = new ColorMap(spd500_colormap_data.levels, spd500_colormap_data.colors).withOpacity((levl, levu) => Math.min((levu - 20) / 10, 1.));
const pw_speed850mb = new ColorMap(spd850_colormap_data.levels, spd850_colormap_data.colors).withOpacity((levl, levu) => Math.min((levu - 20) / 10, 1.));
const pw_cape = new ColorMap(cape_colormap_data.levels, cape_colormap_data.colors).withOpacity((levl, levu) => Math.min(levu / 1000., 1.));
const pw_t2m = new ColorMap(t2m_colormap_data.levels, t2m_colormap_data.colors);
const pw_td2m = new ColorMap(td2m_colormap_data.levels, td2m_colormap_data.colors);
const nws_storm_clear_refl = new ColorMap(nws_storm_clear_refl_colormap_data.levels, nws_storm_clear_refl_colormap_data.colors);

/**
 * Create a diverging red/blue colormap, where red corresponds to the lowest value and blue corresponds to the highest value
 * @param level_min - The lowest value in the color map
 * @param level_max - The highest value in the color map
 * @param n_colors  - The number of colors
 * @returns a Colormap object
 */
const redblue = (level_min: number, level_max: number, n_colors: number) => {
    return ColorMap.diverging('#ff0000', '#0000ff', level_min, level_max, n_colors);
}

/**
 * Create a diverging blue/red colormap, where blue corresponds to the lowest value and red corresponds to the highest value
 * @param level_min - The lowest value in the color map
 * @param level_max - The highest value in the color map
 * @param n_colors  - The number of colors
 * @returns a Colormap object
 */
const bluered = (level_min: number, level_max: number, n_colors: number) => {
    return ColorMap.diverging('#0000ff', '#ff0000', level_min, level_max, n_colors);
}

/**
 * Make a canvas image corresponding to a color map
 * @param colormap - The color map to use
 * @returns A canvas element containing each color of the color map
 */
function makeTextureImage(colormap: ColorMap) {
    const cmap_image = document.createElement('canvas');
    cmap_image.width = colormap.colors.length;
    cmap_image.height = 1;

    let ctx = cmap_image.getContext('2d');

    colormap.colors.forEach((stop, istop) => {
        if (ctx === null) {
            throw "Could not get rendering context for colormap image canvas";
        }

        ctx.fillStyle = stop['color'] + Math.round(stop['opacity'] * 255).toString(16);
        ctx.fillRect(istop, 0, 1, 1);
    });

    return cmap_image;
}

export {ColorMap, bluered, redblue, pw_speed500mb, pw_speed850mb, pw_cape, pw_t2m, pw_td2m, nws_storm_clear_refl, makeTextureImage}
export type {Color};