import { PlotComponent } from "./PlotComponent";
import { MapLikeType, LngLat } from "./Map";
import { LineData, RenderMethodArg, WebGLAnyRenderingContext } from "./AutumnTypes";
import { PolylineCollection, PolylineCollectionOpts, LineStyle } from "./PolylineCollection";
import { PolygonCollection } from "./PolygonCollection";
import { TextCollection, TextCollectionOptions, TextSpec, HorizontalAlign, VerticalAlign } from "./TextCollection";
import { Color } from "./Color";
import { ColorMap } from "./Colormap";
import { normalizeOptions } from "./utils";

/** A coordinate pair in lon/lat order (degrees). */
type Position = [number, number];

/** GeoJSON-style line geometry. */
interface LineStringGeometry {
    type: 'LineString';
    coordinates: Position[];
}

/** GeoJSON-style multi-line geometry. */
interface MultiLineStringGeometry {
    type: 'MultiLineString';
    coordinates: Position[][];
}

/** GeoJSON-style polygon geometry (first ring is outer; remaining rings are holes). */
interface PolygonGeometry {
    type: 'Polygon';
    coordinates: Position[][];
}

/** GeoJSON-style multi-polygon geometry. */
interface MultiPolygonGeometry {
    type: 'MultiPolygon';
    coordinates: Position[][][];
}

/** GeoJSON-style point geometry. */
interface PointGeometry {
    type: 'Point';
    coordinates: Position;
}

/** GeoJSON-style multi-point geometry. */
interface MultiPointGeometry {
    type: 'MultiPoint';
    coordinates: Position[];
}

/** Supported geometry types for {@link GeometryComponent}. */
type Geometry = LineStringGeometry | MultiLineStringGeometry | PolygonGeometry | MultiPolygonGeometry | PointGeometry | MultiPointGeometry;

/**
 * Styling options for geometry features.
 *
 * These are grouped by geometry type (polygon, line, text). Only the relevant fields
 * are used for each geometry.
 */
interface GeometryStyle {
    /** Fill color for polygon features. If omitted, polygons are not filled. */
    fill_color?: string | null;

    /** Opacity multiplier for polygon fills. */
    fill_opacity?: number;

    /** Outline color for polygon features. If omitted, outlines are not drawn. */
    outline_color?: string | null;

    /** Opacity multiplier for polygon outlines. */
    outline_opacity?: number;

    /** Outline width in pixels. */
    outline_width?: number;

    /** Outline line style (solid, dashed, etc). */
    outline_style?: LineStyle;

    /** Line color for line features. If omitted, lines are not drawn. */
    line_color?: string | null;

    /** Opacity multiplier for line features. */
    line_opacity?: number;

    /** Line width in pixels. */
    line_width?: number;

    /** Line style (solid, dashed, etc). */
    line_style?: LineStyle;

    /** Optional colormap for line features when data values are provided. */
    line_cmap?: ColorMap | null;

    /** Text color for point labels. */
    text_color?: string;

    /** Text halo (outline) color. */
    text_halo_color?: string;

    /** Whether to draw a halo around the text. */
    text_halo?: boolean;

    /** Font size in points for text labels. */
    text_font_size?: number;

    /** Font face for text labels. */
    text_font_face?: string;

    /** Optional colormap for text labels (requires text data values). */
    text_cmap?: ColorMap | null;

    /** Horizontal text alignment. */
    text_horizontal_align?: HorizontalAlign;

    /** Vertical text alignment. */
    text_vertical_align?: VerticalAlign;

    /** X pixel offset for text labels. */
    text_offset_x?: number;

    /** Y pixel offset for text labels. */
    text_offset_y?: number;

    /** Minimum zoom level before text appears. */
    text_min_zoom?: number;
}

/**
 * A geometry feature with styling and optional data.
 *
 * The `geometry` field follows GeoJSON coordinate rules (lon/lat order).
 */
interface GeometryFeature {
    /** Optional ID for bookkeeping. */
    id?: string | number;

    /** Geometry for the feature. */
    geometry: Geometry;

    /** Optional style override for this feature. */
    style?: GeometryStyle;

    /** Arbitrary properties for client-side use. */
    properties?: Record<string, unknown>;

