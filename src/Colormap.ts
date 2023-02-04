import { hex2rgb, hsv2rgb, rgb2hex, rgb2hsv } from "./utils";

interface ColorStop {
    color: string;
    opacity: number;
}

/** A class representing a color map */
class Colormap {
    readonly levels: number[];
    readonly colormap: ColorStop[];

    /**
     * Create a color map
     * @param levels   - The list of levels
     * @param colormap - The specification for this colormap. (TAS: Yuck.)
     */
    constructor(levels: number[], colormap: ColorStop[]) {
        if (levels.length != colormap.length + 1) {
            throw `Mismatch between number of levels (${levels.length}) and number of colors (${colormap.length}; expected ${levels.length - 1})`;
        }

        this.levels = levels;
        this.colormap = colormap;
    }

    getColors() : string[] {
        return this.colormap.map(s => s['color']);
    }

    getOpacities() : number[] {
        return this.colormap.map(s => s['opacity']);
    }

    static diverging(color1: string, color2: string, level_min: number, level_max: number, n_colors: number) {
        const stops: ColorStop[] = [];
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

        return new Colormap(levels, stops);
    }

    static redblue(level_min: number, level_max: number, n_levels: number) {
        return Colormap.diverging('#ff0000', '#0000ff', level_min, level_max, n_levels);
    }

    static bluered(level_min: number, level_max: number, n_levels: number) {
        return Colormap.diverging('#0000ff', '#ff0000', level_min, level_max, n_levels);
    }
}

/**
 * Make a canvas image corresponding to a color map
 * @param colormap - The color map to use
 * @returns A canvas element containing each color of the color map
 */
function makeTextureImage(colormap: Colormap) {
    const cmap_image = document.createElement('canvas');
    cmap_image.width = colormap.colormap.length;
    cmap_image.height = 1;

    let ctx = cmap_image.getContext('2d');

    colormap.colormap.forEach((stop, istop) => {
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
interface ColorbarOptions {
    label?: string;
    ticks?: number[];
    tick_direction?: ColorbarTickDirection;
    orientation?: ColorbarOrientation;
    fontface?: string;
};

/**
 * Make a color bar SVG
 * @param colormap - The color map to use
 * @param opts     - The options for creating the colorbar
 */
function makeColorbar(colormap: Colormap, opts: ColorbarOptions) {
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

    const bar_long_size = 600;
    const bar_cross_size = bar_long_size / 9;
    const bar_long_pad = 11;
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

    const n_colors = colormap.colormap.length;

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

    colormap.colormap.forEach((color, icolor) => {
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

export {Colormap, makeColorbar, makeTextureImage}
export type {ColorbarOrientation, ColorbarTickDirection, ColorbarOptions};