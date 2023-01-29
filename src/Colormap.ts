
interface ColorStop {
    level: number;
    color: string;
    opacity: number;
}

interface ColorbarInfo {
    label: string;
    ticks: number[];
}

interface _Colormap {
    colors: ColorStop[];
    colorbar: ColorbarInfo;
}

/** A class representing a color map */
class Colormap {
    readonly colormap: _Colormap;
    readonly length: number;

    /**
     * Create a color map
     * @param colormap - The specification for this colormap. (TAS: Yuck.)
     */
    constructor(colormap: _Colormap) {
        this.colormap = colormap
        this.length = colormap['colors'].length;
    }

    getMap() {
        return this.colormap['colors'];
    }

    getColorbarInfo() : ColorbarInfo {
        return this.colormap['colorbar'];
    }

    getLevels() : number [] {
        return this.getMap().map(s => s['level']);
    }

    getColors() : string[] {
        return this.getMap().map(s => s['color']);
    }

    getOpacities() : number[] {
        return this.getMap().map(s => s['opacity']);
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

    colormap.getMap().forEach((stop, istop) => {
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