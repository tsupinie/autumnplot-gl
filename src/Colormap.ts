import { hex2rgb, hsv2rgb, rgb2hex, rgb2hsv } from "./utils";

import spd500_colormap_data from "./json/pw500speed_colormap.json";
import spd850_colormap_data from "./json/pw850speed_colormap.json";
import cape_colormap_data from "./json/pwcape_colormap.json";
import t2m_colormap_data from "./json/pwt2m_colormap.json";
import td2m_colormap_data from "./json/pwtd2m_colormap.json";

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
    readonly levels: number[];
    readonly colors: Color[];

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
    getColors() : string[] {
        return this.colors.map(s => s['color']);
    }

    /**
     * @returns an array of opacities, one for each color in the color map
     */
    getOpacities() : number[] {
        return this.colors.map(s => s['opacity']);
    }

    /**
     * Make a new color map with different opacities. The opacities are set by func.
     * @param func - A function which takes the two levels associated with a color (an upper and lower bound) and returns an opacity in the range from 0 to 1.
     * @returns A new color map
     */
    withOpacity(func: (level_lower: number, level_upper: number) => number) {
        const new_colors = this.colors.map((c, ic) => { return {'color': c['color'], 'opacity': func(this.levels[ic], this.levels[ic + 1])}; });
        return new ColorMap(this.levels, new_colors);
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
    static diverging(color1: string, color2: string, level_min: number, level_max: number, n_colors: number) {
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

type ColorbarOrientation = 'horizontal' | 'vertical';
type ColorbarTickDirection = 'top' | 'bottom' | 'left' | 'right';
interface ColorBarOptions {
    /** The label to place along the color bar */
    label?: string;

    /** 
     * An array of numbers to use as the tick locations. 
     * @default Use all the levels in the color map provided to {@link makeColorBar}.
     */
    ticks?: number[];

    /** 
     * The direction the ticks should face. Valid values are 'left' and 'right' if orientation is 'vertical' and 'top' and 
     * 'bottom' if orientation is 'horizontal'.
     * @default 'left' if orientation is 'vertical' and 'bottom' if orientation is 'horizontal'
     */
    tick_direction?: ColorbarTickDirection;

    /** 
     * The orientation for the color bar. Valid values are 'horizontal' and 'vertical'.
     * @default 'vertical'
     */
    orientation?: ColorbarOrientation;

    /** 
     * A font face to use for the label and tick values.
     * @default 'sans-serif'
     */
    fontface?: string;
};

/**
 * Make an SVG containing a color bar. The color bar can either be oriented horizontal or vertical, and a label can be provided.
 * @param colormap - The color map to use
 * @param opts     - The options for creating the color bar
 * @returns An SVGElement containing the color bar image.
 * @example
 * // Create the color bar
 * const svg = makeColorBar(color_map, {label: 'Wind Speed (kts)', orientation: 'horizontal', 
 *                                      fontface: 'Trebuchet MS'});
 * 
 * // Add colorbar to the page
 * document.getElementById('colorbar-container').appendChild(svg);
 */
function makeColorBar(colormap: ColorMap, opts: ColorBarOptions) {
    const label = opts.label || "";
    const ticks = opts.ticks || colormap.levels;
    const orientation = opts.orientation || 'vertical';
    const fontface = opts.fontface || 'sans-serif';

    const tick_dir = opts.tick_direction || (orientation == 'vertical' ? 'left' : 'bottom');

    if (orientation == 'vertical' && (tick_dir == 'top' || tick_dir == 'bottom') ||
        orientation == 'horizontal' && (tick_dir == 'left' || tick_dir == 'right')) {
        throw `tick_direction of '${tick_dir} doesn't match an orientation of ${orientation}`;
    }

    const createElement = (tagname: string, attributes?: Record<string, string | number>, parent?: SVGElement) => {
        const elem = document.createElementNS('http://www.w3.org/2000/svg', tagname);

        if (attributes !== undefined) {
            Object.entries(attributes).forEach(([k, v]) => {
                elem.setAttribute(k, v.toString());
            });
        }

        if (parent !== undefined) {
            parent.appendChild(elem);
        }

        return elem;
    };

    const getNChar = (n: number) => {
        return Math.floor(Math.log10(Math.abs(n))) + (n < 0 ? 2 : 1);
    }

    const chars_left = getNChar(ticks[0]);
    const chars_right = getNChar(ticks[ticks.length - 1]);

    const bar_long_size = 600;
    const bar_cross_size = bar_long_size / 9;
    const bar_long_pad = orientation == 'horizontal' ? Math.max(chars_left, chars_right) * 4.5 : 5;
    const bar_cross_pad = 3;
    const bar_thickness = 10;

    let height: number, width: number, bar_left: number, bar_top: number, bar_width: number, bar_height: number;

    if (orientation == 'vertical') {
        height = bar_long_size;
        width = bar_cross_size;

        bar_left = tick_dir == 'left' ? bar_cross_size - bar_cross_pad - bar_thickness : bar_cross_pad;
        bar_top = bar_long_pad;
        bar_width = bar_thickness;
        bar_height = bar_long_size - 2 * bar_long_pad;
    }
    else {
        width = bar_long_size;
        height = bar_cross_size - 6;

        bar_left = bar_long_pad;
        bar_top = tick_dir == 'bottom' ? bar_cross_pad : bar_cross_size - 6 - bar_cross_pad - bar_thickness;
        bar_height = bar_thickness;
        bar_width = bar_long_size - 2 * bar_long_pad;
    }

    const n_colors = colormap.colors.length;

    const root = createElement('svg', {width: width, height: height});
    const gbar = createElement('g', {}, root);

    let gtickattrs;
    if (orientation == 'vertical') {
        gtickattrs = tick_dir == 'left' ? {'text-anchor': 'end', transform: `translate(${bar_left}, ${bar_top})`} : 
                                          {transform: `translate(${bar_left + bar_width}, ${bar_top})`}
    }
    else {
        gtickattrs = tick_dir == 'bottom' ? {'text-anchor': 'middle', transform: `translate(${bar_left}, ${bar_top + bar_height})`} : 
                                            {'text-anchor': 'middle', transform: `translate(${bar_left}, ${bar_top})`}
    }
    const gticks = createElement('g', gtickattrs, root);

    colormap.colors.forEach((color, icolor) => {
        let attrs: Record<string, string | number> = {};

        if (orientation == 'vertical') {
            attrs = {
                x: bar_left, y: bar_top + bar_height * (1 - (icolor + 1) / n_colors), width: bar_width, height: bar_height / n_colors};
        }
        else {
            attrs = {x: bar_left + bar_width * icolor / n_colors, y: bar_top, width: bar_width / n_colors, height: bar_height};
        }

        createElement('rect', {...attrs, fill: color.color, opacity: color.opacity}, gbar);
    });

    ticks.forEach(level => {
        const ilevel = colormap.levels.indexOf(level);
        const tickattrs = orientation == 'vertical' ? {transform: `translate(0, ${bar_height * (1 - ilevel / n_colors)})`} : 
                                                      {transform: `translate(${bar_width * ilevel / n_colors}, 0)`};
        const gtick = createElement('g', tickattrs, gticks);

        let lineattrs;
        if (orientation == 'vertical') {
            lineattrs = tick_dir == 'left' ? {x2: -6} : {x2: 6};
        }
        else {
            lineattrs = tick_dir == 'bottom' ? {y2 : 6} : {y2: -6};
        }

        createElement('line', {...lineattrs, stroke: '#000000', 'stroke-width': 1.5}, gtick);

        let textattrs;
        if (orientation == 'vertical') {
            textattrs = tick_dir == 'left' ? {x: -9, dy: '0.32em'} : {x: 9, dy: '0.32em'};
        }
        else {
            textattrs = tick_dir == 'bottom' ? {y: 9, dy: '0.8em'} : {y: -9, dy: '0em'};
        }

        const text = createElement('text', {...textattrs, fill: '#000000', style: `font-family: ${fontface};`}, gtick);
        text.textContent = level.toString();
    });

    const outline_attrs = {
        x: bar_left,
        y: bar_top,
        width: bar_width,
        height: bar_height,
        stroke: '#000000',
        'stroke-width': 1.5,
        fill: 'none'
    };
    createElement('rect', outline_attrs, root);

    let labelattrs;
    if (orientation == 'vertical') {
        labelattrs = tick_dir == 'left' ? {transform: `translate(15, ${height / 2}) rotate(-90)`} : {transform: `translate(${width - 6}, ${height / 2}) rotate(-90)`};
    }
    else {
        labelattrs = tick_dir == 'bottom' ? {transform: `translate(${width / 2}, ${height - 5})`} : {transform: `translate(${width / 2}, 15)`}
    }
    const label_elem = createElement('text', {...labelattrs, fill: '#000000', 'text-anchor': 'middle', style: `font-family: ${fontface};`}, root);
    label_elem.textContent = label;

    return root;
}

export {ColorMap, bluered, redblue, pw_speed500mb, pw_speed850mb, pw_cape, pw_t2m, pw_td2m, makeColorBar, makeTextureImage}
export type {Color, ColorbarOrientation, ColorbarTickDirection, ColorBarOptions};