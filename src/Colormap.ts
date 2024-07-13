
import spd500_colormap_data from "./json/pw500speed_colormap.json";
import spd850_colormap_data from "./json/pw850speed_colormap.json";
import cape_colormap_data from "./json/pwcape_colormap.json";
import t2m_colormap_data from "./json/pwt2m_colormap.json";
import td2m_colormap_data from "./json/pwtd2m_colormap.json";
import nws_storm_clear_refl_colormap_data from "./json/nws_storm_clear_refl_colormap.json";
import { Float16Array } from "@petamoriken/float16";
import { WGLProgram, WGLTexture } from "autumn-wgl";
import { WebGLAnyRenderingContext } from "./AutumnTypes";
import { getGLFormatTypeAlignment } from "./PlotComponent";
import { Color } from "./Color";

const colormap_shader_src = require('./glsl/colormap.glsl');

interface ColorMapOptions {
    /** The color to use for areas where the value is above the highest value in the color map */
    overflow_color?: Color | string;

    /** The color to use for areas where the value is below the lowest value in the color map */
    underflow_color?: Color | string;
}

/** A mapping from values to colors */
class ColorMap {
    public readonly levels: number[];
    public readonly colors: Color[];
    public readonly overflow_color: Color | null;
    public readonly underflow_color: Color | null;

    /**
     * Create a color map
     * @param levels - The list of levels. The number of levels should always be one more than the number of colors.
     * @param colors - A list of colors
     * @param opts   - Options for the color map
     */
    constructor(levels: number[], colors: Color[] | string[], opts?: ColorMapOptions) {
        if (levels.length != colors.length + 1) {
            throw `Mismatch between number of levels (${levels.length}) and number of colors (${colors.length}; expected ${levels.length - 1})`;
        }

        const normalizeColor = (c: Color | string) => c instanceof Color ? c : Color.fromHex(c);

        this.levels = levels;
        this.colors = colors.map(c => normalizeColor(c));

        opts = opts === undefined ? {} : opts;
        this.overflow_color = opts.overflow_color === undefined ? null : normalizeColor(opts.overflow_color);
        this.underflow_color = opts.underflow_color === undefined ? null : normalizeColor(opts.underflow_color);
    }

    /**
     * @returns an array of hex color strings
     */
    public getColors() : string[] {
        return this.colors.map(s => s.toRGBHex());
    }

    /**
     * @returns an array of opacities, one for each color in the color map
     */
    public getOpacities() : number[] {
        return this.colors.map(s => s.a);
    }

    /**
     * Make a new color map with different opacities. The opacities are set by func.
     * @param func - A function which takes the two levels associated with a color (an upper and lower bound) and returns an opacity in the range from 0 to 1.
     * @returns A new color map
     */
    public withOpacity(func: (level_lower: number, level_upper: number) => number) {
        const new_colors: Color[] = [];
        const new_levels: number[] = [];
        const opts: ColorMapOptions = {};

        for (let ic = 0 ; ic < this.colors.length ; ic++) {
            const color = this.colors[ic];
            const level_lower = this.levels[ic];
            const level_upper = this.levels[ic + 1];

            const new_opacity = func(level_lower, level_upper)
            const new_color = color.withOpacity(new_opacity);
            if (new_opacity > 0) {
                if (new_levels[new_levels.length - 1] != level_lower)
                    new_levels.push(level_lower)
                new_levels.push(level_upper);
                new_colors.push(new_color);
            }
        }

        if (this.underflow_color !== null) {
            const underflow_opacity = func(this.levels[0], this.levels[0]);
            if (underflow_opacity > 0) {
                opts.underflow_color = this.underflow_color.withOpacity(underflow_opacity);
            }
        }

        if (this.overflow_color !== null) {
            const overflow_opacity = func(this.levels[this.levels.length - 1], this.levels[this.levels.length - 1]);
            if (overflow_opacity > 0) {
                opts.overflow_color = this.overflow_color.withOpacity(overflow_opacity);
            }
        }
        
        return new ColorMap(new_levels, new_colors, opts);
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

        const color1_hsv = Color.fromHex(color1).toHSVTuple();
        const color2_hsv = Color.fromHex(color2).toHSVTuple();
        const interp_fac_power = 1.5;

        for (let istop = 0; istop < n_colors; istop++) {
            const level = level_min + istop * level_step;
            let h, s, v;
            let interp_fac;
            if (level < crossover) {
                interp_fac = Math.pow((crossover - level) / (crossover - level_min), interp_fac_power);

                [h, s, v] = [
                    color1_hsv[0], 
                    crossover_hsv[1] + (color1_hsv[1] - crossover_hsv[1]) * interp_fac,
                    crossover_hsv[2] + (color1_hsv[2] - crossover_hsv[2]) * interp_fac]
            }
            else {
                interp_fac = Math.pow((level - crossover) / (level_max - crossover), interp_fac_power);
                
                [h, s, v] = [
                    color2_hsv[0], 
                    crossover_hsv[1] + (color2_hsv[1] - crossover_hsv[1]) * interp_fac,
                    crossover_hsv[2] + (color2_hsv[2] - crossover_hsv[2]) * interp_fac]
            }

            stops.push(Color.fromHSVTuple([h, s, v]).withOpacity(Math.min(2 * interp_fac, 1)));
        }

        for (let ilev = 0; ilev <= n_colors; ilev++) {
            const level_step = (level_max - level_min) / n_colors;
            levels.push(level_min + ilev * level_step);
        }

        return new ColorMap(levels, stops);
    }
}

