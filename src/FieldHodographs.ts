
import { Field, layer_worker } from "./Field";
import { PolylineCollection, LineSpec} from "./PolylineCollection";
import { BillboardCollection, BillboardSpec } from "./BillboardCollection";
import { WindProfile } from "./AutumnFieldTypes";
import { getMinZoom, hex2rgba } from './utils';
import { LngLat } from "./AutumnMap";

const HODO_BG_DIMS = {
    'TEX_SIZE': 256,
    'LINE_WIDTH': 4,
}

function _createHodoBackgroundTexture() {
    let canvas = document.createElement('canvas');

    canvas.width = HODO_BG_DIMS['TEX_SIZE'];
    canvas.height = HODO_BG_DIMS['TEX_SIZE'];

    let ctx = canvas.getContext('2d');

    if (ctx === null) {
        throw "Could not get rendering context for the hodograph background canvas";
    }

    ctx.lineWidth = HODO_BG_DIMS['LINE_WIDTH'];

    for (let irng = HODO_BG_DIMS['TEX_SIZE'] / 4; irng <= HODO_BG_DIMS['TEX_SIZE'] / 2; irng += HODO_BG_DIMS['TEX_SIZE'] / 4) {
        ctx.beginPath();
        ctx.arc(HODO_BG_DIMS['TEX_SIZE'] / 2, HODO_BG_DIMS['TEX_SIZE'] / 2, irng - HODO_BG_DIMS['LINE_WIDTH'] / 2, 0, 2 * Math.PI);
        ctx.stroke();
    }

    const ctr_x = HODO_BG_DIMS['TEX_SIZE'] / 2, ctr_y = HODO_BG_DIMS['TEX_SIZE'] / 2;
    const arrow_size = 20
    ctx.beginPath()
    ctx.moveTo(ctr_x, ctr_y);
    ctx.lineTo(ctr_x + arrow_size, ctr_y - arrow_size / 2);
    ctx.lineTo(ctr_x + arrow_size, ctr_y + arrow_size / 2);
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
class FieldHodographs extends Field {
    readonly profiles: WindProfile[];
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
    constructor(profiles: WindProfile[], opts: {'bgcolor': string, 'thin_fac': number}) {
        super();
        
        this.profiles = profiles;

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

        const hodo_scale = (HODO_BG_DIMS['TEX_SIZE'] - HODO_BG_DIMS['LINE_WIDTH'] / 2) / (HODO_BG_DIMS['TEX_SIZE'] * 40);
        const bg_size = 140;

        const bg_elements = this._getHodoBackgroundElements();
        const bg_image = {'format': gl.RGBA, 'type': gl.UNSIGNED_BYTE, 'image': HODO_BG_TEXTURE, 'mag_filter': gl.NEAREST};

        this.bg_billboard = new BillboardCollection(gl, bg_elements, bg_image, [bg_size, bg_size], this.bgcolor);

        const hodo_polyline = await layer_worker.makePolyLines(this.profiles.map(prof => {
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

        const sm_polyline = await layer_worker.makePolyLines(this.profiles.map(prof => {
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

    _getHodoBackgroundElements() : BillboardSpec {
        const background_pts = new Float32Array(this.profiles.map(prof => {
            const pt_ll = new LngLat(prof['lon'], prof['lat']).toMercatorCoord();
            const zoom = getMinZoom(prof['jlat'], prof['ilon'], this.thin_fac);
            return [pt_ll.x, pt_ll.y, zoom,   pt_ll.x, pt_ll.y, zoom,   pt_ll.x, pt_ll.y, zoom,   
                    pt_ll.x, pt_ll.y, zoom,   pt_ll.x, pt_ll.y, zoom,   pt_ll.x, pt_ll.y, zoom,];
        }).flat());

        const background_offset = new Float32Array(this.profiles.map(prof => {
            const sm_ang = 90 - Math.atan2(-prof['smv'], -prof['smu']) * 180 / Math.PI;
            return [0, sm_ang,   0, sm_ang,   1, sm_ang,   2, sm_ang,   3, sm_ang,   3, sm_ang];
        }).flat());

        const bg_tex_coords = new Float32Array(this.profiles.map(prof => {
            return [0., 0.,  0., 0.,   0., 1.,   1., 0.,   1., 1.,   1., 1.];
        }).flat());

        return {'pts': background_pts, 'offset': background_offset, 'tex_coords': bg_tex_coords};
    }
}

export default FieldHodographs;