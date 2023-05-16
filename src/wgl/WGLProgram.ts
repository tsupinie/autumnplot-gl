
import { WGLBuffer } from "./WGLBuffer";
import { WGLTexture } from "./WGLTexture";

/**
 * @module wgl/WebGLProgram
 * Module containing a helper class for WebGL programs
 */

/**
 * Compile and link a shader program
 * @param gl                - The WebGL rendering context
 * @param vertex_shader_src - The source code for the vertex shader
 * @param frag_shader_src   - The source code for the fragment shader
 * @returns                   A compiled and linked WebGL program
 */
const compileAndLinkShaders = (gl: WebGLRenderingContext, vertex_shader_src: string, frag_shader_src: string): WebGLProgram => {
    // create a vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (vertexShader === null) {
        throw "Could not create vertex shader";
    }

    gl.shaderSource(vertexShader, vertex_shader_src);
    gl.compileShader(vertexShader);

    const vertexCompiled = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);

    if (!vertexCompiled) {
        const compilationLog = gl.getShaderInfoLog(vertexShader);
        console.log('Vertex shader compiler log: ' + compilationLog);
    }
    
    // create a fragment shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (fragmentShader === null) {
        throw "Could not create fragment shader";
    }

    gl.shaderSource(fragmentShader, frag_shader_src);
    gl.compileShader(fragmentShader);

    const fragmentCompiled = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);

    if (!fragmentCompiled) {
        const compilationLog = gl.getShaderInfoLog(fragmentShader);
        console.log('Fragment shader compiler log: ' + compilationLog);
    }

    // link the two shaders into a WebGL program
    const program = gl.createProgram();
    if (program === null) {
        throw "Could not create shader program";
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!linked) {
        const linkLog = gl.getProgramInfoLog(program);
        console.log('Linker log: ' + linkLog);
    }

    return program;
}

/** Class representing a WebGL shader program */
class WGLProgram {
    /** @internal */
    readonly gl: WebGLRenderingContext;

    /** @internal */
    readonly prog: WebGLProgram;

    /** @internal */
    readonly attributes: Record<string, { type: string; location: number; }>

    /** @internal */
    readonly uniforms: Record<string, { type: string; location: WebGLUniformLocation; }>

    /** @internal */
    n_verts: number | null;

    /** @internal */
    draw_mode: number | null;

    /**
     * Create and compile a shader program from source
     * @param gl                  - The WebGL rendering context
     * @param vertex_shader_src   - The vertex shader source code
     * @param fragment_shader_src - The fragment shader source code
     */
    constructor(gl: WebGLRenderingContext, vertex_shader_src: string, fragment_shader_src: string) {
        this.gl = gl;
        this.prog = compileAndLinkShaders(gl, vertex_shader_src, fragment_shader_src);

        this.attributes = {};
        this.uniforms = {};

        this.n_verts = null;
        this.draw_mode = null;

        const remove_comments = (line: string) => {
            const comment_idx = line.indexOf('//');
            if (comment_idx >= 0) {
                line = line.slice(0, comment_idx);
            }
            return line;
        }

        vertex_shader_src = vertex_shader_src.split('\n').map(remove_comments).join('\n');
        fragment_shader_src = fragment_shader_src.split('\n').map(remove_comments).join('\n');

        for (const match of vertex_shader_src.matchAll(/attribute +([\w ]+?) +([\w_]+);[\s]*$/mg)) {
            const [full_match, type, a_name] = match;
            this.attributes[a_name] = {'type': type, 'location': gl.getAttribLocation(this.prog, a_name)};
        }

        for (const match of vertex_shader_src.matchAll(/uniform +([\w ]+?) +([\w_]+)(?:[\s]*\[.*\])?;[\s]*$/mg)) {
            const [full_match, type, u_name] = match;
            const type_parts = type.split(' ');

            const uniform_loc = gl.getUniformLocation(this.prog, u_name);
            if (uniform_loc === null) {
                throw `Could not get vertex shader uniform location for '${u_name}'`;
            }

            this.uniforms[u_name] = {'type': type_parts[type_parts.length - 1], 'location': uniform_loc};
        }

        for (const match of fragment_shader_src.matchAll(/uniform +([\w ]+?) +([\w_]+)(?:[\s]*\[.*\])?;[\s]*$/mg)) {
            const [full_match, type, u_name] = match;
            const type_parts = type.split(' ');

            const uniform_loc = gl.getUniformLocation(this.prog, u_name);
            if (uniform_loc === null) {
                throw `Could not get fragment shader uniform location for '${u_name}'`;
            }

            this.uniforms[u_name] = {'type': type_parts[type_parts.length - 1], 'location': uniform_loc};
        }
    }

