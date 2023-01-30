import { hex2rgb, hsv2rgb, rgb2hex, rgb2hsv } from "./utils";

interface ColorStop {
    level: number;
    color: string;
    opacity: number;
}

/** A class representing a color map */
class Colormap {
    readonly colormap: ColorStop[];
    readonly length: number;

    /**
     * Create a color map
     * @param colormap - The specification for this colormap. (TAS: Yuck.)
     */
    constructor(colormap: ColorStop[]) {
        this.colormap = colormap
        this.length = colormap.length;
    }

    getLevels() : number [] {
        return this.colormap.map(s => s['level']);
    }

    getColors() : string[] {
        return this.colormap.map(s => s['color']);
    }

    getOpacities() : number[] {
        return this.colormap.map(s => s['opacity']);
    }

    static diverging(color1: string, color2: string, level_min: number, level_max: number, n_levels: number) {
        const stops: ColorStop[] = [];
        const level_step = (level_max - level_min) / (n_levels - 1);
        const crossover = (level_max + level_min) / 2;
        const crossover_hsv: [number, number, number] = [0, 0, 0.9];

        const color1_hsv = rgb2hsv(hex2rgb(color1));
        const color2_hsv = rgb2hsv(hex2rgb(color2));

        for (let istop = 0; istop < n_levels; istop++) {
            const level = level_min + istop * level_step;
            let h, s, v;
            if (level < crossover) {
                const interp_fac = (crossover - level) / (crossover - level_min);

                [h, s, v] = [
                    color1_hsv[0], 
                    crossover_hsv[1] + (color1_hsv[1] - crossover_hsv[1]) * interp_fac,
                    crossover_hsv[2] + (color1_hsv[2] - crossover_hsv[2]) * interp_fac]
            }
            else if (level >= crossover) {
                const interp_fac = (level - crossover) / (level_max - crossover);
                
                [h, s, v] = [
                    color2_hsv[0], 
                    crossover_hsv[1] + (color2_hsv[1] - crossover_hsv[1]) * interp_fac,
                    crossover_hsv[2] + (color2_hsv[2] - crossover_hsv[2]) * interp_fac]
            }
            const color = rgb2hex(hsv2rgb([h, s, v]));
            stops.push({'level': level, 'color': color, 'opacity': 1});
        }

        return new Colormap(stops);
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

/**
 * Make a color bar SVG
 * @param colormap    - The color map to use
 * @param label       - What to use as the label on the color bar
 * @param ticks       - Where to place the ticks along the color bar; defaults to use all levels from the color map
 * @param orientation - The orientation of the color bar ('horizontal' or 'vertical'); defaults to 'vertical'
 */
function makeColorbar(colormap: Colormap, label: string, ticks?: number[], orientation?: ColorbarOrientation) {
    ticks === undefined ? colormap.getLevels() : ticks;
    orientation = orientation === undefined ? 'vertical' : orientation;
}

export {Colormap, makeColorbar, makeTextureImage}
export type {ColorbarOrientation};