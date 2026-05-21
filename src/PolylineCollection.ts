
import { WGLBuffer, WGLTexture } from "autumn-wgl";
import { Polyline, LineData, WebGLAnyRenderingContext, isWebGL2Ctx, RenderMethodArg, getRendererData } from "./AutumnTypes";
import { ColorMap, ColorMapGPUInterface } from "./Colormap";
import { Color } from "./Color";
import { layer_worker } from "./PlotComponent";
import { ShaderProgramManager } from "./ShaderManager";
import { normalizeOptions } from "./utils";

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
    offset_rotates_with_map?: boolean;
    color?: string;
    cmap?: ColorMap | null;
    line_width?: number;
    line_style?: LineStyle | number[];
}

const polyline_collection_opt_defaults: Required<PolylineCollectionOpts> = {
    offset_scale: 1,
    offset_rotates_with_map: true,
    color: '#000000',
    cmap: null,
    line_width: 1,
    line_style: '-'
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

interface PolyLineCollectionGLElems {
    vertices: WGLBuffer;
    extrusion: WGLBuffer;
    offset: WGLBuffer | null;
    min_zoom: WGLBuffer | null;
    line_data: WGLBuffer | null;
}

class PolylineCollection {
    public readonly width: number;
    public scale: number | null;

    public opts: Required<PolylineCollectionOpts>;

    private readonly gl: WebGLAnyRenderingContext;
    private gl_elems: PolyLineCollectionGLElems | null;
    private shader_manager: ShaderProgramManager;

    private readonly color: Color;
    private cmap_gpu: ColorMapGPUInterface | null;
    private readonly dash_texture: WGLTexture;
    private readonly n_dash: number;
    private has_offset: boolean;
    private has_zoom: boolean;
    private has_colormap: boolean;

    private constructor(gl: WebGLAnyRenderingContext, polyline: Polyline, opts?: PolylineCollectionOpts) {
        this.opts = normalizeOptions(opts, polyline_collection_opt_defaults);
        this.color = Color.fromHex(this.opts.color);
        this.gl = gl;

        this.width = this.opts.line_width;

        this.gl_elems = null;

        [this.n_dash, this.dash_texture] = makeDashTexture(gl, this.opts.line_style);

        this.has_offset = false;
        this.has_zoom = false;
        this.has_colormap = false;
    
        const {shader, cmap_gpu, scale} = this.compile_shader(this.has_offset, this.has_zoom, this.has_colormap);
        this.shader_manager = shader;
        this.cmap_gpu = cmap_gpu;
        this.scale = scale;

        this._update(polyline);
    }

    private _update(polyline: Polyline) {
        const gl = this.gl;

        const vertices = new WGLBuffer(gl, polyline['vertices'], 3, gl.TRIANGLE_STRIP);
        const extrusion = new WGLBuffer(gl, polyline['extrusion'], 2, gl.TRIANGLE_STRIP);
        
        let offset: WGLBuffer | null = null;
        let has_offset = polyline.offsets !== undefined;

        if (polyline.offsets !== undefined) {
            offset = new WGLBuffer(gl, polyline.offsets, 2, gl.TRIANGLE_STRIP);
        }

        let min_zoom: WGLBuffer | null = null;
        let has_zoom = polyline.zoom !== undefined;

        if (polyline.zoom !== undefined) {
            min_zoom = new WGLBuffer(gl, polyline.zoom, 1, gl.TRIANGLE_STRIP);
        }

        let line_data: WGLBuffer | null = null;
        let has_colormap = polyline.data !== undefined;

        if (polyline.data !== undefined) {
            line_data = new WGLBuffer(gl, polyline.data, 1, gl.TRIANGLE_STRIP);
        }

        this.gl_elems = {vertices: vertices, extrusion: extrusion, offset: offset, min_zoom: min_zoom, line_data};

        if (has_offset != this.has_offset || has_zoom != this.has_zoom || has_colormap != this.has_colormap) {
            // If any of the offset, zoom, or colormap has changed, we do need to recompile the shader
            this.has_offset = has_offset;
            this.has_zoom = has_zoom;
            this.has_colormap = has_colormap;

            const {shader, cmap_gpu, scale} = this.compile_shader(this.has_offset, this.has_zoom, this.has_colormap);
            this.shader_manager = shader;
            this.cmap_gpu = cmap_gpu;
            this.scale = scale;
        }
    }

    private compile_shader(add_offset: boolean, add_zoom: boolean, add_colormap: boolean) {
        const gl = this.gl;
        const shader_defines: string[] = [];

        let fragment_src = polyline_fragment_src;
        let scale: number | null = null;

        if (add_offset) {
            shader_defines.push('OFFSET');
            scale = this.opts.offset_scale;
        }

        if (add_zoom) {
            shader_defines.push('ZOOM');
        }

        let cmap_gpu: ColorMapGPUInterface | null = null;

        if (add_colormap) {
            shader_defines.push('DATA');

            const color_hex = this.opts.color;
            const cmap = this.opts.cmap === null ? new ColorMap([0, 1], [color_hex], {overflow_color: color_hex, underflow_color: color_hex}) : this.opts.cmap;
            cmap_gpu = new ColorMapGPUInterface(cmap);
            cmap_gpu.setupShaderVariables(gl, gl.NEAREST);

            fragment_src = ColorMapGPUInterface.applyShader(fragment_src);
        }

        return {
            shader: new ShaderProgramManager(polyline_vertex_src, fragment_src, shader_defines),
            cmap_gpu: cmap_gpu,
            scale: scale,
        }
    }

    static async make(gl: WebGLAnyRenderingContext, lines: LineData[], opts?: PolylineCollectionOpts) {
        const polylines = await layer_worker.makePolyLines(lines);
        return new PolylineCollection(gl, polylines, opts);
    }

    async update(lines: LineData[]) {
        const polyline = await layer_worker.makePolyLines(lines);
        this._update(polyline);
    }

    public render(gl: WebGLAnyRenderingContext, arg: RenderMethodArg, [map_width, map_height]: [number, number], map_zoom: number, map_bearing: number, map_pitch: number) {
        if (this.gl_elems === null) return;
        const {vertices, extrusion, offset, min_zoom, line_data} = this.gl_elems

        const render_data = getRendererData(arg);
        const program = this.shader_manager.getShaderProgram(gl, render_data.shaderData);

        const attributes: Record<string, WGLBuffer> = {'a_pos': vertices, 'a_extrusion': extrusion};
        const uniforms: Record<string, number | number[]> = {
            'u_line_width': this.width, 'u_map_width': map_width, 'u_map_height': map_height, 'u_offset': 0, 'u_zoom': map_zoom,
            'u_dash_pattern_length': this.n_dash, ...this.shader_manager.getShaderUniforms(render_data)
        };
        const textures: Record<string, WGLTexture> = {'u_dash_sampler': this.dash_texture};

        if (offset !== null && this.scale !== null) {
            attributes['a_offset'] = offset;
            uniforms['u_offset_scale'] = this.scale * (map_height / map_width);
            uniforms['u_offset_rotates_with_map'] = this.opts.offset_rotates_with_map ? 1 : 0;
        }

        if (min_zoom !== null) {
            attributes['a_min_zoom'] = min_zoom;
        }

        if (line_data !== null) {
            attributes['a_data'] = line_data;
        }
        else {
            uniforms['u_color'] = this.color.toRGBATuple();
        }

        program.use(attributes, uniforms, textures);

        if (this.cmap_gpu !== null) {
            this.cmap_gpu.bindShaderVariables(program);
        }

        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        program.draw();

        if (render_data.type != 'maplibre' || !render_data.shaderData.define.includes('GLOBE')) {
            program.setUniforms({'u_offset': -2});
            program.draw();

            program.setUniforms({'u_offset': -1});
            program.draw();

            program.setUniforms({'u_offset': 1});
            program.draw();
        }
    }
}

export {PolylineCollection, isLineStyle};
export type {PolylineCollectionOpts, LineStyle};