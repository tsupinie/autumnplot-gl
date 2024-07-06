
import { PlotComponent } from "./PlotComponent";
import { BillboardCollection } from './BillboardCollection';
import { normalizeOptions } from './utils';
import { RawVectorField } from "./RawField";
import { MapLikeType } from "./Map";
import { TypedArray, WebGLAnyRenderingContext } from "./AutumnTypes";
import { Color } from "./Color";
import { ColorMap } from "./Colormap";

const BARB_DIMS = {
    BB_WIDTH: 85,
    BB_HEIGHT: 256,
    BB_TEX_WIDTH: 1024,
    BB_TEX_HEIGHT: 1024,
    BB_MAG_MAX: 235,
    BB_MAG_WRAP: 60,
    BB_MAG_BIN_SIZE: 5,
}

function _createBarbTexture() : HTMLCanvasElement {
    let canvas = document.createElement('canvas');

    canvas.width = BARB_DIMS.BB_TEX_WIDTH;
    canvas.height = BARB_DIMS.BB_TEX_HEIGHT;
    
    function drawWindBarb(ctx: CanvasRenderingContext2D, tipx: number, tipy: number, mag: number) : void {
        const elem_full_size = BARB_DIMS.BB_WIDTH / 2 - 4;
        const elem_spacing = elem_full_size / 2;
        
        if (mag < 2.5) {
            ctx.beginPath();
            ctx.arc(tipx, tipy, elem_full_size / 2, 0, 2 * Math.PI);
            ctx.stroke();
        }
        else {
            let elem_pos = 0;
            let mag_countdown = mag;

            let staff_length = 0;
            const n_flags = Math.floor((mag_countdown + 2.5) / 50)
            staff_length += n_flags * elem_full_size / 2 + elem_spacing 
                                   + (n_flags - 1) * elem_spacing / 2;
            mag_countdown -= n_flags * 50;
            const n_full_barbs = Math.floor((mag_countdown + 2.5) / 10)
            staff_length += n_full_barbs * elem_spacing;
            mag_countdown -= n_full_barbs * 10;
            const n_half_barbs = Math.floor((mag_countdown + 2.5) / 5);
            staff_length += n_half_barbs * elem_spacing;
            
            if (mag < 7.5) {
                staff_length += elem_spacing;
            }
            
            staff_length = Math.max(120, staff_length);
            
            // staff
            ctx.beginPath();
            ctx.moveTo(tipx, tipy);
            ctx.lineTo(tipx, tipy + staff_length);

            mag_countdown = mag;

            elem_pos = tipy + staff_length;
            let last_was_flag = false;
            let first_elem = true;
        
            while (mag_countdown > 47.5) {
                if (last_was_flag) elem_pos += elem_spacing / 2;
                // flag
                if (!first_elem) {
                    ctx.moveTo(tipx, elem_pos);
                }
                ctx.lineTo(tipx - elem_full_size, elem_pos);
                ctx.lineTo(tipx, elem_pos - elem_full_size / 2)

                elem_pos -= elem_full_size / 2 + elem_spacing;
                mag_countdown -= 50;
                last_was_flag = true;
                first_elem = false;
            }
        
            while (mag_countdown > 7.5) {
                // full barb
                if (!first_elem) {
                    ctx.moveTo(tipx, elem_pos);
                }
                ctx.lineTo(tipx - elem_full_size, elem_pos + elem_full_size / 2);
            
                elem_pos -= elem_spacing;
                mag_countdown -= 10;
                first_elem = false;
            }
            
            if (mag < 7.5) {
                elem_pos -= elem_spacing;
            }
        
            while (mag_countdown > 2.5) {
                // half barb
                ctx.moveTo(tipx, elem_pos);
                ctx.lineTo(tipx - elem_full_size / 2, elem_pos + elem_full_size / 4);
                mag_countdown -= 5;
            }

            ctx.stroke();
        }
    }
    
    let ctx = canvas.getContext('2d');
    if (ctx === null) {
        throw "Could not get rendering context for the wind barb canvas";
    }

    ctx.lineWidth = 8;
    ctx.miterLimit = 4;
    
    for (let ibarb = 0; ibarb <= BARB_DIMS.BB_MAG_MAX; ibarb += BARB_DIMS.BB_MAG_BIN_SIZE) {
        const x_pos = (ibarb % BARB_DIMS.BB_MAG_WRAP) / BARB_DIMS.BB_MAG_BIN_SIZE * BARB_DIMS.BB_WIDTH + BARB_DIMS.BB_WIDTH / 2;
        const y_pos = Math.floor(ibarb / BARB_DIMS.BB_MAG_WRAP) * BARB_DIMS.BB_HEIGHT + BARB_DIMS.BB_WIDTH / 2;
        drawWindBarb(ctx, x_pos, y_pos, ibarb);
    }

    return canvas;
}

