
import { LineData, TypedArray, WebGLAnyRenderingContext} from './AutumnTypes';
import { LngLat, MapLikeType } from './Map';
import { PlotComponent } from './PlotComponent';
import { RawScalarField } from './RawField';
import { LineStyle, PolylineCollection, PolylineCollectionOpts, isLineStyle } from './PolylineCollection';
import { TextCollection, TextCollectionOptions, TextSpec } from './TextCollection';
import { Color } from './Color';

import { normalizeOptions } from './utils';
import { kdTree } from 'kd-tree-javascript';
import { ColorMap } from './Colormap';
import { StructuredGrid, UnstructuredGrid } from './Grid';

interface ContourOptions {
    /** 
     * The color of the contours as a hex color string 
     * @default '#000000'
     */
    color?: string;

    /**
     * A color map to use to color the contours. Specifying a colormap overrides the color option.
     * @default null
     */
    cmap?: ColorMap | null;

    /** 
     * The contour interval for drawing contours at regular intervals
     * @default 1
     */
    interval?: number;

    /**
     * A list of arbitrary levels to contour. This overrides the `interval` option.
     * @default null
     */
    levels?: number[] | null;

    /**
     * The width of the line in pixels. This could be either a number or a function that takes a contour level as a number and returns a line width. This
     *  can be used to vary the width of the contours by value.
     * @example level => level >= 100 ? 3 : 1.5
     * @default 2
     */
    line_width?: number | ((level: number) => number);

    /**
     * The style to use for the line. This can be either a LineStyle or a function that takes a contour level as a number and returns a LineStyle. This 
     *  can be used to vary the contours by value.
     * @example level => level < 0 ? '--' : '-'
     * @default '-'
     */
    line_style?: LineStyle | ((level: number) => LineStyle);
}

const contour_opt_defaults: Required<ContourOptions> = {
    color: '#000000',
    cmap: null,
    interval: 1,
    levels: null,
    line_width: 2,
    line_style: '-'
}

interface ContourGLElems<MapType extends MapLikeType> {
    gl: WebGLAnyRenderingContext;
    map: MapType;
}

/** 
 * A field of contoured data.
 * @example
 * // Create a contoured height field, with black contours every 30 m (assuming the height field is in 
 * // meters).
 * const contours = new Contour(height_field, {color: '#000000', interval: 30});
 */
class Contour<ArrayType extends TypedArray, GridType extends StructuredGrid, MapType extends MapLikeType> extends PlotComponent<MapType> {
    private field: RawScalarField<ArrayType, GridType>;
    public readonly opts: Required<ContourOptions>;

    private gl_elems: ContourGLElems<MapType> | null;
    private contours: PolylineCollection[] | null;

    /**
     * Create a contoured field
     * @param field - The field to contour
     * @param opts  - Options for creating the contours
     */
    constructor(field: RawScalarField<ArrayType, GridType>, opts: ContourOptions) {
        super();

        this.field = field;
        this.opts = normalizeOptions(opts, contour_opt_defaults);

        this.gl_elems = null;
        this.contours = null;
    }

    /**
     * Update the data displayed as contours
     * @param field - The new field to contour
     */
    public async updateField(field: RawScalarField<ArrayType, GridType>) {
        this.field = field;
        if (this.gl_elems === null) return;

        const gl = this.gl_elems.gl;

        const contour_data = await this.getContours();

        type LineDataStyleWidth = {data: LineData[], line_width: number, line_style: LineStyle};
        const line_data: LineDataStyleWidth[] = [];

        // Make contour data and sort them by line width and line style
        Object.entries(contour_data).forEach(([cv, cd]) => {
            const cv_ = parseFloat(cv);
            const contour_style = isLineStyle(this.opts.line_style) ? this.opts.line_style : this.opts.line_style(cv_);
            const contour_width = typeof this.opts.line_width === 'number' ? this.opts.line_width : this.opts.line_width(cv_);

            const polyline_data = cd.map(c => {
                const ld: LineData = {vertices: c};
                if (this.opts.cmap !== null){
                    ld.data = c.map(() => cv_)
                }
                return ld;
            });

            const line_data_filtered = line_data.filter(ld => ld.line_style == contour_style && ld.line_width == contour_width);
            let contour_line_data: LineDataStyleWidth;
            if (line_data_filtered.length == 0) {
                contour_line_data = {data: [], line_width: contour_width, line_style: contour_style};
                line_data.push(contour_line_data);
            }
            else {
                contour_line_data = line_data_filtered[0];
            }

            contour_line_data.data = contour_line_data.data.concat(polyline_data);
        });

        // Make one PolylineCollection for each combination of line width and line style
        const promises = line_data.map(async ld => {
            const plc_opts: PolylineCollectionOpts = {line_width: ld.line_width, line_style: ld.line_style};
            if (this.opts.cmap !== null) {
                plc_opts.cmap = this.opts.cmap;
            }
            else {
                plc_opts.color = this.opts.color;
            }

            return await PolylineCollection.make(gl, ld.data, plc_opts);
        });

        Promise.all(promises).then(values => {
            if (this.gl_elems === null) return;

            this.contours = values;
            this.gl_elems.map.triggerRepaint();
        });
    }

