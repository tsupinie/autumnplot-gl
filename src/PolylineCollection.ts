
import { WGLBuffer, WGLProgram, WGLTexture } from "autumn-wgl";
import { Polyline, LineData, WebGLAnyRenderingContext } from "./AutumnTypes";
import { ColorMap, ColorMapGPUInterface } from "./Colormap";
import { Color } from "./Color";
import { layer_worker } from "./PlotComponent";

const polyline_vertex_src = require('./glsl/polyline_vertex.glsl');
const polyline_fragment_src = require('./glsl/polyline_fragment.glsl');

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
    private readonly color: Color;
    private readonly cmap_gpu: ColorMapGPUInterface | null;

    private constructor(gl: WebGLAnyRenderingContext, polyline: Polyline, opts: PolylineCollectionOpts) {
        opts = opts === undefined ? {} : opts;
        const color_hex = opts.color === undefined ? '#000000' : opts.color;
        this.color = Color.fromHex(color_hex);

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

        let fragment_src = polyline_fragment_src;
        if (polyline.data !== undefined) {
            shader_defines.push('DATA');

            this.line_data = new WGLBuffer(gl, polyline.data, 1, gl.TRIANGLE_STRIP);

            const cmap = opts.cmap === undefined ? new ColorMap([0, 1], [color_hex], {overflow_color: color_hex, underflow_color: color_hex}) : opts.cmap;
            this.cmap_gpu = new ColorMapGPUInterface(cmap);
            this.cmap_gpu.setupShaderVariables(gl, gl.NEAREST);

            fragment_src = ColorMapGPUInterface.applyShader(fragment_src);
        }
        else {
            this.line_data = null;
            this.cmap_gpu = null;
        }

        this.program = new WGLProgram(gl, polyline_vertex_src, fragment_src, {define: shader_defines});
    }

    static async make(gl: WebGLAnyRenderingContext, lines: LineData[], opts?: PolylineCollectionOpts) {
        const polylines = await layer_worker.makePolyLines(lines);
        return new PolylineCollection(gl, polylines, opts);
    }

    public render(gl: WebGLAnyRenderingContext, matrix: number[] | Float32Array, [map_width, map_height]: [number, number], map_zoom: number, map_bearing: number, map_pitch: number) {
        if (matrix instanceof Float32Array)
            matrix = [...matrix];

        const attributes: Record<string, WGLBuffer> = {'a_pos': this.vertices, 'a_extrusion': this.extrusion};
        const uniforms: Record<string, number | number[]> = {
            'u_matrix': matrix, 'u_line_width': this.width, 'u_map_width': map_width, 'u_map_height': map_height, 'u_map_bearing': map_bearing, 'u_offset': 0
        };
        const textures: Record<string, WGLTexture> = {};

        if (this.offset !== null) {
            attributes['a_offset'] = this.offset;
            uniforms['u_offset_scale'] = this.scale * (map_height / map_width);
        }

        if (this.min_zoom !== null) {
            attributes['a_min_zoom'] = this.min_zoom;
            uniforms['u_zoom'] = map_zoom;
        }

        if (this.line_data !== null) {
            attributes['a_data'] = this.line_data;
        }
        else {
            uniforms['u_color'] = this.color.toRGBATuple();
        }

        this.program.use(attributes, uniforms, textures);

        if (this.cmap_gpu !== null) {
            this.cmap_gpu.bindShaderVariables(this.program);
        }

        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        this.program.draw();

        this.program.setUniforms({'u_offset': -2});
        this.program.draw();

        this.program.setUniforms({'u_offset': -1});
        this.program.draw();

        this.program.setUniforms({'u_offset': 1});
        this.program.draw();
    }
}

export {PolylineCollection};