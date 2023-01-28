
/**
 * @module wgl/WebGLBuffer
 * Module containing a helper class for WebGL data buffers
 */

/** A class representing a WebGL data buffer */
class WGLBuffer {
    /** @internal */
    readonly gl: WebGLRenderingContext;

    /** @internal */
    readonly n_coords_per_vert: number;

    /** @internal */
    readonly dtype: number;

    readonly n_verts: number;
    readonly draw_mode: GLenum;

    /** @internal */
    readonly buffer: WebGLBuffer;

    /**
     * Create a WebGL buffer and put some data in it
     * @param gl                 - The WebGL rendering context
     * @param verts              - The vertex data to use for this buffer
     * @param n_coords_per_vert  - The number of coordinates for each vertex in the data buffer
     * @param draw_mode          - The draw mode to use for this buffer. Should be one of gl.TRIANGLE_STRIP, etc.
     */
    constructor(gl: WebGLRenderingContext, verts: Float32Array, n_coords_per_vert: number, draw_mode: GLenum) {
        const DTYPES: Record<string, number> = {
            'Float32Array': gl.FLOAT,
            'Uint8Array': gl.UNSIGNED_BYTE,
        }

        this.gl = gl;
        this.n_coords_per_vert = n_coords_per_vert;
        this.dtype = DTYPES[verts.constructor.name];

        this.n_verts = verts.length / n_coords_per_vert;
        this.draw_mode = draw_mode;

        const buffer = gl.createBuffer()
        if (buffer === null) {
            throw "Could not create WebGL buffer";
        }

        this.buffer = buffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    }

    /**
     * Bind this buffer to a location in a shader program
     * @internal
     * @param prog_attr_location - The location of the variable in the shader program (returned from gl.getAttribLocation())
     */
    bindToProgram(prog_attr_location: number): void {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.enableVertexAttribArray(prog_attr_location);
        this.gl.vertexAttribPointer(prog_attr_location, this.n_coords_per_vert, this.dtype, false, 0, 0);
    }
}

export {WGLBuffer};