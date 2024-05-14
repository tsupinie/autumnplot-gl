
import { LineData, TypedArray, WebGLAnyRenderingContext} from './AutumnTypes';
import { LngLat, MapType } from './Map';
import { PlotComponent, getGLFormatTypeAlignment } from './PlotComponent';
import { DelayedScalarField, RawScalarField } from './RawField';
import { PolylineCollection } from './PolylineCollection';
import { TextCollection, TextCollectionOptions, TextSpec } from './TextCollection';
import { WGLTexture } from 'autumn-wgl';

import Module from './cpp/marchingsquares';
import { MarchingSquaresModule } from './cpp/marchingsquares';
import { LineString, Point } from './cpp/marchingsquares_embind';
import './cpp/marchingsquares.wasm';
import { hex2rgb, normalizeOptions } from './utils';
import { kdTree } from 'kd-tree-javascript';

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
}

interface ContourGLElems {
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
class Contour<ArrayType extends TypedArray> extends PlotComponent {
    private readonly field: DelayedScalarField<ArrayType>;
    public readonly color: string;
    public readonly interval: number;
    public readonly levels: number[];

    private gl_elems: ContourGLElems | null;
    private contours: PolylineCollection | null;
    private readonly is_delayed : boolean;
    private show_field: boolean;

    /**
     * Create a contoured field
     * @param field - The field to contour
     * @param opts  - Options for creating the contours
     */
    constructor(field: RawScalarField<ArrayType> | DelayedScalarField<ArrayType>, opts: ContourOptions) {
        super();

        this.is_delayed = !RawScalarField.isa(field);
        this.field = RawScalarField.isa(field) ? DelayedScalarField.fromRawScalarField(field) : field;

        this.interval = opts.interval || 1;
        this.levels = opts.levels || [];

        this.color = opts.color || '#000000';

        this.gl_elems = null;
        this.contours = null;
        this.show_field = true;
    }

    public async updateData(key: string | undefined) {
        if (this.gl_elems === null) return;

        const gl = this.gl_elems.gl;
        const tex_data = key === undefined ? null : await this.field.getTextureData(key);
        this.show_field = tex_data !== null;

        const contour_data = await this.getContours(key);
        const line_data = Object.values(contour_data).flat().map(c => {
            return {vertices: c} as LineData;
        });

        this.contours = await PolylineCollection.make(gl, line_data, {line_width: 2, color: this.color});
    }

    public async getContours(key: string | undefined) {
        const msm = await initMSModule();

        const grid_coords = this.field.grid.getGridCoords();

        const grid = new msm.FloatList();
        grid.resize(this.field.grid.ni * this.field.grid.nj, 0);
        const tex_data = key === undefined ? null : await this.field.data_getter(key);
        if (tex_data === null) return {};

        tex_data.forEach((v, i) => grid.set(i, v));

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

        this.gl_elems = {
            gl: gl, map: map
        };

        if (!this.is_delayed) await this.updateData('');
    }

    /**
     * @internal
     * Render the contours
     */
    public render(gl: WebGLAnyRenderingContext, matrix: number[] | Float32Array) {
        if (this.gl_elems === null || !this.show_field || this.contours === null) return;
        const gl_elems = this.gl_elems;

        if (matrix instanceof Float32Array)
            matrix = [...matrix];

        const zoom = gl_elems.map.getZoom();
        const map_width = gl_elems.map.getCanvas().width;
        const map_height = gl_elems.map.getCanvas().height;
        const bearing = gl_elems.map.getBearing();
        const pitch = gl_elems.map.getPitch();

        this.contours.render(gl, matrix, [map_width, map_height], zoom, bearing, pitch);
    }
}

interface ContourLabelGLElems {
    gl: WebGLAnyRenderingContext;
    map: MapType;
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
    private text_collection: TextCollection | null;
    private readonly opts: Required<ContourLabelOptions>;

    constructor(contours: Contour<ArrayType>, opts?: ContourLabelOptions) {
        super();

        this.opts = normalizeOptions(opts, contour_label_opt_defaults);

        this.contours = contours;
        this.text_collection = null;
        this.gl_elems = null;
    }

