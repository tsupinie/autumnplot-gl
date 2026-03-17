import { WGLBuffer } from "autumn-wgl";

import { getRendererData, RenderMethodArg, WebGLAnyRenderingContext } from "./AutumnTypes";
import { Color } from "./Color";
import { ShaderProgramManager } from "./ShaderManager";

const polygon_vertex_src = require('./glsl/polygon_vertex.glsl');
const polygon_fragment_src = require('./glsl/polygon_fragment.glsl');

/** Options for {@link PolygonCollection} */
interface PolygonCollectionOptions {
    /** Fill color for the polygon collection */
    color?: string;

    /** Opacity multiplier for the fill color */
    opacity?: number;
}

/**
 * A simple filled polygon collection rendered as triangles.
 *
 * This class intentionally focuses on fast fill rendering. Any polygon outlines
 * should be drawn separately using {@link PolylineCollection}.
 */
class PolygonCollection {
    private readonly shader_manager: ShaderProgramManager;
    private readonly vertices: WGLBuffer;
    private readonly color: Color;
    private readonly opacity: number;
    private readonly vertex_count: number;

    constructor(gl: WebGLAnyRenderingContext, vertices: Float32Array, opts?: PolygonCollectionOptions) {
        opts = opts === undefined ? {} : opts;

        const color_hex = opts.color === undefined ? '#000000' : opts.color;
        this.color = Color.fromHex(color_hex);
        this.opacity = opts.opacity === undefined ? 1 : opts.opacity;

        this.vertex_count = Math.floor(vertices.length / 2);
        this.vertices = new WGLBuffer(gl, vertices, 2, gl.TRIANGLES);
        this.shader_manager = new ShaderProgramManager(polygon_vertex_src, polygon_fragment_src, []);
    }

    /**
     * Render the polygon collection.
     * @internal
     */
    public render(gl: WebGLAnyRenderingContext, arg: RenderMethodArg) {
        if (this.vertex_count === 0) return;

        const render_data = getRendererData(arg);
        const program = this.shader_manager.getShaderProgram(gl, render_data.shaderData);

        program.use(
            {'a_pos': this.vertices},
            {
                'u_color': this.color.toRGBATuple(),
                'u_opacity': this.opacity,
                'u_offset': 0,
                ...this.shader_manager.getShaderUniforms(render_data)
            },
            {}
        );

        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        program.draw();

        // Draw extra world copies when the globe projection is not active.
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

export {PolygonCollection};
export type {PolygonCollectionOptions};
