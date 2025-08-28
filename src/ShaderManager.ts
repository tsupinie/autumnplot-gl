import { WGLProgram } from "autumn-wgl";
import { RenderShaderData, RendererData, WebGLAnyRenderingContext } from "./AutumnTypes";
import { mergeShaderCode } from "./utils";

class ShaderProgramManager {
    public readonly vertex_shader_src: string;
    public readonly fragment_shader_src: string;
    public readonly shader_defines: string[];
    private readonly program_map:  Map<string, WGLProgram>;

    constructor(vertex_shader_src: string, fragment_shader_src: string, shader_defines: string[]) {
        this.vertex_shader_src = vertex_shader_src;
        this.fragment_shader_src = fragment_shader_src;
        this.shader_defines = shader_defines;

        this.program_map = new Map();
    }

    public getShaderProgram(gl: WebGLAnyRenderingContext, shader_data: RenderShaderData | null) {
        const shader_key = shader_data === null ? 'default' : shader_data.variantName;

        const cached_program = this.program_map.get(shader_key);
        if (cached_program !== undefined) {
            return cached_program;
        }

        let vertex_src = this.vertex_shader_src;
        if (shader_data !== null) {
            vertex_src = mergeShaderCode(shader_data.vertexShaderPrelude + '\n' + shader_data.define, vertex_src);
        }
        else {
            const prelude = `
            uniform mat4 u_projection_matrix;

            vec4 projectTile(vec2 p) {
                vec4 result = u_projection_matrix * vec4(p, 0.0, 1.0);
                return result;
            }`;

            vertex_src = mergeShaderCode(prelude, vertex_src);
        }

        const program = new WGLProgram(gl, vertex_src, this.fragment_shader_src, {define: this.shader_defines});
        this.program_map.set(shader_key, program);

        return program;
    }

    public getShaderUniforms(render_data: RendererData) : Record<string, number | number[]> {
        if (render_data.type == 'maplibre') {
            if (render_data.shaderData.define.includes('GLOBE')) {
                return {
                    'u_projection_matrix': render_data.defaultProjectionData.mainMatrix,
                    'u_projection_fallback_matrix': render_data.defaultProjectionData.fallbackMatrix,
                    'u_projection_tile_mercator_coords': render_data.defaultProjectionData.tileMercatorCoords,
                    'u_projection_clipping_plane': render_data.defaultProjectionData.clippingPlane,
                    'u_projection_transition': render_data.defaultProjectionData.projectionTransition
                };
            }
            else {
                return {
                    'u_projection_matrix': render_data.defaultProjectionData.mainMatrix,
                };
            }
        }
        else {
            return {
                'u_projection_matrix': render_data.mainMatrix,
            }
        }
    }
}

export {ShaderProgramManager};