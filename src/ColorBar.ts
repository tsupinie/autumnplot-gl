
import { Color, ColorMap } from "./Colormap";

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

    /**
     * The font size (in points) to use for the tick labels
     * @default 12
     */
    ticklabelsize?: number;
};

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
    const tickfontsize = opts.ticklabelsize || 12;

    const tick_dir = opts.tick_direction || (orientation == 'vertical' ? 'left' : 'bottom');

    if (orientation == 'vertical' && (tick_dir == 'top' || tick_dir == 'bottom') ||
        orientation == 'horizontal' && (tick_dir == 'left' || tick_dir == 'right')) {
        throw `tick_direction of '${tick_dir} doesn't match an orientation of ${orientation}`;
    }

    const getNChar = (n: number) => {
        return n.toString().length;
    }

    const chars_left = getNChar(ticks[0]);
    const chars_right = getNChar(ticks[ticks.length - 1]);

    const bar_long_size = 600;
    const bar_cross_size = bar_long_size / 9;
    const bar_long_pad = orientation == 'horizontal' ? Math.max(chars_left, chars_right) * 6 : 8;
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

    const first_level = colormap.levels[0];
    const last_level = colormap.levels[colormap.levels.length - 1];

    ticks.filter(level => first_level <= level && level <= last_level).forEach(level => {
        const diffs = colormap.levels.map(l => Math.abs(l - level));
        let ilevel = diffs.indexOf(diffs.reduce((a, b) => Math.min(a, b)));
        if (level <= colormap.levels[ilevel] && ilevel > 0)
            ilevel -= 1;
        ilevel += (level - colormap.levels[ilevel]) / (colormap.levels[ilevel + 1] - colormap.levels[ilevel]);
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

        const text = createElement('text', {...textattrs, fill: '#000000', style: `font-family: ${fontface}; font-size: ${tickfontsize}pt`}, gtick);
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

interface PaintballKeyOptions {
    /**
     * The number of columns of entries in the key
     * @default 1
     */
    n_cols?: number;

    /** 
     * A font face to use for the label and tick values.
     * @default 'sans-serif'
     */
    fontface?: string;
}

/**
 * Make an SVG containing a color key for a paintball plot. The key can be split over any number of columns.
 * @param colors - A list of colors 
 * @param labels - The labels corresponding to each color
 * @param opts   - The options for creating the color key
 * @returns An SVGElement containing the color bar image.
 * @example
 * // Create the color key
 * const svg = makePaintballKey(colors, labels, {n_cols: 2, fontface: 'Trebuchet MS'});
 * 
 * // Add the color key to the page
 * document.getElementById('pb-key-container').appendChild(svg);
 */
function makePaintballKey(colors: (Color | string)[], labels: string[], opts?: PaintballKeyOptions) {
    if (colors.length != labels.length) {
        throw `Mismatch between the number of colors (${colors.length}) and the number of labels (${labels.length})`;
    }

    opts = opts === undefined ? {} : opts;
    const n_cols = opts.n_cols === undefined ? 1: opts.n_cols;
    const fontface = opts.fontface === undefined ? 'sans-serif' : opts.fontface;

    let height: number, width: number;

    const swatch_width = 20;
    const swatch_height = 20;
    const swatch_text_pad = 3;
    const swatch_text_space = 100;
    const swatch_width_pad = 5;
    const swatch_height_pad = 5;

    const n_rows = Math.ceil(colors.length / n_cols);

    width = (swatch_width + swatch_text_pad + swatch_text_space) * n_cols + swatch_width_pad * (n_cols + 1);
    height = swatch_height * n_rows + swatch_height_pad * (n_rows + 1);

    const root = createElement('svg', {width: width, height: height});
    const gbar = createElement('g', {}, root);

    colors.forEach((color, icolor) => {
        const label = labels[icolor];

        const irow = icolor % n_rows;
        const icol = Math.floor(icolor / n_rows);

        let opacity = 1.;
        if (typeof color != 'string') {
            opacity = color.opacity;
            color = color.color;
        }

        const x = swatch_width_pad + icol * (swatch_width + swatch_text_pad + swatch_text_space + swatch_width_pad);
        const y = swatch_height_pad + irow * (swatch_height + swatch_height_pad);

        createElement('rect', {x: x, y: y, fill: color, opacity: opacity, width: swatch_width, height: swatch_height}, gbar);

        let textattrs = {x: x + swatch_width + swatch_text_pad, y: y + swatch_height / 2, dy: '0.32em'};

        const text = createElement('text', {...textattrs, fill: '#000000', style: `font-size: 0.8em; font-family: ${fontface};`}, gbar);
        text.textContent = label;
    })

    return root;
}

export {makeColorBar, makePaintballKey};
export type {ColorbarOrientation, ColorbarTickDirection, ColorBarOptions, PaintballKeyOptions};