function buildColormap(cm_data: {levels: number[], colors: string[]}, overflow: 'under' | 'over' | 'both' | 'neither') {
    const n_colors = cm_data.colors.length;
    const opts: ColorMapOptions = {};

    if (overflow == 'over' || overflow == 'both') {
        opts.overflow_color = cm_data.colors[n_colors - 1];
    }
    if (overflow == 'under' || overflow == 'both') {
        opts.underflow_color = cm_data.colors[0];
    }

    return new ColorMap(cm_data.levels, cm_data.colors, opts);
}

// Some built-in colormaps
const pw_speed500mb = buildColormap(spd500_colormap_data, 'over').withOpacity((levl, levu) => Math.min((levu - 20) / 10, 1.));
const pw_speed850mb = buildColormap(spd850_colormap_data, 'over').withOpacity((levl, levu) => Math.min((levu - 20) / 10, 1.));
const pw_cape = buildColormap(cape_colormap_data, 'over').withOpacity((levl, levu) => Math.min(levu / 1000., 1.));
const pw_t2m = buildColormap(t2m_colormap_data, 'both');
const pw_td2m = buildColormap(td2m_colormap_data, 'both');
const nws_storm_clear_refl = buildColormap(nws_storm_clear_refl_colormap_data, 'over');

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


interface ColorMapGLElems {
    cmap_texture: WGLTexture;
    cmap_nonlin_texture: WGLTexture;
}

const N_INDEX_MAP = 101;

class ColorMapGPUInterface {
    public readonly colormap: ColorMap;
    public gl_elems: ColorMapGLElems | null;

    constructor(colormap: ColorMap) {
        this.colormap = colormap;
        this.gl_elems = null;
    }

    public static applyShader(shader_src: string) {
        return colormap_shader_src + "\n" + shader_src;
    }

    public setupShaderVariables(gl: WebGLAnyRenderingContext, mag_filter: number) {
        const index_map = makeIndexMap(this.colormap);
        const cmap_image = makeTextureImage(this.colormap);

        const {format: format_nonlin, type: type_nonlin, row_alignment: row_alignment_nonlin} = getGLFormatTypeAlignment(gl, true);

        const cmap_image_spec = {'format': gl.RGBA, 'type': gl.UNSIGNED_BYTE, 'image': cmap_image, 'mag_filter': mag_filter};
        const cmap_texture = new WGLTexture(gl, cmap_image_spec);

        const cmap_nonlin_image = {'format': format_nonlin, 'type': type_nonlin, 
            'width': index_map.length, 'height': 1,
            'image': new Uint16Array(index_map.buffer), 
            'mag_filter': gl.LINEAR, 'row_alignment': row_alignment_nonlin,
        };

        const cmap_nonlin_texture = new WGLTexture(gl, cmap_nonlin_image);
        this.gl_elems = {cmap_texture: cmap_texture, cmap_nonlin_texture: cmap_nonlin_texture};
    }

    public bindShaderVariables(program: WGLProgram) {
        if (this.gl_elems === null) return;

        const cmap = this.colormap;
        const underflow_color = cmap.underflow_color === null ? [0, 0, 0, 0] : cmap.underflow_color.toRGBATuple();
        const overflow_color = cmap.overflow_color === null ? [0, 0, 0, 0] : cmap.overflow_color.toRGBATuple();

        program.setUniforms({'u_cmap_min': cmap.levels[0], 'u_cmap_max': cmap.levels[cmap.levels.length - 1],
                             'u_n_index': N_INDEX_MAP, 'u_underflow_color': underflow_color, 'u_overflow_color': overflow_color});
        program.bindTextures({'u_cmap_sampler': this.gl_elems.cmap_texture, 'u_cmap_nonlin_sampler': this.gl_elems.cmap_nonlin_texture});
    }
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

        ctx.fillStyle = stop.toRGBAHex();
        ctx.fillRect(istop, 0, 1, 1);
    });

    return cmap_image;
}

function makeIndexMap(colormap: ColorMap) {
    // Build a texture to account for nonlinear colormaps (basically inverts the relationship between
    //  the normalized index and the normalized level)
    const n_nonlin = N_INDEX_MAP;
    const map_norm = [];
    for (let i = 0; i < n_nonlin; i++) {
        map_norm.push(i / (n_nonlin - 1));
    }

    const levels = colormap.levels;
    const n_lev = levels.length - 1;

    const input_norm = levels.map((lev, ilev) => ilev / n_lev);
    const cmap_norm = levels.map(lev => (lev - levels[0]) / (levels[n_lev] - levels[0]));
    const inv_cmap_norm = map_norm.map(lev => {
        let jlev;
        for (jlev = 0; !(cmap_norm[jlev] <= lev && lev <= cmap_norm[jlev + 1]); jlev++) {}

        const alpha = (lev - cmap_norm[jlev]) / (cmap_norm[jlev + 1] - cmap_norm[jlev]);
        return input_norm[jlev] * (1 - alpha) + input_norm[jlev + 1] * alpha;
    });

    return new Float16Array(inv_cmap_norm);
}

export {ColorMap, ColorMapGPUInterface, bluered, redblue, pw_speed500mb, pw_speed850mb, pw_cape, pw_t2m, pw_td2m, nws_storm_clear_refl}
export type {ColorMapOptions};