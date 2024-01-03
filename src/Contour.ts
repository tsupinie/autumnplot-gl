
import { LineData, TypedArray, WebGLAnyRenderingContext} from './AutumnTypes';
import { MapType } from './Map';
import { PlotComponent } from './PlotComponent';
import { RawScalarField } from './RawField';
import { PolylineCollection } from './PolylineCollection';
import { TextCollection, TextCollectionOptions, TextSpec } from './TextCollection';

import Module from './cpp/marchingsquares';
import { MarchingSquaresModule } from './cpp/marchingsquares';
import { LineString, Point } from './cpp/marchingsquares_embind';
import './cpp/marchingsquares.wasm';
import { hex2rgb, normalizeOptions } from './utils';

let msm_promise: Promise<MarchingSquaresModule> | null = null;

function initMSModule() {
    if (msm_promise === null) {
        msm_promise = Module();
    }

    return msm_promise;
}

interface ContourOptions {
    /** 
     * The color of the contours as a hex color string 
     * @default '#000000'
     */
    color?: string;

    /** 
     * The contour interval for drawing contours at regular intervals
     * @default 1
     */
    interval?: number;

    /**
     * A list of arbitrary levels (up to 40) to contour. This overrides the `interval` option.
     * @default Draw contours at regular intervals given by the `interval` option.
     */
    levels?: number[];

    /** 
     * A function to thin the contours based on zoom level. The function should take a zoom level and return a number `n` that means to only show every 
     * `n`th contour.
     * @default Don't thin the contours on any zoom level
     */
    thinner?: (zoom: number) => number;
}

interface ContourGLElems {
    map: MapType;
    contours: PolylineCollection;
}

/** 
 * A field of contoured data. The contours can optionally be thinned based on map zoom level.
 * @example
 * // Create a contoured height field, with black contours every 30 m (assuming the height field is in 
 * // meters) and only using every other contour when the map zoom level is less than 5.
 * const contours = new Contour(height_field, {color: '#000000', interval: 30, 
 *                                                  thinner: zoom => zoom < 5 ? 2 : 1});
 */
class Contour<ArrayType extends TypedArray> extends PlotComponent {
    private readonly field: RawScalarField<ArrayType>;
    public readonly color: string;
    public readonly interval: number;
    public readonly levels: number[];
    public readonly thinner: (zoom: number) => number;

    private gl_elems: ContourGLElems | null;

    /**
     * Create a contoured field
     * @param field - The field to contour
     * @param opts  - Options for creating the contours
     */
    constructor(field: RawScalarField<ArrayType>, opts: ContourOptions) {
        super();

        this.field = field;

        this.interval = opts.interval || 1;
        this.levels = opts.levels || [];

        this.color = opts.color || '#000000';

        this.thinner = opts.thinner || (() => 1);

        this.gl_elems = null;
    }

    public async getContours() {
        const msm = await initMSModule();

        const grid_coords = this.field.grid.getGridCoords();

        const grid = new msm.FloatList();
        grid.resize(this.field.grid.ni * this.field.grid.nj, 0);
        this.field.data.forEach((v, i) => grid.set(i, v));

        const grid_x = new msm.FloatList();
        grid_x.resize(this.field.grid.ni, 0);
        grid_coords.x.forEach((v, i) => grid_x.set(i, v));

        const grid_y = new msm.FloatList();
        grid_y.resize(this.field.grid.nj, 0);
        grid_coords.y.forEach((v, i) => grid_y.set(i, v));

        const levels = [...this.levels];
        if (levels.length == 0) {
            const levels_cpp = msm.getContourLevelsFloat32(grid, this.field.grid.ni, this.field.grid.nj, this.interval);

            for (let ilvl = 0; ilvl < levels_cpp.size(); ilvl++) {
                levels.push(levels_cpp.get(ilvl));
            }

            levels_cpp.delete();
        }

        const contours: Record<number, [number, number][][]> = {};
        levels.forEach(v => {
            const contours_ = msm.makeContoursFloat32(grid, grid_x, grid_y, v);
            contours[v] = [];

            for (let icntr = 0; icntr < contours_.size(); icntr++) {
                const contour: LineString = contours_.get(icntr);
                const contour_point_list = contour.point_list;

                contours[v].push([]);

                for (let ipt = 0; ipt < contour_point_list.size(); ipt++) {
                    const pt: Point = contour_point_list.get(ipt);
                    const [lon, lat] = this.field.grid.transform(pt.x, pt.y, {inverse: true});
                    contours[v][icntr].push([lon, lat]);

                    pt.delete();
                }

                contour_point_list.delete();
                contour.delete();
            }

            contours_.delete();
        });

        grid.delete();
        grid_x.delete();
        grid_y.delete();

        return contours;
    }