    /** Optional text label (used for Point or MultiPoint geometries). */
    text?: string | string[];

    /**
     * Optional per-vertex data for line features.
     * - LineString: number[] matching the number of vertices
     * - MultiLineString: number[][] matching each line
        * - Point: number used for text colormaps
        * - MultiPoint: number[] matching each point
     */
    data?: number | number[] | number[][];

    /** Optional per-feature minimum zoom (primarily for text). */
    min_zoom?: number;
}

/** Options for {@link GeometryComponent}. */
interface GeometryComponentOptions {
    /** Default style applied to all features before per-feature overrides. */
    default_style?: GeometryStyle;

    /** Optional override for the map's glyph URL template. */
    font_url_template?: string;
}

const geometry_component_defaults: Required<GeometryComponentOptions> = {
    default_style: {},
    font_url_template: '',
};

const polygon_style_defaults: Required<Pick<GeometryStyle,
    'fill_color' | 'fill_opacity' | 'outline_color' | 'outline_opacity' | 'outline_width' | 'outline_style'
>> = {
    fill_color: null,
    fill_opacity: 0.25,
    outline_color: '#000000',
    outline_opacity: 1,
    outline_width: 2,
    outline_style: '-',
};

const line_style_defaults: Required<Pick<GeometryStyle,
    'line_color' | 'line_opacity' | 'line_width' | 'line_style' | 'line_cmap'
>> = {
    line_color: '#000000',
    line_opacity: 1,
    line_width: 2,
    line_style: '-',
    line_cmap: null,
};

const text_style_defaults: Required<Pick<GeometryStyle,
    'text_color' | 'text_halo_color' | 'text_halo' | 'text_font_size' | 'text_font_face' | 'text_cmap' |
    'text_horizontal_align' | 'text_vertical_align' | 'text_offset_x' | 'text_offset_y' | 'text_min_zoom'
>> = {
    text_color: '#000000',
    text_halo_color: '#ffffff',
    text_halo: false,
    text_font_size: 12,
    text_font_face: 'Trebuchet MS',
    text_cmap: null,
    text_horizontal_align: 'center',
    text_vertical_align: 'middle',
    text_offset_x: 0,
    text_offset_y: 0,
    text_min_zoom: 0,
};

const EPSILON = 1e-10;

function mergeStyle<T extends Record<string, any>>(base: T, override?: Partial<T>) : T {
    return {...base, ...(override === undefined ? {} : override)} as T;
}

function pointsEqual(a: Position, b: Position) {
    return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON;
}

function normalizeRing(ring: Position[]) : Position[] {
    // Remove duplicated consecutive points and drop the closing point if present.
    const cleaned: Position[] = [];
    ring.forEach(pt => {
        if (cleaned.length === 0 || !pointsEqual(cleaned[cleaned.length - 1], pt)) {
            cleaned.push(pt);
        }
    });

    if (cleaned.length > 1 && pointsEqual(cleaned[0], cleaned[cleaned.length - 1])) {
        cleaned.pop();
    }

    return cleaned;
}

function closeRing(ring: Position[]) : Position[] {
    if (ring.length === 0) return ring;
    if (pointsEqual(ring[0], ring[ring.length - 1])) return ring;
    return [...ring, ring[0]];
}

function polygonArea(points: [number, number][]) {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[(i + 1) % points.length];
        area += x1 * y2 - x2 * y1;
    }
    return area * 0.5;
}

function isConvex(prev: [number, number], curr: [number, number], next: [number, number], is_ccw: boolean) {
    const cross = (curr[0] - prev[0]) * (next[1] - curr[1]) - (curr[1] - prev[1]) * (next[0] - curr[0]);
    return is_ccw ? cross > EPSILON : cross < -EPSILON;
}

