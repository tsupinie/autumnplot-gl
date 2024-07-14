
import { PlotComponent } from "./PlotComponent";
import { PolylineCollection } from "./PolylineCollection";
import { BillboardCollection } from "./BillboardCollection";
import { getMinZoom, normalizeOptions } from './utils';
import { MapLikeType } from "./Map";
import { RawProfileField } from "./RawField";
import { LineData, TypedArray, WebGLAnyRenderingContext } from "./AutumnTypes";
import { Float16Array } from "@petamoriken/float16";
import { ColorMap } from "./Colormap";
import { Color } from "./Color";

const LINE_WIDTH_MULTIPLIER = 2.5;
const BG_MAX_RING_MAG = 40;

const HODO_BG_DIMS = {
    BB_WIDTH: 256,
    BB_HEIGHT: 256,
    BB_TEX_WIDTH: 256,
    BB_TEX_HEIGHT: 256,
    BB_MAG_MAX: 1000,
    BB_MAG_WRAP: 1000,
    BB_MAG_BIN_SIZE: 1000,
}

function _createHodoBackgroundTexture(line_width: number) {
    let canvas = document.createElement('canvas');

    canvas.width = HODO_BG_DIMS.BB_TEX_WIDTH;
    canvas.height = HODO_BG_DIMS.BB_TEX_HEIGHT;

    let ctx = canvas.getContext('2d');

    if (ctx === null) {
        throw "Could not get rendering context for the hodograph background canvas";
    }

    ctx.lineWidth = line_width;

    for (let irng = HODO_BG_DIMS.BB_TEX_WIDTH / 4; irng <= HODO_BG_DIMS.BB_TEX_WIDTH / 2; irng += HODO_BG_DIMS.BB_TEX_WIDTH / 4) {
        ctx.beginPath();
        ctx.arc(HODO_BG_DIMS.BB_TEX_WIDTH / 2, HODO_BG_DIMS.BB_TEX_WIDTH / 2, irng - line_width / 2, 0, 2 * Math.PI);
        ctx.stroke();
    }

    const ctr_x = HODO_BG_DIMS.BB_TEX_WIDTH / 2, ctr_y = HODO_BG_DIMS.BB_TEX_WIDTH / 2;
    const arrow_size = 20
    ctx.beginPath()
    ctx.moveTo(ctr_x, ctr_y);
    ctx.lineTo(ctr_x + arrow_size / 2, ctr_y + arrow_size);
    ctx.lineTo(ctr_x - arrow_size / 2, ctr_y + arrow_size);
    ctx.lineTo(ctr_x, ctr_y);
    ctx.fill()

    return canvas;
};

const HODO_CMAP = new ColorMap([0, 1, 3, 6, 9], ['#ffffcc', '#a1dab4', '#41b6c4', '#225ea8']);

interface HodographOptions {
    /** 
     * The color of the hodograph plot background as a hex string
     * @default '#000000'
     */
    bgcolor?: string;

    /** 
     * How much to thin the hodographs at zoom level 1 on the map. This effectively means to plot every `n`th hodograph in the i and j directions, where `n` = 
     * `thin_fac`. `thin_fac` should be a power of 2. 
     * @default 1
     */
    thin_fac?: number;

    /**
     * The width of the hodograph line in pixels
     * @default 2.5
     */
    hodo_line_width: number;

    /**
     * The width of the lines on the background in pixels
     * @default 1.5
     */
    background_line_width: number;

    /**
     * The colormap to use for the heights on the hodograph. Default is a yellow-blue colormap.
     */
    height_cmap: ColorMap;
}

const hodograph_opt_defaults: Required<HodographOptions> = {
    bgcolor: '#000000',
    thin_fac: 1,
    hodo_line_width: 2.5,
    background_line_width: 1.5,
    height_cmap: HODO_CMAP
}

interface HodographGLElems<ArrayType extends TypedArray, MapType extends MapLikeType> {
    gl: WebGLAnyRenderingContext;
    map: MapType;
    bg_billboard: BillboardCollection<ArrayType>;
}

/** A class representing a field of hodograph plots */
class Hodographs<MapType extends MapLikeType> extends PlotComponent<MapType> {
    private profile_field: RawProfileField;
    public readonly opts: Required<HodographOptions>;

    private gl_elems: HodographGLElems<Float16Array, MapType> | null;
    private line_elems: {hodo_line: PolylineCollection, sm_line: PolylineCollection} | null;
    private hodo_bg_texture: HTMLCanvasElement;
    private readonly hodo_scale;
    private readonly bg_size;

