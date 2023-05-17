
import { ColorMap } from "./Colormap";
import ContourFill from "./ContourFill";
import { RawScalarField } from "./RawField";

interface PaintballOptions {
    color?: string;
    threshold?: number;
    opacity?: number;
}

class Paintball extends ContourFill {
    constructor(field: RawScalarField, opts?: PaintballOptions) {
        opts = opts !== undefined ? opts : {};
        const color = opts.color !== undefined ? opts.color : '#000000';
        const threshold = opts.threshold !== undefined ? opts.threshold : 1;
        const opacity = opts.opacity !== undefined ? opts.opacity : 1;

        const cmap = new ColorMap([threshold, 1e20], [color]);

        super(field, {cmap: cmap, opacity: opacity});
    }
}

export default Paintball;
export type {PaintballOptions};