function pointInTriangle(p: [number, number], a: [number, number], b: [number, number], c: [number, number]) {
    // Barycentric test in 2D.
    const v0x = c[0] - a[0];
    const v0y = c[1] - a[1];
    const v1x = b[0] - a[0];
    const v1y = b[1] - a[1];
    const v2x = p[0] - a[0];
    const v2y = p[1] - a[1];

    const dot00 = v0x * v0x + v0y * v0y;
    const dot01 = v0x * v1x + v0y * v1y;
    const dot02 = v0x * v2x + v0y * v2y;
    const dot11 = v1x * v1x + v1y * v1y;
    const dot12 = v1x * v2x + v1y * v2y;

    const denom = dot00 * dot11 - dot01 * dot01;
    if (Math.abs(denom) < EPSILON) return false;

    const inv_denom = 1 / denom;
    const u = (dot11 * dot02 - dot01 * dot12) * inv_denom;
    const v = (dot00 * dot12 - dot01 * dot02) * inv_denom;

    return u >= -EPSILON && v >= -EPSILON && u + v <= 1 + EPSILON;
}

function triangulateRing(ring: [number, number][]) : number[] {
    // Simple ear-clipping triangulation for a single, simple polygon ring.
    const triangles: number[] = [];
    if (ring.length < 3) return triangles;

    const is_ccw = polygonArea(ring) > 0;
    const indices = ring.map((_, i) => i);

    let guard = 0;
    while (indices.length > 3 && guard < ring.length * ring.length) {
        let ear_found = false;
        for (let i = 0; i < indices.length; i++) {
            const prev = indices[(i - 1 + indices.length) % indices.length];
            const curr = indices[i];
            const next = indices[(i + 1) % indices.length];

            const p_prev = ring[prev];
            const p_curr = ring[curr];
            const p_next = ring[next];

            if (!isConvex(p_prev, p_curr, p_next, is_ccw)) {
                continue;
            }

            let contains_point = false;
            for (let j = 0; j < indices.length; j++) {
                const idx = indices[j];
                if (idx === prev || idx === curr || idx === next) continue;

                if (pointInTriangle(ring[idx], p_prev, p_curr, p_next)) {
                    contains_point = true;
                    break;
                }
            }

            if (contains_point) continue;

            triangles.push(p_prev[0], p_prev[1], p_curr[0], p_curr[1], p_next[0], p_next[1]);
            indices.splice(i, 1);
            ear_found = true;
            break;
        }

        if (!ear_found) {
            console.warn('Failed to triangulate polygon ring; skipping fill.');
            break;
        }

        guard += 1;
    }

    if (indices.length === 3) {
        const a = ring[indices[0]];
        const b = ring[indices[1]];
        const c = ring[indices[2]];
        triangles.push(a[0], a[1], b[0], b[1], c[0], c[1]);
    }

    return triangles;
}

function ringToMercator(ring: Position[]) : [number, number][] {
    return ring.map(([lon, lat]) => {
        const pt = new LngLat(lon, lat).toMercatorCoord();
        return [pt.x, pt.y] as [number, number];
    }).filter(pt => !isNaN(pt[0]) && !isNaN(pt[1]));
}

function resolveColor(color: string | null | undefined, opacity: number | undefined) {
    if (color === null || color === undefined) return null;

    const base = Color.fromHex(color);
    if (opacity === undefined) return base;

    return base.withOpacity(base.a * opacity);
}

