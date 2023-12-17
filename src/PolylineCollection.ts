
import { WGLBuffer, WGLProgram, WGLTexture, WGLTextureSpec } from "autumn-wgl";
import { Polyline, LineData, WebGLAnyRenderingContext } from "./AutumnTypes";
import { ColorMap, makeTextureImage } from "./Colormap";
import { layer_worker } from "./PlotComponent";
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
        const polylines = await layer_worker.makePolyLines(lines);
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