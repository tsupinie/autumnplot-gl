
/**
 * @module wgl/WebGLTexture
 * A module containing a helper class for WebGL textures
 */

interface WGLTextureSpec {
    format: GLenum;
    type: GLenum;
    width?: number;
    height?: number;
    mag_filter?: GLenum;
    image: any;
}

/** Class representing a WebGL texture */
class WGLTexture {
    /** @internal */
    readonly gl: WebGLRenderingContext;

    /** @internal */
    readonly texture: WebGLTexture;

    /** @internal */
    tex_num: number | null;

    /**
     * 
     * @param gl               - The WebGL rendering context
     * @param image            - The specification for the image
     * @param image.format     - The format for the image (e.g., which color channels are present?). Should be one of gl.RGBA, gl.RGB, etc.
     * @param image.type       - The data type for the image. Should be one of gl.FLOAT, gl.UNSIGNED_BYTE, etc.
     * @param image.width      - The width of the texture
     * @param image.height     - The height of the texture
     * @param image.mag_filter - The magnification filter to use for the texture. Should be one of gl.LINEAR, gl.NEAREST, etc.
     * @param image.image      - The image to use for the texture. Can be null to allocate space without filling it.
     */
    constructor(gl: WebGLRenderingContext, image: WGLTextureSpec) {
        this.gl = gl;

        const texture = gl.createTexture();
        if (texture === null) {
            throw "Could not create WebGL texture";
        }

        this.texture = texture;
        this.tex_num = null;

        this.setImageData(image);

        const mag_filter = image['mag_filter'] === undefined ? gl.LINEAR : image['mag_filter'];

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mag_filter);
    }

    /**
     * Set image data in this texture
     * @param image        - The specification for the image
     * @param image.format - The format for the image (e.g., which color channels are present?). Should be one of gl.RGBA, gl.RGB, etc.
     * @param image.type   - The data type for the image. Should be one of gl.FLOAT, gl.UNSIGNED_BYTE, etc.
     * @param image.width  - The width of the texture
     * @param image.height - The height of the texture
     * @param image.image  - The image to use for the texture. Can be null to allocate space without filling it.
     */
    setImageData(image: WGLTextureSpec): void {
        const gl = this.gl;

        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        if (image['width'] !== undefined && image['height'] !== undefined) {
            gl.texImage2D(gl.TEXTURE_2D, 0, image['format'], image['width'], image['height'], 0, 
                image['format'], image['type'], image['image']);
        }
        else {
            gl.texImage2D(gl.TEXTURE_2D, 0, image['format'], 
                image['format'], image['type'], image['image']);
        }
    }

    /**
     * Bind this texture to a location in a shader program
     * @internal
     * @param prog_uni_location - The location of the sampler uniform value (returned from gl.getUniform()) in the shader program.
     * @param gl_tex_num        - The texture number to bind this texture to.
     */
    bindToProgram(prog_uni_location: WebGLUniformLocation, gl_tex_num: number): void {
        this.activate(gl_tex_num);
        this.gl.uniform1i(prog_uni_location, gl_tex_num);
    }

    /**
     * Bind this texture to a given texture number
     * @param gl_tex_num - The texture number to bind this texture to.
     */
    activate(gl_tex_num: number): void {
        this.tex_num = gl_tex_num;
        this.gl.activeTexture(this.gl.TEXTURE0 + this.tex_num);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    }

    /**
     * Unbind this texture from the texture number it was most recently bound to.
     */
    deactivate(): void {
        if (this.tex_num === null) {
            return;
        }

        this.gl.activeTexture(this.gl.TEXTURE0 + this.tex_num);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.tex_num = null;
    }

    /**
     * Delete this texture.
     */
    delete(): void {
        this.gl.deleteTexture(this.texture);
        this.tex_num = null;
    }
}

export {WGLTexture};
export type {WGLTextureSpec}