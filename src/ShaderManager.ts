import { WGLProgram } from "autumn-wgl";
import { RenderShaderData, RendererData, WebGLAnyRenderingContext } from "./AutumnTypes";
import { mergeShaderCode } from "./utils";
import { md5 } from "js-md5";

function makeSourceKey(vertex_shader_src: string, fragment_shader_src: string, shader_defines: string[]) {
    return md5.hex(JSON.stringify({defines: shader_defines, vertex: vertex_shader_src, fragment: fragment_shader_src}));
}

function makeShaderKey(source_key: string, shader_variant: string) {
    return JSON.stringify({source_key: source_key, shader_variant: shader_variant});
}

class ShaderProgramManager {
    private readonly program_map:  Map<string, WGLProgram>;
    private readonly source_map: Map<string, {defines: string[], vertex: string, fragment: string}>;

    constructor() {
        this.program_map = new Map();
        this.source_map = new Map();
    }

    addShaderProgram(vertex_shader_src: string, fragment_shader_src: string, shader_defines: string[]) {
        const source_key = makeSourceKey(vertex_shader_src, fragment_shader_src, shader_defines);
        this.source_map.set(source_key, {defines: shader_defines, vertex: vertex_shader_src, fragment: fragment_shader_src});
        return source_key;
    }

    public getShaderProgram(gl: WebGLAnyRenderingContext, source_key: string, shader_data: RenderShaderData | null) {
        const variant_name = shader_data === null ? 'default' : shader_data.variantName;
        const shader_key = makeShaderKey(source_key, variant_name);

        const cached_program = this.program_map.get(shader_key);
        if (cached_program !== undefined) {
            return cached_program;
        }

        const sources = this.source_map.get(source_key);
        if (sources === undefined) throw `Unknown source key '${source_key}' in ShaderProgramManager`;
        const {defines: shader_defines, vertex: vertex_shader_src, fragment: fragment_shader_src} = sources;

        let vertex_src;
        if (shader_data !== null) {
            vertex_src = mergeShaderCode(shader_data.vertexShaderPrelude + '\n' + shader_data.define, vertex_shader_src);
        }
        else {
            const prelude = `
            uniform mat4 u_projection_matrix;

            vec4 projectTile(vec2 p) {
                vec4 result = u_projection_matrix * vec4(p, 0.0, 1.0);
                return result;
            }`;

            vertex_src = mergeShaderCode(prelude, vertex_shader_src);
        }

        const program = new WGLProgram(gl, vertex_src, fragment_shader_src, {define: shader_defines});
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