function lerpNumber(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

function lerpColor(a: Color, b: Color, t: number) {
    const a_rgba = a.toRGBATuple();
    const b_rgba = b.toRGBATuple();
    return new Color([
        lerpNumber(a_rgba[0], b_rgba[0], t),
        lerpNumber(a_rgba[1], b_rgba[1], t),
        lerpNumber(a_rgba[2], b_rgba[2], t),
        lerpNumber(a_rgba[3], b_rgba[3], t),
    ]);
}

function colorFromCmap(cmap: ColorMap, value: number) {
    const levels = cmap.levels;
    const n_bins = levels.length - 1;

    if (n_bins <= 0) return new Color([0, 0, 0, 1]);

    if (value <= levels[0]) {
        return cmap.underflow_color === null ? cmap.colors[0] : cmap.underflow_color;
    }

    if (value >= levels[n_bins]) {
        return cmap.overflow_color === null ? cmap.colors[n_bins - 1] : cmap.overflow_color;
    }

    const level_min = levels[0];
    const level_max = levels[n_bins];
    const value_norm = (value - level_min) / (level_max - level_min);

    // Invert the non-linear level spacing to the colormap index space.
    let band = 0;
    for (; band < n_bins; band++) {
        const lev0 = (levels[band] - level_min) / (level_max - level_min);
        const lev1 = (levels[band + 1] - level_min) / (level_max - level_min);
        if (lev0 <= value_norm && value_norm <= lev1) break;
    }

    if (band >= n_bins) return cmap.colors[n_bins - 1];

    const lev0 = (levels[band] - level_min) / (level_max - level_min);
    const lev1 = (levels[band + 1] - level_min) / (level_max - level_min);
    const alpha = (value_norm - lev0) / Math.max(lev1 - lev0, EPSILON);

    const idx0 = band / n_bins;
    const idx1 = (band + 1) / n_bins;
    const idx_norm = idx0 * (1 - alpha) + idx1 * alpha;

    const color_index = idx_norm * Math.max(cmap.colors.length - 1, 0);
    const i0 = Math.floor(color_index);
    const i1 = Math.min(i0 + 1, cmap.colors.length - 1);
    const frac = color_index - i0;

    return lerpColor(cmap.colors[i0], cmap.colors[i1], frac);
}

function toLineData(vertices: Position[], data?: number[]) : LineData | null {
    if (vertices.length < 2) return null;

    if (data !== undefined && data.length !== vertices.length) {
        console.warn('Line data length does not match vertex count; ignoring line data.');
        return {vertices: vertices};
    }

    return data === undefined ? {vertices: vertices} : {vertices: vertices, data: data};
}

interface GeometryGLElems<MapType extends MapLikeType> {
    map: MapType;
    gl: WebGLAnyRenderingContext;
}

/**
 * Plot polygons, lines, and text from a collection of geometry features.
 *
 * This component is designed as a thin, general layer that uses existing
 * autumnplot-gl rendering primitives (PolylineCollection, TextCollection, and
 * PolygonCollection). It keeps the feature format GeoJSON-like so it can be
 * extended to other geometry types later.
 */
class GeometryComponent<MapType extends MapLikeType> extends PlotComponent<MapType> {
    private features: GeometryFeature[];
    private gl_elems: GeometryGLElems<MapType> | null;

    private fill_collections: PolygonCollection[] | null;
    private line_collections: PolylineCollection[] | null;
    private text_collections: TextCollection[] | null;

    private readonly opts: Required<GeometryComponentOptions>;
    private build_id: number;
    private readonly cmap_ids: WeakMap<ColorMap, number>;
    private cmap_counter: number;

    constructor(features: GeometryFeature[], opts?: GeometryComponentOptions) {
        super();

        this.features = features;
        this.gl_elems = null;
        this.fill_collections = null;
        this.line_collections = null;
        this.text_collections = null;
        this.opts = normalizeOptions(opts, geometry_component_defaults);
        this.build_id = 0;
        this.cmap_ids = new WeakMap();
        this.cmap_counter = 0;
    }

    /**
     * Replace the current feature list and rebuild the geometry collections.
     */
    public async updateFeatures(features: GeometryFeature[]) {
        this.features = features;
        await this.rebuildCollections();
    }

    /**
     * @internal
     */
    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        this.gl_elems = {map: map, gl: gl};
        await this.rebuildCollections();
    }

    /**
     * @internal
     */
    public render(gl: WebGLAnyRenderingContext, arg: RenderMethodArg) {
        if (this.gl_elems === null) return;

        const map = this.gl_elems.map;
        const map_width = map.getCanvas().width;
        const map_height = map.getCanvas().height;
        const map_zoom = map.getZoom();
        const map_bearing = map.getBearing();
        const map_pitch = map.getPitch();

        if (this.fill_collections !== null) {
            this.fill_collections.forEach(fc => fc.render(gl, arg));
        }

        if (this.line_collections !== null) {
            this.line_collections.forEach(lc => lc.render(gl, arg, [map_width, map_height], map_zoom, map_bearing, map_pitch));
        }

        if (this.text_collections !== null) {
            this.text_collections.forEach(tc => tc.render(gl, arg, [map_width, map_height], map_zoom));
        }
    }

    private getCmapId(cmap: ColorMap) {
        const existing = this.cmap_ids.get(cmap);
        if (existing !== undefined) return existing;

        this.cmap_counter += 1;
        this.cmap_ids.set(cmap, this.cmap_counter);
        return this.cmap_counter;
    }

    private async rebuildCollections() {
        if (this.gl_elems === null) return;

        const build_id = ++this.build_id;
        const {map, gl} = this.gl_elems;

        const base_polygon_style = mergeStyle(polygon_style_defaults, this.opts.default_style);
        const base_line_style = mergeStyle(line_style_defaults, this.opts.default_style);
        const base_text_style = mergeStyle(text_style_defaults, this.opts.default_style);

        const fill_buckets = new Map<string, {color: Color, opacity: number, vertices: number[]}>();
        const line_buckets = new Map<string, {style: Required<Pick<GeometryStyle, 'line_width' | 'line_style'>>, color: Color, cmap: ColorMap | null, lines: LineData[]}>();
        const text_buckets = new Map<string, {opts: TextCollectionOptions, font_face: string, text: TextSpec[]}>();

        const font_url_template = this.opts.font_url_template !== '' ? this.opts.font_url_template : map.getStyle().glyphs;

        let text_cmap_warned = false;

        const addText = (lon: number, lat: number, text: string, style: GeometryStyle, text_value?: number, min_zoom_override?: number) => {
            if (font_url_template === undefined) {
                console.warn('No font URL template available; text labels will not render.');
                return;
            }

            const text_style = mergeStyle(base_text_style, style);
            const font_face = text_style.text_font_face;

            let text_color = Color.fromHex(text_style.text_color);
            if (text_style.text_cmap !== null) {
                if (text_value === undefined || isNaN(text_value)) {
                    if (!text_cmap_warned) {
                        console.warn('Text colormap provided without numeric data; using text_color instead.');
                        text_cmap_warned = true;
                    }
                }
                else {
                    text_color = colorFromCmap(text_style.text_cmap, text_value);
                }
            }

            const text_opts: TextCollectionOptions = {
                horizontal_align: text_style.text_horizontal_align,
                vertical_align: text_style.text_vertical_align,
                font_size: text_style.text_font_size,
                halo: text_style.text_halo,
                text_color: text_color,
                halo_color: Color.fromHex(text_style.text_halo_color),
                offset_x: text_style.text_offset_x,
                offset_y: text_style.text_offset_y,
            };

            const key = JSON.stringify({
                font_face: font_face,
                font_size: text_opts.font_size,
                halo: text_opts.halo,
                text_color: text_style.text_color,
                halo_color: text_style.text_halo_color,
                offset_x: text_opts.offset_x,
                offset_y: text_opts.offset_y,
                h_align: text_opts.horizontal_align,
                v_align: text_opts.vertical_align,
                color: text_color.toRGBAHex(),
            });

            if (!text_buckets.has(key)) {
                text_buckets.set(key, {opts: text_opts, font_face: font_face, text: []});
            }

            const text_min_zoom = min_zoom_override !== undefined ? min_zoom_override : text_style.text_min_zoom;
            const bucket = text_buckets.get(key)!;
            bucket.text.push({lon: lon, lat: lat, text: text, min_zoom: text_min_zoom});
        };

        const addLine = (vertices: Position[], style: GeometryStyle, data?: number[]) => {
            const line_style = mergeStyle(base_line_style, style);

            if (line_style.line_color === null && line_style.line_cmap === null) {
                return;
            }

            const line_color = resolveColor(line_style.line_color, line_style.line_opacity);
            let line_cmap = line_style.line_cmap === undefined ? null : line_style.line_cmap;

            if (line_cmap !== null && data === undefined) {
                console.warn('Line colormap provided without data; falling back to line color.');
                line_cmap = null;
            }

            if (line_color === null && line_cmap === null) {
                return;
            }

            const line_data = toLineData(vertices, line_cmap !== null ? data : undefined);
            if (line_data === null) return;

            const cmap_id = line_cmap === null ? 'none' : `cmap:${this.getCmapId(line_cmap)}`;
            const key = JSON.stringify({
                color: line_color === null ? null : line_color.toRGBAHex(),
                width: line_style.line_width,
                style: line_style.line_style,
                cmap: cmap_id,
            });

            if (!line_buckets.has(key)) {
                // Default to black if we have a colormap but no explicit line color.
                const bucket_color = line_color === null ? Color.fromHex('#000000') : line_color;
                line_buckets.set(key, {
                    style: {line_width: line_style.line_width, line_style: line_style.line_style},
                    color: bucket_color,
                    cmap: line_cmap,
                    lines: []
                });
            }

            line_buckets.get(key)!.lines.push(line_data);
        };

        const addPolygonFill = (rings: Position[][], style: GeometryStyle) => {
            const polygon_style = mergeStyle(base_polygon_style, style);
            if (polygon_style.fill_color === null || polygon_style.fill_color === undefined) {
                return;
            }

            if (rings.length > 1) {
                // Holes are not handled yet. We still draw the outer ring fill.
                console.warn('Polygon holes are not supported yet; only the outer ring will be filled.');
            }

            const outer_ring = normalizeRing(rings[0]);
            if (outer_ring.length < 3) return;

            const mercator_ring = ringToMercator(outer_ring);
            const triangles = triangulateRing(mercator_ring);

            if (triangles.length === 0) return;

            const fill_color = Color.fromHex(polygon_style.fill_color);
            const fill_opacity = polygon_style.fill_opacity === undefined ? 1 : polygon_style.fill_opacity;

            const key = JSON.stringify({
                color: fill_color.toRGBAHex(),
                opacity: fill_opacity,
            });

            if (!fill_buckets.has(key)) {
                fill_buckets.set(key, {color: fill_color, opacity: fill_opacity, vertices: []});
            }

            fill_buckets.get(key)!.vertices.push(...triangles);
        };

        const addPolygonOutline = (rings: Position[][], style: GeometryStyle) => {
            const polygon_style = mergeStyle(base_polygon_style, style);

            if (polygon_style.outline_color === null || polygon_style.outline_color === undefined) {
                return;
            }

            const outline_style: GeometryStyle = {
                line_color: polygon_style.outline_color,
                line_opacity: polygon_style.outline_opacity,
                line_width: polygon_style.outline_width,
                line_style: polygon_style.outline_style,
            };

            rings.forEach(ring => {
                const cleaned = normalizeRing(ring);
                if (cleaned.length < 2) return;

                const closed = closeRing(cleaned);
                addLine(closed, outline_style);
            });
        };

        this.features.forEach(feature => {
            const geometry = feature.geometry;
            if (geometry === undefined || geometry === null) return;

            switch (geometry.type) {
                case 'Polygon':
                    addPolygonFill(geometry.coordinates, feature.style === undefined ? {} : feature.style);
                    addPolygonOutline(geometry.coordinates, feature.style === undefined ? {} : feature.style);
                    break;

                case 'MultiPolygon':
                    geometry.coordinates.forEach(poly => {
                        addPolygonFill(poly, feature.style === undefined ? {} : feature.style);
                        addPolygonOutline(poly, feature.style === undefined ? {} : feature.style);
                    });
                    break;

                case 'LineString': {
                    const data = Array.isArray(feature.data) && typeof feature.data[0] === 'number' ? feature.data as number[] : undefined;
                    addLine(geometry.coordinates, feature.style === undefined ? {} : feature.style, data);
                    break;
                }

                case 'MultiLineString': {
                    let data: number[][] | undefined;
                    if (Array.isArray(feature.data)) {
                        if (Array.isArray(feature.data[0])) {
                            data = feature.data as number[][];
                        }
                        else if (geometry.coordinates.length === 1 && typeof feature.data[0] === 'number') {
                            data = [feature.data as number[]];
                        }
                    }

                    geometry.coordinates.forEach((line, idx) => {
                        const line_data = data !== undefined ? data[idx] : undefined;
                        addLine(line, feature.style === undefined ? {} : feature.style, line_data);
                    });
                    break;
                }

                case 'Point': {
                    const text = typeof feature.text === 'string' ? feature.text : undefined;
                    const text_value = typeof feature.data === 'number' ? feature.data : undefined;
                    if (text !== undefined && text.length > 0) {
                        addText(geometry.coordinates[0], geometry.coordinates[1], text, feature.style === undefined ? {} : feature.style, text_value, feature.min_zoom);
                    }
                    break;
                }

                case 'MultiPoint': {
                    const text_array = Array.isArray(feature.text) ? feature.text : undefined;
                    const data_array = Array.isArray(feature.data) ? feature.data as number[] : undefined;
                    const data_value = typeof feature.data === 'number' ? feature.data : undefined;
                    geometry.coordinates.forEach((coord, idx) => {
                        let text = '';
                        if (text_array !== undefined) {
                            text = text_array[idx] === undefined ? '' : text_array[idx];
                        }
                        else if (typeof feature.text === 'string') {
                            text = feature.text;
                        }

                        if (text.length > 0) {
                            const text_value = data_array !== undefined ? data_array[idx] : data_value;
                            addText(coord[0], coord[1], text, feature.style === undefined ? {} : feature.style, text_value, feature.min_zoom);
                        }
                    });
                    break;
                }
            }
        });

        const fill_collections = [...fill_buckets.values()].map(bucket => {
            return new PolygonCollection(gl, new Float32Array(bucket.vertices), {color: bucket.color.toRGBAHex(), opacity: bucket.opacity});
        });

        const line_promises = [...line_buckets.values()].map(async bucket => {
            const opts: PolylineCollectionOpts = {
                line_width: bucket.style.line_width,
                line_style: bucket.style.line_style,
            };

            if (bucket.cmap !== null) {
                opts.cmap = bucket.cmap;
            }
            else {
                opts.color = bucket.color.toRGBAHex();
            }

            return await PolylineCollection.make(gl, bucket.lines, opts);
        });

        const text_promises = [...text_buckets.values()].map(async bucket => {
            if (font_url_template === undefined) return null;

            const font_url = font_url_template.replace('{fontstack}', bucket.font_face);
            return await TextCollection.make(gl, bucket.text, font_url, bucket.opts);
        });

        const line_collections = await Promise.all(line_promises);
        const text_collections = (await Promise.all(text_promises)).filter((tc) : tc is TextCollection => tc !== null);

        if (this.build_id !== build_id) return;

        this.fill_collections = fill_collections;
        this.line_collections = line_collections;
        this.text_collections = text_collections;

        map.triggerRepaint();
    }
}

