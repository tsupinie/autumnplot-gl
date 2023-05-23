
import { PlotComponent, layer_worker } from "./PlotComponent";
import { PolylineCollection, LineSpec} from "./PolylineCollection";
import { BillboardCollection } from "./BillboardCollection";
import { getMinZoom, hex2rgba } from './utils';
import { LngLat } from "./Map";
import { RawProfileField } from "./RawField";

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

const HODO_BG_TEXTURE = _createHodoBackgroundTexture();

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

const HODO_HEIGHT_TEXTURE = _createHodoHeightTexture();

/** A class representing a a field of hodograph plots */
class Hodographs extends PlotComponent {
    readonly profile_field: RawProfileField;
    readonly bgcolor: [number, number, number];
    readonly thin_fac: number;

    /** @private */
    map: mapboxgl.Map | null;
    /** @private */
    bg_billboard: BillboardCollection | null;
    /** @private */
    hodo_line: PolylineCollection | null;
    /** @private */
    sm_line: PolylineCollection | null;

    /**
     * Create a field of hodographs
     * @param profiles - A list of profiles to use
     * @param opts     - Various options to use when creating the hodographs 
     */
    constructor(profile_field: RawProfileField, opts: {'bgcolor': string, 'thin_fac': number}) {
        super();
        
        this.profile_field = profile_field;

        const color = hex2rgba(opts['bgcolor']);
        this.bgcolor = [color[0], color[1], color[2]];
        this.thin_fac = opts['thin_fac'];

        this.map = null;
        this.bg_billboard = null;
        this.hodo_line = null;
        this.sm_line = null;
    }

    async onAdd(map: mapboxgl.Map, gl: WebGLRenderingContext) {
        this.map = map;

        const hodo_scale = (HODO_BG_DIMS.BB_TEX_WIDTH - LINE_WIDTH / 2) / (HODO_BG_DIMS.BB_TEX_WIDTH * BG_MAX_RING_MAG);
        const bg_size = 140;

        const bg_image = {'format': gl.RGBA, 'type': gl.UNSIGNED_BYTE, 'image': HODO_BG_TEXTURE, 'mag_filter': gl.NEAREST};
        const max_zoom = map.getMaxZoom();

        this.bg_billboard = new BillboardCollection(gl, this.profile_field.getStormMotionGrid(), this.thin_fac, max_zoom, bg_image, HODO_BG_DIMS, this.bgcolor, 
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

        const height_image = {'format': gl.RGBA, 'type': gl.UNSIGNED_BYTE, 'image': HODO_HEIGHT_TEXTURE, 'mag_filter': gl.NEAREST};
        this.hodo_line = new PolylineCollection(gl, hodo_polyline, height_image, 1.5, hodo_scale * bg_size);

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

        this.sm_line = new PolylineCollection(gl, sm_polyline, sm_image, 1, hodo_scale * bg_size);
    }

    render(gl: WebGLRenderingContext, matrix: number[]) {
        if (this.map === null || this.hodo_line === null || this.sm_line === null || this.bg_billboard === null) return;

        const zoom = this.map.getZoom();
        const map_width = this.map.getCanvas().width;
        const map_height = this.map.getCanvas().height;
        const bearing = this.map.getBearing();
        const pitch = this.map.getPitch();

        this.hodo_line.render(gl, matrix, [map_width, map_height], zoom, bearing, pitch);
        this.sm_line.render(gl, matrix, [map_width, map_height], zoom, bearing, bearing);
        this.bg_billboard.render(gl, matrix, [map_width, map_height], zoom, bearing, pitch);
    }
}

export default Hodographs;