let BARB_TEXTURE: HTMLCanvasElement | null = null;

interface BarbsOptions {
    /** 
     * The color to use for the barbs as a hex color string;.
     * @default '#000000'
     */
    color?: string;

    cmap?: ColorMap | null;

    /** 
     * How much to thin the barbs at zoom level 1 on the map. This effectively means to plot every `n`th barb in the i and j directions, where `n` = 
     * `thin_fac`. `thin_fac` should be a power of 2. 
     * @default 1
     */
    thin_fac?: number;
}

const barb_opt_defaults: Required<BarbsOptions> = {
    color: '#000000',
    cmap: null,
    thin_fac: 1
}

interface BarbsGLElems<ArrayType extends TypedArray, MapType extends MapLikeType> {
    map: MapType;
    barb_billboards: BillboardCollection<ArrayType>;
}

/** 
 * A class representing a field of wind barbs. The barbs are automatically thinned based on the zoom level on the map; the user only has to provide a
 * thinning factor at zoom level 1.
 * @example
 * // Create a barb field with black barbs and plotting every 16th wind barb in both i and j at zoom level 1
 * const vector_field = new RawVectorField(grid, u_data, v_data);
 * const barbs = new Barbs(vector_field, {color: '#000000', thin_fac: 16});
 */
class Barbs<ArrayType extends TypedArray, MapType extends MapLikeType> extends PlotComponent<MapType> {
    /** The vector field */
    private fields: RawVectorField<ArrayType>;
    public readonly opts: Required<BarbsOptions>;
    private readonly color: Color;

    private gl_elems: BarbsGLElems<ArrayType, MapType> | null;

    /**
     * Create a field of wind barbs
     * @param fields - The vector field to plot as barbs
     * @param opts   - Options for creating the wind barbs
     */
    constructor(fields: RawVectorField<ArrayType>, opts: BarbsOptions) {
        super();

        this.fields = fields;

        this.opts = normalizeOptions(opts, barb_opt_defaults);
        this.color = Color.fromHex(this.opts.color);

        this.gl_elems = null;
    }

    /**
     * Update the field displayed as barbs
     * @param fields - The new field to display as barbs
     */
    public async updateField(fields: RawVectorField<ArrayType>) {
        this.fields = fields;
        if (this.gl_elems === null) return;
        this.gl_elems.barb_billboards.updateField(fields);
        this.gl_elems.map.triggerRepaint();
    }

    /**
     * @internal 
     * Add the barb field to a map
     */
    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        gl.getExtension('OES_texture_float');
        gl.getExtension('OES_texture_float_linear');
        
        const map_max_zoom = map.getMaxZoom();

        if (BARB_TEXTURE === null) {
            BARB_TEXTURE = _createBarbTexture();
        }

        const barb_image = {format: gl.RGBA, type: gl.UNSIGNED_BYTE, image: BARB_TEXTURE, mag_filter: gl.NEAREST};

        const cmap = this.opts.cmap === null ? undefined : this.opts.cmap;
        const barb_billboards = new BillboardCollection(this.fields, this.opts.thin_fac, map_max_zoom, barb_image, 
            BARB_DIMS, 0.1, {color: this.color, cmap: cmap});
        await barb_billboards.setup(gl);

        this.gl_elems = {
            map: map, barb_billboards: barb_billboards
        }

        this.updateField(this.fields);
    }

    /**
     * @internal 
     * Render the barb field
     */
    public render(gl: WebGLAnyRenderingContext, matrix: number[] | Float32Array) {
        if (this.gl_elems === null) return;
        const gl_elems = this.gl_elems

        const zoom = gl_elems.map.getZoom();
        const map_width = gl_elems.map.getCanvas().width;
        const map_height = gl_elems.map.getCanvas().height;
        const bearing = gl_elems.map.getBearing();
        const pitch = gl_elems.map.getPitch();

        gl_elems.barb_billboards.render(gl, matrix, [map_width, map_height], zoom, bearing, pitch);
    }
}

export default Barbs;
export type {BarbsOptions};