    /**
     * Enable this program for rendering and optionally bind attribute, uniform, and texture values. This function should be called before calling 
     * {@link WGLProgram.bindAttributes}, {@link WGLProgram.setUniforms}, or {@link WGLProgram.bindTextures} on a given rendering pass.
     * @param attribute_buffers - An object with the keys being the attribute variable names and the values being the buffers to associate with each variable
     * @param uniform_values    - An object with the keys being the uniform variable names and the values being the uniform values
     * @param textures          - An object with the keys being the sampler names in the source code and the values being the textures to associate with each sampler
     */
    use(attribute_buffers?: Record<string, WGLBuffer>, uniform_values?: Record<string, (number | number[])>, textures?: Record<string, WGLTexture>): void {
        this.gl.useProgram(this.prog);
        
        this.draw_mode = null;
        this.n_verts = null;

        if (attribute_buffers !== undefined) {
            this.bindAttributes(attribute_buffers);
        }

        if (uniform_values !== undefined) {
            this.setUniforms(uniform_values);
        }

        if (textures !== undefined) {
            this.bindTextures(textures);
        }
    }

    /**
     * Bind attribute buffers to variables in this shader program. When rendring, call {@link WGLProgram.use} before calling this function.
     * @param attribute_buffers - An object with the keys being the attribute variable names and the values being the buffers to associate with each variable
     */
    bindAttributes(attribute_buffers: Record<string, WGLBuffer>): void {
        Object.entries(attribute_buffers).forEach(([a_name, buffer]) => {
            if (this.attributes[a_name] === undefined) {
                console.warn(`Skipping attribute buffer provided for '${a_name}' because the attribute was not found in the program.`);
                return;
            }

            this.n_verts = this.n_verts === null ? buffer.n_verts : this.n_verts;
            this.draw_mode = this.draw_mode === null ? buffer.draw_mode : this.draw_mode;

            if (this.draw_mode != buffer.draw_mode) {
                throw `Unexpected draw mode for attribute buffer ${a_name} (expected ${this.draw_mode}, got ${buffer.draw_mode}).`;
            }

            if (this.n_verts != buffer.n_verts) {
                throw `Unexpected number of vertices for attribute buffer ${a_name} (expected ${this.n_verts}, got ${buffer.n_verts}).`;
            }

            const {type, location} = this.attributes[a_name];
            buffer.bindToProgram(location);
        });
    }

    /**
     * Set uniform values in this shader program. When rendering, call {@link WGLProgram.use} before calling this function.
     * @param uniform_values - An object with the keys being the uniform variable names and the values being the uniform values
     */
    setUniforms(uniform_values: Record<string, (number | number[])>): void {
        Object.entries(uniform_values).forEach(([u_name, value]) => {
            if (this.uniforms[u_name] === undefined) {
                console.warn(`Skipping uniform value provided for '${u_name}' because the uniform was not found in the program.`);
                return;
            }

            const {type, location} = this.uniforms[u_name];

            if (type === 'int' && typeof value == 'number') {
                this.gl.uniform1i(location, value);
            }
            else if (type === 'float' && typeof value == 'number') {
                this.gl.uniform1f(location, value);
            }
            else if (type === 'float' && value instanceof Array) {
                this.gl.uniform1fv(location, value);
            }
            else if (type === 'vec2' && value instanceof Array) {
                this.gl.uniform2fv(location, value);
            }
            else if (type === 'vec3' && value instanceof Array) {
                this.gl.uniform3fv(location, value);
            }
            else if (type === 'vec4' && value instanceof Array) {
                this.gl.uniform4fv(location, value);
            }
            else if (type === 'mat4' && value instanceof Array) {
                this.gl.uniformMatrix4fv(location, false, value);
            }
            else {
                throw `Could not figure out uniform function for type '${type}' and value '${String(value)}'`;
            }
        });
    }

    /**
     * Bind textures to samplers in this shader program. When rendring, call {@link WGLProgram.use} before calling this function.
     * @param textures - An object with the keys being the sampler names in the source code and the values being the textures to associate with each sampler
     */
    bindTextures(textures: Record<string, WGLTexture>) {
        Object.entries(textures).forEach(([sampler_name, texture], gl_tex_num) => {
            if (this.uniforms[sampler_name] === undefined) {
                console.warn(`Skipping texture provided for sampler '${sampler_name}' because the sampler was not found in the program.`)
                return;
            }

            const {type, location} = this.uniforms[sampler_name];
            texture.bindToProgram(location, gl_tex_num);
        });
    }

    /**
     * Run this shader program.
     */
    draw(): void {
        if (this.draw_mode === null || this.n_verts === null) {
            throw "Cannot draw without binding attribute buffers";
        }

        this.gl.drawArrays(this.draw_mode, 0, this.n_verts);
    }
}

export {WGLProgram};