/**
 * Convenience helper for creating a rectangular watch box polygon feature.
 * @param corners - Four corners of the box in lon/lat order.
 */
function createWatchBox(corners: Position[], style?: GeometryStyle) : GeometryFeature {
    if (corners.length < 4) {
        throw 'createWatchBox expects four corner points';
    }

    return {
        geometry: {
            type: 'Polygon',
            coordinates: [corners],
        },
        style: style,
    };
}

/**
 * Convenience helper for creating a warning polygon feature.
 * @param vertices - Polygon vertices in lon/lat order.
 */
function createWarningBox(vertices: Position[], style?: GeometryStyle) : GeometryFeature {
    return {
        geometry: {
            type: 'Polygon',
            coordinates: [vertices],
        },
        style: style,
    };
}

interface TrackPoint {
    lon: number;
    lat: number;
    value?: number;
}

/**
 * Convenience helper for creating a colored track line feature.
 * @param points - Track points in order.
 * @param style - Optional style overrides (line color, width, colormap).
 */
function createTrack(points: TrackPoint[], style?: GeometryStyle) : GeometryFeature {
    const coordinates = points.map(p => [p.lon, p.lat] as Position);
    const data = points.map(p => p.value).filter(v => v !== undefined) as number[];

    return {
        geometry: {
            type: 'LineString',
            coordinates: coordinates,
        },
        data: data.length === points.length ? data : undefined,
        style: style,
    };
}

/**
 * Convenience helper for building a spaghetti plot from multiple line members.
 * @param lines - Array of line coordinate arrays.
 */
function createSpaghettiPlot(lines: Position[][], style?: GeometryStyle) : GeometryFeature[] {
    return lines.map(line => ({
        geometry: {
            type: 'LineString',
            coordinates: line,
        },
        style: style,
    }));
}

export {GeometryComponent, createWatchBox, createWarningBox, createTrack, createSpaghettiPlot};
export type {GeometryFeature, GeometryComponentOptions, GeometryStyle};
