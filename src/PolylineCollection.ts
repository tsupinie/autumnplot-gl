
import { WGLBuffer, WGLProgram, WGLTexture } from "autumn-wgl";
import { Polyline, LineData, WebGLAnyRenderingContext, isWebGL2Ctx, RenderMethodArg, getModelViewMatrix } from "./AutumnTypes";
import { ColorMap, ColorMapGPUInterface } from "./Colormap";
import { Color } from "./Color";
import { layer_worker } from "./PlotComponent";

const polyline_vertex_src = require('./glsl/polyline_vertex.glsl');
const polyline_fragment_src = require('./glsl/polyline_fragment.glsl');

/**
 * A style to use to draw lines. The possible options are '-' for a solid line, '--' for a dashed line, ':' for a
 *  dotted line, '-.' for a dash-dot line, or you could pass a list of numbers (e.g., [1, 1, 1, 0, 1, 0]) to
 *  specify a custom dash scheme.
 */
type LineStyle = "-" | "--" | ":" | "-." | number[];

const dash_arrays: Record<Exclude<LineStyle, number[]>, number[]> = {
    "-": [1],
    "--": [1, 1, 1, 1, 0, 0],
    ":": [1, 0],
    "-.": [1, 1, 1, 0, 1, 0],
}

function isLineStyle(obj: any) : obj is LineStyle {
    return obj in dash_arrays || Array.isArray(obj) && obj.length > 0 && obj.map(e => typeof e === 'number').reduce((a, b) => a && b, true);
}

interface PolylineCollectionOpts {
    offset_scale?: number;
    color?: string;
    cmap?: ColorMap;
    line_width?: number;
    line_style?: LineStyle | number[];
}

function makeDashTexture(gl: WebGLAnyRenderingContext, line_style: LineStyle) {

    const dash_array = Array.isArray(line_style) ? line_style : dash_arrays[line_style];

    const is_webgl2 = isWebGL2Ctx(gl);
    const format = is_webgl2 ? gl.R8 : gl.LUMINANCE;
    const type = gl.UNSIGNED_BYTE;
    const row_alignment = 1;

    const fill_image = {'format': format, 'type': type,
        'width': dash_array.length, 'height': 1, 'image': new Uint8Array(dash_array.map(d => d > 0 ? 255 : 0)),
        'mag_filter': gl.NEAREST, 'row_alignment': row_alignment,
    };

    return [dash_array.length, new WGLTexture(gl, fill_image)] as [number, WGLTexture];
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
    private readonly dash_texture: WGLTexture;
    private readonly n_dash: number;

    private constructor(gl: WebGLAnyRenderingContext, polyline: Polyline, opts?: PolylineCollectionOpts) {
        opts = opts === undefined ? {} : opts;
        const color_hex = opts.color === undefined ? '#000000' : opts.color;
        this.color = Color.fromHex(color_hex);

        const line_width = opts.line_width === undefined ? 1 : opts.line_width;
        const line_style = opts.line_style === undefined ? '-' : opts.line_style;

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

        [this.n_dash, this.dash_texture] = makeDashTexture(gl, line_style);

        this.program = new WGLProgram(gl, polyline_vertex_src, fragment_src, {define: shader_defines});
    }

    static async make(gl: WebGLAnyRenderingContext, lines: LineData[], opts?: PolylineCollectionOpts) {
        const polylines = await layer_worker.makePolyLines(lines);
        return new PolylineCollection(gl, polylines, opts);
    }

    public render(gl: WebGLAnyRenderingContext, arg: RenderMethodArg, [map_width, map_height]: [number, number], map_zoom: number, map_bearing: number, map_pitch: number) {
        const matrix = getModelViewMatrix(arg);

        const attributes: Record<string, WGLBuffer> = {'a_pos': this.vertices, 'a_extrusion': this.extrusion};
        const uniforms: Record<string, number | number[]> = {
            'u_matrix': matrix, 'u_line_width': this.width, 'u_map_width': map_width, 'u_map_height': map_height, 'u_map_bearing': map_bearing, 'u_offset': 0, 'u_zoom': map_zoom,
            'u_dash_pattern_length': this.n_dash
        };
        const textures: Record<string, WGLTexture> = {'u_dash_sampler': this.dash_texture};

        if (this.offset !== null && this.scale !== null) {
            attributes['a_offset'] = this.offset;
            uniforms['u_offset_scale'] = this.scale * (map_height / map_width);
        }

        if (this.min_zoom !== null) {
            attributes['a_min_zoom'] = this.min_zoom;
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

export {PolylineCollection, isLineStyle};
export type {PolylineCollectionOpts, LineStyle};