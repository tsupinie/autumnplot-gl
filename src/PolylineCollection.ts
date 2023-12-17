
import { WGLBuffer, WGLProgram, WGLTexture, WGLTextureSpec } from "autumn-wgl";
import { PolylineSpec, LineSpec, WebGLAnyRenderingContext } from "./AutumnTypes";
import { ColorMap, makeTextureImage } from "./Colormap";
import { Cache, hex2rgba } from "./utils";

function preprocessShader(shader_src: string, opts?: {define?: string[]}) {
    opts = opts === undefined ? {} : opts;
    const defines = opts.define === undefined ? [] : [...opts.define];

    const current_defines: string[] = [];
    const define_truth: Record<string, boolean> = {};

    const processed_shader_src = shader_src.split("\n").map(line => {
        const match_define = line.match(/#define\s+([\w\d_]+)/i);
        if (match_define !== null) {
            defines.push(match_define[1]);
        }

        const match_ifdef = line.match(/#ifdef\s+([\w\d_]+)/i);
        if (match_ifdef !== null) {
            current_defines.push(match_ifdef[1]);
            define_truth[match_ifdef[1]] = true;
            return "";
        }

        const match_ifndef = line.match(/#ifndef\s+([\w\d_]+)/i);
        if (match_ifndef !== null) {
            current_defines.push(match_ifndef[1]);
            define_truth[match_ifndef[1]] = false;
            return "";
        }

        const match_else = line.match(/#else/i);
        if (match_else !== null) {
            const def = current_defines[current_defines.length - 1];
            define_truth[def] = !define_truth[def];
            return "";
        }

        const match_endif = line.match(/#endif/i);
        if (match_endif !== null) {
            const def = current_defines.pop();
            define_truth[def] = undefined;
            return "";
        }

        const keep_line = current_defines.map(def => defines.includes(def) == define_truth[def]).reduce((a, b) => a && b, true)
        return keep_line ? line : "";
    }).join("\n");

    if (current_defines.length > 0) {
        throw `Unterminated #ifdef/#ifndef block in shader`;
    }

    return processed_shader_src;
}

const polyline_vertex_src = require('./glsl/polyline_vertex.glsl');
const polyline_fragment_src = require('./glsl/polyline_fragment.glsl');
const program_cache = new Cache((gl: WebGLAnyRenderingContext, preprocessor_defines: string[]) => {
    return new WGLProgram(gl, preprocessShader(polyline_vertex_src, {define: preprocessor_defines}), 
                              preprocessShader(polyline_fragment_src, {define: preprocessor_defines}));
});

type LineData = {
    vertices: [number, number][];
    offsets?: [number, number][];
    data?: number[];
    zoom?: number;
}

type Polyline = {
    extrusion: Float32Array;
    vertices: Float32Array;
    offsets?: Float32Array;
    data?: Float32Array;
    zoom?: Float32Array;
};

function makePolylines(lines: LineData[]) : Polyline {
    const n_points_per_vert = Object.fromEntries(Object.entries(lines[0]).map(([k, v]) => {
        let n_verts: number;
        if (typeof v === 'number') {
            n_verts = 1;
        }
        else if (typeof v[0] === 'number') {
            n_verts = 1;
        }
        else {
            n_verts = v[0].length;
        }
        return [k, n_verts];
    }));
    n_points_per_vert['extrusion'] = 2;
    n_points_per_vert['vertices'] += 1;

    const n_verts = lines.map(l => l.vertices.length).reduce((a, b) => a + b);
    const n_out_verts = (n_verts - lines.length) * 6;
    const ary_lens = Object.fromEntries(Object.entries(n_points_per_vert).map(([k, nppv]) => [k, n_out_verts * nppv]));

    let ret: Polyline = {
        vertices: new Float32Array(ary_lens['vertices']),
        extrusion: new Float32Array(ary_lens['extrusion']),
    }

    if ('offsets' in lines[0]) {
        ret.offsets = new Float32Array(ary_lens['offsets']);
    }

    if ('data' in lines[0]) {
        ret.data = new Float32Array(ary_lens['data']);
    }

    if ('zoom' in lines[0]) {
        ret.zoom = new Float32Array(ary_lens['zoom']);
    }

    let ilns = Object.fromEntries(Object.keys(ary_lens).map(k => [k, 0]));

    const compute_normal_vec = (pt1: [number, number], pt2: [number, number]) => {
        const line_vec_x = pt2[0] - pt1[0];
        const line_vec_y = pt2[1] - pt1[1];
        const line_vec_mag = Math.hypot(line_vec_x, line_vec_y);

        return [line_vec_y / line_vec_mag, -line_vec_x / line_vec_mag];
    }

    lines.forEach(line => {
        const extrusion_verts = line.offsets === undefined ? line.vertices : line.offsets;
        const verts = line.vertices;

        let pt_prev: [number, number], pt_this = verts[0], pt_next = verts[1];
        let ept_prev: [number, number], ept_this = extrusion_verts[0], ept_next = extrusion_verts[1];
        let len_prev: number, len_this = 0;
        let [ext_x, ext_y] = compute_normal_vec(ept_this, ept_next);

        ret.vertices[ilns.vertices++] = pt_this[0]; ret.vertices[ilns.vertices++] = pt_this[1]; ret.vertices[ilns.vertices++] = len_this;
        ret.extrusion[ilns.extrusion++] = ext_x; ret.extrusion[ilns.extrusion++] = ext_y;

        for (let ivt = 1; ivt < verts.length; ivt++) {
            pt_this = verts[ivt]; pt_prev = verts[ivt - 1];
            ept_this = extrusion_verts[ivt]; ept_prev = extrusion_verts[ivt - 1];

            [ext_x, ext_y] = compute_normal_vec(ept_prev, ept_this);
            len_prev = len_this; len_this += Math.hypot(verts[ivt - 1][0] - verts[ivt][0], verts[ivt - 1][1] - verts[ivt][1]);

            ret.vertices[ilns.vertices++] = pt_prev[0]; ret.vertices[ilns.vertices++] = pt_prev[1]; ret.vertices[ilns.vertices++] = len_prev;
            ret.vertices[ilns.vertices++] = pt_prev[0]; ret.vertices[ilns.vertices++] = pt_prev[1]; ret.vertices[ilns.vertices++] = len_prev;

            ret.vertices[ilns.vertices++] = pt_this[0]; ret.vertices[ilns.vertices++] = pt_this[1]; ret.vertices[ilns.vertices++] = len_this;
            ret.vertices[ilns.vertices++] = pt_this[0]; ret.vertices[ilns.vertices++] = pt_this[1]; ret.vertices[ilns.vertices++] = len_this;

            ret.extrusion[ilns.extrusion++] =  ext_x; ret.extrusion[ilns.extrusion++] =  ext_y;
            ret.extrusion[ilns.extrusion++] = -ext_x; ret.extrusion[ilns.extrusion++] = -ext_y;

            ret.extrusion[ilns.extrusion++] =  ext_x; ret.extrusion[ilns.extrusion++] =  ext_y;
            ret.extrusion[ilns.extrusion++] = -ext_x; ret.extrusion[ilns.extrusion++] = -ext_y;
        }

        ret.vertices[ilns.vertices++] = pt_this[0]; ret.vertices[ilns.vertices++] = pt_this[1]; ret.vertices[ilns.vertices++] = len_this;
        ret.extrusion[ilns.extrusion++] = -ext_x; ret.extrusion[ilns.extrusion++] = -ext_y;

        if ('offsets' in ret) {
            const offsets = line.offsets;
            let off_prev: [number, number], off_this = offsets[0];

            ret.offsets[ilns.offsets++] = off_this[0]; ret.offsets[ilns.offsets++] = off_this[1];

            for (let ivt = 1; ivt < offsets.length; ivt++) {
                off_this = offsets[ivt]; off_prev = offsets[ivt - 1];

                ret.offsets[ilns.offsets++] = off_prev[0]; ret.offsets[ilns.offsets++] = off_prev[1];
                ret.offsets[ilns.offsets++] = off_prev[0]; ret.offsets[ilns.offsets++] = off_prev[1];
                ret.offsets[ilns.offsets++] = off_this[0]; ret.offsets[ilns.offsets++] = off_this[1];
                ret.offsets[ilns.offsets++] = off_this[0]; ret.offsets[ilns.offsets++] = off_this[1];
            }

            ret.offsets[ilns.offsets++] = off_this[0]; ret.offsets[ilns.offsets++] = off_this[1];
        }

        if ('data' in ret) {
            const data = line.data;
            let data_prev: number, data_this = data[0];

            ret.data[ilns.data++] = data_this;
            
            for (let ivt = 1; ivt < data.length; ivt++) {
                data_this = data[ivt]; data_prev = data[ivt - 1];

                ret.data[ilns.data++] = data_prev;
                ret.data[ilns.data++] = data_prev;
                ret.data[ilns.data++] = data_this;
                ret.data[ilns.data++] = data_this;
            }

            ret.data[ilns.data++] = data_this;
        }
        
        if ('zoom' in ret) {
            for (let ivt = 0; ivt < verts.length * 4; ivt++) {
                ret.zoom[ilns.zoom++] = line['zoom'];
            }
        }
    })

    return ret;
}

interface PolylineCollectionOpts {
    offset_scale?: number;
    color?: string;
    cmap?: ColorMap;
    line_width?: number;
}

class PolylineCollection {
    public readonly width: number;
    public readonly scale: number | null;

    private readonly program: WGLProgram;

    private readonly vertices: WGLBuffer;
    private readonly extrusion: WGLBuffer;

    private readonly offset: WGLBuffer | null;
    private readonly min_zoom: WGLBuffer | null;
    private readonly line_data: WGLBuffer | null;
    private readonly line_texture: WGLTexture | null;
    private readonly color: [number, number, number, number];
    private readonly cmap_min: number;
    private readonly cmap_max: number;

    private constructor(gl: WebGLAnyRenderingContext, polyline: Polyline, opts: PolylineCollectionOpts) {
        opts = opts === undefined ? {} : opts;
        this.color = opts.color === undefined ? [0., 0., 0., 1.] : hex2rgba(opts.color);
        const line_width = opts.line_width === undefined ? 1 : opts.line_width;

        this.width = line_width;

        const shader_defines = [];

        this.vertices = new WGLBuffer(gl, polyline['vertices'], 3, gl.TRIANGLE_STRIP);
        this.extrusion = new WGLBuffer(gl, polyline['extrusion'], 2, gl.TRIANGLE_STRIP);

        if (polyline.offsets !== undefined) {
            this.offset = new WGLBuffer(gl, polyline.offsets, 2, gl.TRIANGLE_STRIP);
            this.scale = opts.offset_scale === undefined ? 1 : opts.offset_scale;
            shader_defines.push('OFFSET');
        }
        else {
            this.offset = null;
            this.scale = null;
        }

        if (polyline.zoom !== undefined) {
            this.min_zoom = new WGLBuffer(gl, polyline.zoom, 1, gl.TRIANGLE_STRIP);
            shader_defines.push('ZOOM');
        }
        else {
            this.min_zoom = null;
        }

        this.cmap_min = -3.40282347e+38;
        this.cmap_max = 3.40282347e+38;

        if (polyline.data !== undefined) {
            this.min_zoom = new WGLBuffer(gl, polyline.zoom, 1, gl.TRIANGLE_STRIP);
            shader_defines.push('DATA');

            let tex_image: WGLTextureSpec
            if (opts.cmap === undefined) {
                tex_image = {'format': gl.RGBA, 'type': gl.UNSIGNED_BYTE, 'width': 1, 'height': 1, 'image': new Uint8Array(this.color), 'mag_filter': gl.NEAREST};
            }
            else {
                tex_image = {'format': gl.RGBA, 'type': gl.UNSIGNED_BYTE, 'image': makeTextureImage(opts.cmap), 'mag_filter': gl.NEAREST};
                this.cmap_min = opts.cmap.levels[0];
                this.cmap_max = opts.cmap.levels[opts.cmap.levels.length - 1];
            }
    
            this.line_texture = new WGLTexture(gl, tex_image);
            this.line_data = new WGLBuffer(gl, polyline['data'], 1, gl.TRIANGLE_STRIP);
        }
        else {
            this.line_texture = null;
            this.line_data = null;
        }

        this.program = program_cache.getValue(gl, shader_defines);
    }

    static async make(gl: WebGLAnyRenderingContext, lines: LineData[], opts?: PolylineCollectionOpts) {
        const polylines = makePolylines(lines);
        return new PolylineCollection(gl, polylines, opts);
    }

    public render(gl: WebGLAnyRenderingContext, matrix: number[], [map_width, map_height]: [number, number], map_zoom: number, map_bearing: number, map_pitch: number) {
        const attributes: Record<string, WGLBuffer> = {'a_pos': this.vertices, 'a_extrusion': this.extrusion};
        const uniforms: Record<string, number | number[]> = {'u_matrix': matrix, 'u_line_width': this.width, 'u_map_aspect': map_height / map_width, 'u_map_bearing': map_bearing};
        const textures: Record<string, WGLTexture> = {};

        if (this.offset !== null) {
            attributes['a_offset'] = this.offset;
            uniforms['u_offset_scale'] = this.scale * (map_height / map_width);
        }

        if (this.min_zoom !== null) {
            attributes['a_min_zoom'] = this.min_zoom;
            uniforms['u_zoom'] = map_zoom;
        }

        if (this.line_data !== null && this.line_texture !== null) {
            attributes['a_data'] = this.line_data;
            textures['u_sampler'] = this.line_texture;
            uniforms['u_cmap_min'] = this.cmap_min;
            uniforms['u_cmap_max'] = this.cmap_max;
        }
        else {
            uniforms['u_color'] = this.color;
        }

        this.program.use(attributes, uniforms, textures);

        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        this.program.draw();
    }
}

export {PolylineCollection};
export type {PolylineSpec, LineSpec, LineData};