    public async getContours() {
        const levels = this.opts.levels === null ? undefined : this.opts.levels;
        return await this.field.getContours({interval: this.opts.interval, levels: levels});
    }

    /**
     * @internal
     * Add the contours to a map
     */
    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {

        this.gl_elems = {
            gl: gl, map: map
        };

        await this.updateField(this.field);
    }

    /**
     * @internal
     * Render the contours
     */
    public render(gl: WebGLAnyRenderingContext, matrix: number[] | Float32Array) {
        if (this.gl_elems === null || this.contours === null) return;
        const gl_elems = this.gl_elems;

        if (matrix instanceof Float32Array)
            matrix = [...matrix];

        const zoom = gl_elems.map.getZoom();
        const map_width = gl_elems.map.getCanvas().width;
        const map_height = gl_elems.map.getCanvas().height;
        const bearing = gl_elems.map.getBearing();
        const pitch = gl_elems.map.getPitch();

        this.contours.forEach(cnt => cnt.render(gl, matrix, [map_width, map_height], zoom, bearing, pitch));
    }
}

interface ContourLabelGLElems<MapType extends MapLikeType> {
    gl: WebGLAnyRenderingContext;
    map: MapType;
}

interface ContourLabelOptions {
    /**
     * Number of decimal places to use in the contour labels
     * @default 0
     */
    n_decimal_places?: number;

    /**
     * Font face to use for the contour labels
     * @default 'Trebuchet MS'
     */
    font_face?: string;

    /**
     * Font size in points to use for the contour labels
     * @default 12
     */
    font_size?: number;

    /**
     * URL template to use in retrieving the font data for the labels. The default is to use the template from the map style.
     */
    font_url_template?: string;

    /**
     * Text color for the contour labels
     * @default '#000000'
     */
    text_color?: string;

    /**
     * Halo (outline) color for the contour labels
     * @default '#000000'
     */
    halo_color?: string;

    /**
     * Whether to draw the halo (outline) on the contour labels
     * @default false
     */
    halo?: boolean;

    /**
     * Label density. 2 makes the labels twice as dense, 0.5 makes them half as dense.
     * @default 1
     */
    density?: number;
}

const contour_label_opt_defaults: Required<ContourLabelOptions> = {
    n_decimal_places: 0,
    font_face: 'Trebuchet MS',
    font_size: 12,
    font_url_template: '',
    text_color: '#000000',
    halo_color: '#000000',
    halo: false,
    density: 1
}

class ContourLabels<ArrayType extends TypedArray, GridType extends StructuredGrid, MapType extends MapLikeType> extends PlotComponent<MapType> {
    private readonly contours: Contour<ArrayType, GridType, MapType>;
    private gl_elems: ContourLabelGLElems<MapType> | null;
    private text_collection: TextCollection | null;
    private readonly opts: Required<ContourLabelOptions>;

    constructor(contours: Contour<ArrayType, GridType, MapType>, opts?: ContourLabelOptions) {
        super();

        this.opts = normalizeOptions(opts, contour_label_opt_defaults);

        this.contours = contours;
        this.text_collection = null;
        this.gl_elems = null;
    }