    /**
     * Create a field of hodographs
     * @param profile_field - The grid of profiles to plot
     * @param opts          - Various options to use when creating the hodographs 
     */
    constructor(profile_field: RawProfileField, opts?: HodographOptions) {
        super();
        
        this.profile_field = profile_field;
        this.opts = normalizeOptions(opts, hodograph_opt_defaults);

        this.hodo_bg_texture = _createHodoBackgroundTexture(this.opts.background_line_width * LINE_WIDTH_MULTIPLIER);
        this.hodo_scale = (HODO_BG_DIMS.BB_TEX_WIDTH - this.opts.background_line_width / 2) / (HODO_BG_DIMS.BB_TEX_WIDTH * BG_MAX_RING_MAG);
        this.bg_size = 140;

        this.gl_elems = null;
        this.line_elems = null;
    }

    /**
     * Update the profiles displayed
     * @param field - The new profiles to display as hodographs
     */
    public async updateField(field: RawProfileField) {
        this.profile_field = field;

        if (this.gl_elems === null) return;
        // XXX: This might leak VRAM
        const gl = this.gl_elems.gl;

        this.gl_elems.bg_billboard.updateField(field.getStormMotionGrid());

        const profiles = this.profile_field.profiles;
        
        const hodo_polyline = profiles.map(prof => {
            const zoom = getMinZoom(prof['jlat'], prof['ilon'], this.opts.thin_fac);

            return {
                'offsets': [...prof['u']].map((u, ipt) => [u - prof['smu'], prof['v'][ipt] - prof['smv']]),
                'vertices': [...prof['u']].map(u => [prof['lon'], prof['lat']]),
                'zoom': zoom,
                'data': [...prof['z']],
            } as LineData;
        });

        const hodo_line = await PolylineCollection.make(gl, hodo_polyline, {line_width: this.opts.hodo_line_width, cmap: this.opts.height_cmap, offset_scale: this.hodo_scale * this.bg_size});

        const sm_polyline = profiles.map(prof => {
            const zoom = getMinZoom(prof['jlat'], prof['ilon'], this.opts.thin_fac);

            const sm_mag = Math.hypot(prof['smu'], prof['smv']);
            const sm_ang = Math.PI / 2 - Math.atan2(-prof['smv'], -prof['smu']);
            const buffer = 2

            return {
                'offsets': [[buffer * Math.sin(sm_ang), buffer * Math.cos(sm_ang)], 
                              [sm_mag * Math.sin(sm_ang), sm_mag * Math.cos(sm_ang)]],
                'vertices': [[prof['lon'], prof['lat']], [prof['lon'], prof['lat']]],
                'zoom': zoom
            } as LineData;
        });

        const sm_line = await PolylineCollection.make(gl, sm_polyline, {line_width: this.opts.background_line_width, color: this.opts.bgcolor, offset_scale: this.hodo_scale * this.bg_size});

        this.line_elems = {
            hodo_line: hodo_line, sm_line: sm_line
        }
    }

    /**
     * @internal
     * Add the hodographs to a map
     */
    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        const bg_image = {'format': gl.RGBA, 'type': gl.UNSIGNED_BYTE, 'image': this.hodo_bg_texture, 'mag_filter': gl.NEAREST};
        const max_zoom = map.getMaxZoom();

        const bg_billboard = new BillboardCollection(this.profile_field.getStormMotionGrid(), this.opts.thin_fac, max_zoom, bg_image, HODO_BG_DIMS, this.bg_size * 0.004,
                                                     {color: Color.fromHex(this.opts.bgcolor)});
        await bg_billboard.setup(gl);

        this.gl_elems = {
            gl: gl, map: map, bg_billboard: bg_billboard
        };

        this.updateField(this.profile_field);
    }

    /**
     * @internal
     * Render the hodographs
     */
    public render(gl: WebGLAnyRenderingContext, matrix: number[] | Float32Array) {
        if (this.gl_elems === null || this.line_elems === null) return;
        const gl_elems = this.gl_elems;
        const line_elems = this.line_elems;

        const zoom = gl_elems.map.getZoom();
        const map_width = gl_elems.map.getCanvas().width;
        const map_height = gl_elems.map.getCanvas().height;
        const bearing = gl_elems.map.getBearing();
        const pitch = gl_elems.map.getPitch();

        line_elems.hodo_line.render(gl, matrix, [map_width, map_height], zoom, bearing, pitch);
        line_elems.sm_line.render(gl, matrix, [map_width, map_height], zoom, bearing, bearing);
        gl_elems.bg_billboard.render(gl, matrix, [map_width, map_height], zoom, bearing, pitch);
    }
}

export default Hodographs;
export type {HodographOptions};