    /**
     * @internal
     * Add the contours to a map
     */
    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        const contour_data = await this.getContours();
        const line_data = Object.values(contour_data).flat().map(c => {
            return {vertices: c} as LineData;
        });

        const contours = await PolylineCollection.make(gl, line_data, {line_width: 2, color: this.color});

        this.gl_elems = {
            map: map, contours: contours
        };
    }

    /**
     * @internal
     * Render the contours
     */
    public render(gl: WebGLAnyRenderingContext, matrix: number[]) {
        if (this.gl_elems === null) return;
        const gl_elems = this.gl_elems;

        const zoom = gl_elems.map.getZoom();
        const map_width = gl_elems.map.getCanvas().width;
        const map_height = gl_elems.map.getCanvas().height;
        const bearing = gl_elems.map.getBearing();
        const pitch = gl_elems.map.getPitch();

        gl_elems.contours.render(gl, matrix, [map_width, map_height], zoom, bearing, pitch);
    }
}

interface ContourLabelGLElems {
    map: MapType;
    text_collection: TextCollection;
}

interface ContourLabelOptions {
    n_decimal_places?: number;
    font_face?: string;
    font_size?: number;
    font_url_template?: string;
    text_color?: string;
    halo_color?: string;
    halo?: boolean;
}

const contour_label_opt_defaults: Required<ContourLabelOptions> = {
    n_decimal_places: 0,
    font_face: 'Trebuchet MS',
    font_size: 12,
    font_url_template: '',
    text_color: '#000000',
    halo_color: '#000000',
    halo: false
}

class ContourLabels<ArrayType extends TypedArray> extends PlotComponent {
    private readonly contours: Contour<ArrayType>;
    private gl_elems: ContourLabelGLElems | null;
    private readonly opts: Required<ContourLabelOptions>;

    constructor(contours: Contour<ArrayType>, opts?: ContourLabelOptions) {
        super();

        this.opts = normalizeOptions(opts, contour_label_opt_defaults);

        this.contours = contours;
        this.gl_elems = null;
    }

    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        const map_style = map.getStyle();
        const font_url_template = this.opts.font_url_template == '' ? map_style.glyphs : this.opts.font_url_template;
        const font_url = font_url_template.replace('{range}', '0-255').replace('{fontstack}', this.opts.font_face);

        const label_pos: TextSpec[] = [];

        Object.entries(await this.contours.getContours()).forEach(([level, contours]) => {
            const level_str = level.toString();

            contours.forEach(contour => {
                const i = Math.floor(contour.length / 2);
                const pt = contour[i];
                label_pos.push({lat: pt[1], lon: pt[0], text: level_str});
            });
        });

        const tc_opts: TextCollectionOptions = {
            horizontal_align: 'center', vertical_align: 'middle', font_size: this.opts.font_size,
            halo: this.opts.halo, 
            text_color: hex2rgb(this.opts.text_color), halo_color: hex2rgb(this.opts.halo_color),
        };

        const text_collection = await TextCollection.make(gl, label_pos, font_url, tc_opts);

        this.gl_elems = {
            map: map, text_collection: text_collection,
        }
    }

    public render(gl: WebGLAnyRenderingContext, matrix: number[]) {
        if (this.gl_elems === null) return;
        const gl_elems = this.gl_elems;

        const map_width = gl_elems.map.getCanvas().width;
        const map_height = gl_elems.map.getCanvas().height;

        gl_elems.text_collection.render(gl, matrix, [map_width, map_height]);
    }
}

export default Contour;
export {initMSModule, ContourLabels};
export type {ContourOptions};