    /**
     * Update contour labels when the field for the associated Contour object has been changed.
     */
    public async updateField() {
        if (this.gl_elems === null) return;

        const map = this.gl_elems.map;
        const gl = this.gl_elems.gl;

        const map_style = map.getStyle();

        const font_url_template = this.opts.font_url_template == '' ? map_style.glyphs : this.opts.font_url_template;
        if (font_url_template === undefined)
            throw "The map style doesn't have any glyph information. Please pass the font_url_template option to ContourLabels";

        const font_url = font_url_template.replace('{range}', '0-255').replace('{fontstack}', this.opts.font_face);

        interface ContourLabelPlacement {
            coord: {lon: number, lat: number};
            text: string;
        }
        const label_pos: ContourLabelPlacement[] = [];

        const contour_data = await this.contours.getContours();
        const contour_levels = Object.keys(contour_data).map(parseFloat);
        contour_levels.sort((a, b) => a - b);

        const map_max_zoom = map.getMaxZoom();
        const contour_label_spacing = 0.006 / this.opts.density * Math.pow(2, 7 - map_max_zoom);

        Object.entries(contour_data).forEach(([level, contours]) => {
            const icntr = (parseFloat(level) - contour_levels[0]);
            const level_str = level.toString();

            contours.forEach(contour => {
                const c_map = contour.map(v => {
                    const v_ll = new LngLat(...v).toMercatorCoord();
                    return [v_ll.x, v_ll.y] as [number, number];
                });
        
                const dist: number[] = [];
                c_map.forEach((v, i) => {
                    if (i == 0) {
                        dist.push(0);
                    }
                    else {
                        const v_last = c_map[i - 1];
                        const this_dist = Math.hypot(v_last[0] - v[0], v_last[1] - v[1]);
                        dist.push(dist[i - 1] + this_dist);
                    }
                });

                let n_labels_placed = 0;
                for (let idist = 1; idist < dist.length; idist++) {
                    const target_dist = contour_label_spacing * (n_labels_placed + (icntr / 2) % 1);
                    if (dist[idist - 1] <= target_dist && target_dist < dist[idist]) {
                        const pt1 = contour[idist - 1];
                        const pt2 = contour[idist];

                        const alpha = (target_dist - dist[idist - 1]) / (dist[idist] - dist[idist - 1]);
                        const pt_lon = (1 - alpha) * pt1[0] + alpha * pt2[0];
                        const pt_lat = (1 - alpha) * pt1[1] + alpha * pt2[1];

                        label_pos.push({coord: {lon: pt_lon, lat: pt_lat}, text: level_str});
                        n_labels_placed++;
                    }
                }
            });
        });

        const label_grid = new UnstructuredGrid(label_pos.map(lp => lp.coord));
        const min_zoom = label_grid.getMinVisibleZoom(Math.pow(2, map_max_zoom - 2));
        const text_specs: TextSpec[] = label_pos.map((lp, ilp) => ({...lp.coord, min_zoom: min_zoom[ilp], text: lp.text}));

        const tc_opts: TextCollectionOptions = {
            horizontal_align: 'center', vertical_align: 'middle', font_size: this.opts.font_size,
            halo: this.opts.halo, 
            text_color: Color.fromHex(this.opts.text_color), halo_color: Color.fromHex(this.opts.halo_color),
        };

        this.text_collection = await TextCollection.make(gl, text_specs, font_url, tc_opts);
        map.triggerRepaint();
    }

    /** 
     * @internal 
     * Add the contour labels to a map
     */
    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        this.gl_elems = {
            gl: gl, map: map,
        }

        this.updateField();
    }

    /** 
     * @internal 
     * Render the contour labels
     */
    public render(gl: WebGLAnyRenderingContext, matrix: number[]) {
        if (this.gl_elems === null || this.text_collection === null) return;
        const gl_elems = this.gl_elems;

        const map_width = gl_elems.map.getCanvas().width;
        const map_height = gl_elems.map.getCanvas().height;
        const map_zoom = gl_elems.map.getZoom();

        this.text_collection.render(gl, matrix, [map_width, map_height], map_zoom);
    }
}

export default Contour;
export {ContourLabels};
export type {ContourOptions, ContourLabelOptions};