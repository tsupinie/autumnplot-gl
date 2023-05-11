
import { PlotComponent, layer_worker } from "./PlotComponent";
import { BillboardCollection } from './BillboardCollection';
import { hex2rgba } from './utils';
import { RawVectorField } from "./RawField";
import { MapType } from "./Map";

const BARB_DIMS = {
    BARB_WIDTH: 85,
    BARB_HEIGHT: 256,
    BARB_TEX_WRAP: 60,
    BARB_TEX_WIDTH: 1024,
    BARB_TEX_HEIGHT: 1024,
    MAX_BARB: 235
}

function _createBarbTexture() : HTMLCanvasElement {
    let canvas = document.createElement('canvas');

    canvas.width = BARB_DIMS.BARB_TEX_WIDTH;
    canvas.height = BARB_DIMS.BARB_TEX_HEIGHT;
    
    function drawWindBarb(ctx: CanvasRenderingContext2D, tipx: number, tipy: number, mag: number) : void {
        const elem_full_size = BARB_DIMS.BARB_WIDTH / 2 - 4;
        //const staff_length = BARB_DIMS.BARB_HEIGHT - 13 - BARB_DIMS.BARB_WIDTH / 2 - elem_full_size / 2;
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
    
    for (let ibarb = 0; ibarb <= BARB_DIMS.MAX_BARB; ibarb += 5) {
        const x_pos = (ibarb % BARB_DIMS.BARB_TEX_WRAP) / 5 * BARB_DIMS.BARB_WIDTH + BARB_DIMS.BARB_WIDTH / 2;
        const y_pos = Math.floor(ibarb / BARB_DIMS.BARB_TEX_WRAP) * BARB_DIMS.BARB_HEIGHT + BARB_DIMS.BARB_WIDTH / 2;
        drawWindBarb(ctx, x_pos, y_pos, ibarb);
    }

    return canvas;
}

const BARB_TEXTURE = _createBarbTexture();

interface BarbsOptions {
    /** 
     * The color to use for the barbs as a hex color string;.
     * @default '#000000'
     */
    color?: string;

    /** 
     * How much to thin the barbs at zoom level 1 on the map. This effectively means to plot every `n`th barb in the i and j directions, where `n` = 
     * `thin_fac`. `thin_fac` should be a power of 2. 
     * @default 1
     */
    thin_fac?: number;
}

/** 
 * A class representing a field of wind barbs. The barbs are automatically thinned based on the zoom level on the map; the user only has to provide a
 * thinning factor at zoom level 1.
 * @example
 * // Create a barb field with black barbs and plotting every 16th wind barb in both i and j at zoom level 1
 * const vector_field = {u: u_field, v: v_field};
 * const barbs = new Barbs(vector_field, {color: '#000000', thin_fac: 16});
 */
class Barbs extends PlotComponent {
    /** The vector field */
    readonly fields: RawVectorField;
    readonly color: [number, number, number];
    readonly thin_fac: number;

    /** @private */
    map: MapType | null;
    /** @private */
    barb_billboards: BillboardCollection | null;

    /**
     * Create a field of wind barbs
     * @param fields - The u and v fields to use as an object
     * @param opts   - Options for creating the wind barbs
     */
    constructor(fields: RawVectorField, opts: BarbsOptions) {
        super();

        this.fields = fields;

        const color = hex2rgba(opts.color || '#000000');
        this.color = [color[0], color[1], color[2]];
        this.thin_fac = opts.thin_fac || 1;

        this.map = null;
        this.barb_billboards = null;
    }

    /**
     * @internal 
     * Add the barb field to a map
     */
    async onAdd(map: MapType, gl: WebGLRenderingContext) {
        this.map = map;

        const {lons: field_lons, lats: field_lats} = this.fields['u'].grid.getCoords();

        const barb_elements = await layer_worker.makeBarbElements(field_lats, field_lons, this.fields.u.data, this.fields.v.data, 
            this.fields.u.grid.ni, this.fields.u.grid.nj, this.thin_fac, BARB_DIMS);
        const barb_image = {format: gl.RGBA, type: gl.UNSIGNED_BYTE, image: BARB_TEXTURE, mag_filter: gl.NEAREST};

        const barb_height = 27.5;
        const barb_aspect = BARB_DIMS.BARB_WIDTH / BARB_DIMS.BARB_HEIGHT;
        const barb_width = barb_height * barb_aspect;

        this.barb_billboards = new BillboardCollection(gl, barb_elements, barb_image, 
            [barb_width, barb_height], this.color);
    }

    /**
     * @internal 
     * Render the barb field
     */
    render(gl: WebGLRenderingContext, matrix: number[]) {
        if (this.map === null || this.barb_billboards === null) return;

        const zoom = this.map.getZoom();
        const map_width = this.map.getCanvas().width;
        const map_height = this.map.getCanvas().height;
        const bearing = this.map.getBearing();
        const pitch = this.map.getPitch();

        this.barb_billboards.render(gl, matrix, [map_width, map_height], zoom, bearing, pitch);
    }
}

export default Barbs;
export type {BarbsOptions};