    public async updateData(key: string) {
        if (this.gl_elems === null) return;

        const map = this.gl_elems.map;
        const gl = this.gl_elems.gl;

        const map_style = map.getStyle();

        const font_url_template = this.opts.font_url_template == '' ? map_style.glyphs : this.opts.font_url_template;
        const font_url = font_url_template.replace('{range}', '0-255').replace('{fontstack}', this.opts.font_face);

        const label_pos: TextSpec[] = [];

        const contour_data = await this.contours.getContours(key);
        const contour_levels = Object.keys(contour_data).map(parseFloat);
        contour_levels.sort((a, b) => a - b);

        const map_max_zoom = map.getMaxZoom();
        const contour_label_spacing = 0.01 * Math.pow(2, 7 - map_max_zoom);
        let min_label_lat: number = null, max_label_lat: number = null, min_label_lon: number = null, max_label_lon: number = null;

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

                        if (min_label_lon === null || pt_lon < min_label_lon) min_label_lon = pt_lon;
                        if (max_label_lon === null || pt_lon > max_label_lon) max_label_lon = pt_lon;
                        if (min_label_lat === null || pt_lat < min_label_lat) min_label_lat = pt_lat;
                        if (max_label_lat === null || pt_lat > max_label_lat) max_label_lat = pt_lat;

                        label_pos.push({lon: pt_lon, lat: pt_lat, min_zoom: map_max_zoom, text: level_str});
                        n_labels_placed++;
                    }
                }
            });
        });

        const tree = new kdTree(label_pos, (a, b) => Math.hypot(a.lon - b.lon, a.lat - b.lat), ['lon', 'lat']);

        const {x: min_label_x, y: max_label_y} = new LngLat(min_label_lon, min_label_lat).toMercatorCoord();
        const {x: max_label_x, y: min_label_y} = new LngLat(max_label_lon, max_label_lat).toMercatorCoord();
        const thin_grid_width = max_label_x - min_label_x;
        const thin_grid_height = max_label_y - min_label_y;
        const ni_thin_grid = Math.round(4 * thin_grid_width / contour_label_spacing);
        const nj_thin_grid = Math.round(4 * thin_grid_height / contour_label_spacing);
        const thin_grid_xs = [];
        const thin_grid_ys = [];

        for (let idx = 0; idx < ni_thin_grid; idx++) {
            thin_grid_xs.push(min_label_x + (idx / ni_thin_grid) * thin_grid_width);
        }

        for (let jdy = 0; jdy < nj_thin_grid; jdy++) {
            thin_grid_ys.push(min_label_y + (jdy / nj_thin_grid) * thin_grid_height);
        }

        let skip = 1;
        for (let zoom = map_max_zoom - 1; zoom >= 0; zoom--) {        
            for (let idx = 0; idx < ni_thin_grid; idx += skip) {
                for (let jdy = 0; jdy < nj_thin_grid; jdy += skip) {
                    const grid_x = thin_grid_xs[idx];
                    const grid_y = thin_grid_ys[jdy];
                    const ll = LngLat.fromMercatorCoord(grid_x, grid_y);

                    const [label, dist] = tree.nearest({lon: ll.lng, lat: ll.lat, min_zoom: 0, text: ""}, 1)[0];
                    label.min_zoom = zoom;
                }
            }

            skip *= 2;
        }

        const tc_opts: TextCollectionOptions = {
            horizontal_align: 'center', vertical_align: 'middle', font_size: this.opts.font_size,
            halo: this.opts.halo, 
            text_color: hex2rgb(this.opts.text_color), halo_color: hex2rgb(this.opts.halo_color),
        };

        this.text_collection = await TextCollection.make(gl, label_pos, font_url, tc_opts);
    }

    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        this.gl_elems = {
            gl: gl, map: map,
        }

        this.updateData('');
    }

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
export {initMSModule, ContourLabels};
export type {ContourOptions};