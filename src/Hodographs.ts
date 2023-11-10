
import { PlotComponent, layer_worker } from "./PlotComponent";
import { PolylineCollection, LineSpec} from "./PolylineCollection";
import { BillboardCollection } from "./BillboardCollection";
import { getMinZoom, hex2rgba } from './utils';
import { LngLat, MapType } from "./Map";
import { RawProfileField } from "./RawField";
import { TypedArray, WebGLAnyRenderingContext } from "./AutumnTypes";
import { Float16Array } from "@petamoriken/float16";

const LINE_WIDTH = 4;
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

function _createHodoBackgroundTexture() {
    let canvas = document.createElement('canvas');

    canvas.width = HODO_BG_DIMS.BB_TEX_WIDTH;
    canvas.height = HODO_BG_DIMS.BB_TEX_HEIGHT;

    let ctx = canvas.getContext('2d');

    if (ctx === null) {
        throw "Could not get rendering context for the hodograph background canvas";
    }

    ctx.lineWidth = LINE_WIDTH;

    for (let irng = HODO_BG_DIMS.BB_TEX_WIDTH / 4; irng <= HODO_BG_DIMS.BB_TEX_WIDTH / 2; irng += HODO_BG_DIMS.BB_TEX_WIDTH / 4) {
        ctx.beginPath();
        ctx.arc(HODO_BG_DIMS.BB_TEX_WIDTH / 2, HODO_BG_DIMS.BB_TEX_WIDTH / 2, irng - LINE_WIDTH / 2, 0, 2 * Math.PI);
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

let HODO_BG_TEXTURE: HTMLCanvasElement | null = null;

const HODO_COLORS = [
    {'bounds': [0, 1], 'color': '#ffffcc'}, 
    {'bounds': [1, 3], 'color': '#a1dab4'},
    {'bounds': [3, 6], 'color': '#41b6c4'},
    {'bounds': [6, 9], 'color': '#225ea8'}
];

function _createHodoHeightTexture() {
    let canvas = document.createElement('canvas');

    canvas.width = Math.max(...HODO_COLORS.map(s => Math.max(...s['bounds'])));
    canvas.height = 1;

    let ctx = canvas.getContext('2d');

    HODO_COLORS.forEach(stop => {
        if (ctx === null) {
            throw "Could not get rendering context for the hodograph height texture canvas";
        }

        const [clb, cub] = stop['bounds'];
        ctx.fillStyle = stop['color'];
        ctx.fillRect(clb, 0, cub - clb, 1);
    });

    return canvas;
}

let HODO_HEIGHT_TEXTURE: HTMLCanvasElement | null = null;

interface HodographOptions {
    /** 
     * The color of the hodograph plot background as a hex string
     */
    bgcolor?: string;

    /** 
     * How much to thin the hodographs at zoom level 1 on the map. This effectively means to plot every `n`th hodograph in the i and j directions, where `n` = 
     * `thin_fac`. `thin_fac` should be a power of 2. 
     * @default 1
     */
    thin_fac?: number;
}

interface HodographGLElems<ArrayType extends TypedArray> {
    map: MapType;
    bg_billboard: BillboardCollection<ArrayType> | null;
    hodo_line: PolylineCollection | null;
    sm_line: PolylineCollection | null;
}

/** A class representing a a field of hodograph plots */
class Hodographs extends PlotComponent {
    private readonly profile_field: RawProfileField;
    public readonly bgcolor: [number, number, number];
    public readonly thin_fac: number;

    private gl_elems: HodographGLElems<Float16Array>;

    /**
     * Create a field of hodographs
     * @param profile_field - The grid of profiles to plot
     * @param opts          - Various options to use when creating the hodographs 
     */
    constructor(profile_field: RawProfileField, opts?: HodographOptions) {
        super();

        opts = opts || {};
        
        this.profile_field = profile_field;

        const color = hex2rgba(opts.bgcolor || '#000000');
        this.bgcolor = [color[0], color[1], color[2]];
        this.thin_fac = opts.thin_fac || 1;

        this.gl_elems = null;
    }

    /**
     * @internal
     * Add the hodographs to a map
     */
    public async onAdd(map: mapboxgl.Map, gl: WebGLAnyRenderingContext) {
        const hodo_scale = (HODO_BG_DIMS.BB_TEX_WIDTH - LINE_WIDTH / 2) / (HODO_BG_DIMS.BB_TEX_WIDTH * BG_MAX_RING_MAG);
        const bg_size = 140;

        if (HODO_BG_TEXTURE === null) {
            HODO_BG_TEXTURE = _createHodoBackgroundTexture();
        }

        const bg_image = {'format': gl.RGBA, 'type': gl.UNSIGNED_BYTE, 'image': HODO_BG_TEXTURE, 'mag_filter': gl.NEAREST};
        const max_zoom = map.getMaxZoom();

        const bg_billboard = new BillboardCollection(gl, this.profile_field.getStormMotionGrid(), this.thin_fac, max_zoom, bg_image, HODO_BG_DIMS, this.bgcolor, 
                                                    bg_size * 0.004);

        const hodo_polyline = await layer_worker.makePolyLines(this.profile_field.profiles.map(prof => {
            const pt_ll = new LngLat(prof['lon'], prof['lat']).toMercatorCoord();

            const zoom = getMinZoom(prof['jlat'], prof['ilon'], this.thin_fac);
            const max_tex_z = Math.max(...HODO_COLORS.map(s => Math.max(...s['bounds'])))

            return {
                'verts': [...prof['u']].map((u, ipt) => [u - prof['smu'], prof['v'][ipt] - prof['smv']]),
                'origin': [pt_ll.x, pt_ll.y],
                'zoom': zoom,
                'texcoords': [...prof['z']].map(z => [z /  max_tex_z, 0.5])
            } as LineSpec;
        }));

        if (HODO_HEIGHT_TEXTURE === null) {
            HODO_HEIGHT_TEXTURE = _createHodoHeightTexture();
        }

        const height_image = {'format': gl.RGBA, 'type': gl.UNSIGNED_BYTE, 'image': HODO_HEIGHT_TEXTURE, 'mag_filter': gl.NEAREST};
        const hodo_line = new PolylineCollection(gl, hodo_polyline, height_image, 1.5, hodo_scale * bg_size);

        const sm_polyline = await layer_worker.makePolyLines(this.profile_field.profiles.map(prof => {
            const pt_ll = new LngLat(prof['lon'], prof['lat']).toMercatorCoord();
            let ret = {};

            const zoom = getMinZoom(prof['jlat'], prof['ilon'], this.thin_fac);

            const sm_mag = Math.hypot(prof['smu'], prof['smv']);
            const sm_ang = Math.PI / 2 - Math.atan2(-prof['smv'], -prof['smu']);
            const buffer = 2

            return {
                'verts': [[buffer * Math.sin(sm_ang), buffer * Math.cos(sm_ang)], 
                          [sm_mag * Math.sin(sm_ang), sm_mag * Math.cos(sm_ang)]],
                'origin': [pt_ll.x, pt_ll.y],
                'zoom': zoom,
                'texcoords': [[0.5, 0.5], [0.5, 0.5]]
            } as LineSpec;
        }));

        let byte_color = this.bgcolor.map(c => c * 255);
        byte_color.push(255)
        const sm_image = {'format': gl.RGBA, 'type': gl.UNSIGNED_BYTE, 'width': 1, 'height': 1, 'image': new Uint8Array(byte_color), 
                          'mag_filter': gl.NEAREST}

        const sm_line = new PolylineCollection(gl, sm_polyline, sm_image, 1, hodo_scale * bg_size);

        this.gl_elems = {
            map: map, bg_billboard: bg_billboard, hodo_line: hodo_line, sm_line: sm_line
        };
    }

    /**
     * @internal
     * Render the hodographs
     */
    public render(gl: WebGLAnyRenderingContext, matrix: number[]) {
        if (this.gl_elems === null) return;
        const gl_elems = this.gl_elems;

        const zoom = gl_elems.map.getZoom();
        const map_width = gl_elems.map.getCanvas().width;
        const map_height = gl_elems.map.getCanvas().height;
        const bearing = gl_elems.map.getBearing();
        const pitch = gl_elems.map.getPitch();

        gl_elems.hodo_line.render(gl, matrix, [map_width, map_height], zoom, bearing, pitch);
        gl_elems.sm_line.render(gl, matrix, [map_width, map_height], zoom, bearing, bearing);
        gl_elems.bg_billboard.render(gl, matrix, [map_width, map_height], zoom, bearing, pitch);
    }
}

export default Hodographs;
export type {HodographOptions};