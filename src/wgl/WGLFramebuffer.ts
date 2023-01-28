
import { WGLTexture } from "./WGLTexture";

/**
 * @module wgl/WebGLFramebuffer
 * Module containing helper classes for WebGL Framebuffers
 */

/**
 * Base class for WebGL framebuffers
 */
class WGLFramebufferBase {
    /** @internal */
    gl: WebGLRenderingContext | null;

    /** @internal */
    readonly framebuffer: WebGLFramebuffer | null;

    constructor(gl: (WebGLRenderingContext | null), framebuffer: (WebGLFramebuffer | null)) {
        this.gl = gl;
        this.framebuffer = framebuffer;
    }

    /**
     * Clear the framebuffer to a particular color
     * @param color - The color to use when clearing the framebuffer as a float RGBA tuple
     */
    clear(color: [number, number, number, number]): void {
        const gl = this.gl;
        if (gl === null) {
            throw "Register WebGL drawing context using registerGLContext() first";
        }

        gl.clearColor(...color);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    /**
     * Render to a portion of this framebuffer
     * @param x      - The x coordinate of the starting point for the viewport
     * @param y      - The y coordinate of the starting point for the viewport
     * @param width  - The width of the viewport
     * @param height - The height of the viewport
     */
    renderTo(x: number, y: number, width: number, height: number): void {
        const gl = this.gl;
        if (gl === null) {
            throw "Register WebGL drawing context using registerGLContext() first";
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.viewport(x, y, width, height);
    }

    /**
     * Copy the contents of this framebuffer to another texture
     * @param texture - The destination texture for the copy
     * @param x       - The x coordinate of the start of the source rectangle
     * @param y       - The y coordinate of the start of the source rectangle
     * @param width   - The width of the source rectangle
     * @param height  - The height of the source rectangle
     */
    copyToTexture(texture: WGLTexture, x: number, y: number, width: number, height: number): void {
        const gl = this.gl;
        if (gl === null) {
            throw "Register WebGL drawing context using registerGLContext() first";
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        texture.activate(0);

        gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, x, y, width, height, 0);
    }
}

/**
 * Class representing the screen buffer
 * @extends WGLFramebufferBase
 */
class WGLScreenbuffer extends WGLFramebufferBase {
    /**
     * Create the screen buffer. Use the {@link WGLFramebuffer.screen} static variable of {@link WGLFramebuffer} instead of creating your own screenbuffer.
     */

    constructor() {
        super(null, null);
    }

    /**
     * Register the WebGL rendering context for later use
     * @param gl - The WebGL rendering context
     */
    registerGLContext(gl: WebGLRenderingContext) {
        this.gl = gl;
    }
}

/**
 * Class representing a WebGL framebuffer
 * @extends WGLFramebufferBase
 */
class WGLFramebuffer extends WGLFramebufferBase {
    readonly texture: WGLTexture;

    /**
     * Create a framebuffer associated with a texture
     * @param gl      - The WebGL rendering context
     * @param texture - The texture object to associate with this framebuffer
     */
    constructor(gl: WebGLRenderingContext, texture: WGLTexture) {
        const framebuffer =  gl.createFramebuffer();
        if (framebuffer === null) {
            throw "Could not create WebGL Framebuffer";
        }

        super(gl, framebuffer);
        this.texture = texture

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture['texture'], 0);
    }

    /**
     * A screen buffer object for interacting with the screen
     * @static
     */
    static screen: WGLScreenbuffer = new WGLScreenbuffer();
}

/** 
 * Perform several rendering passes, flip-flopping between two framebuffers
 * @param n_passes  - The number of rendering passes to do
 * @param source_fb - The framebuffer containing the initial data for the rendering
 * @param aux_fb    - The auxilary rendering framebuffers (should be 2 of them)
 * @param do_render - A method that does the actual rendering pass
 */
const flipFlopBuffers = (n_passes: number, source_fb: WGLFramebuffer, aux_fb: WGLFramebuffer[], 
                         do_render: (src: WGLFramebuffer, dest: WGLFramebuffer, ipass?: number) => void): WGLFramebuffer => {

    // fb1 is the source and fb2 is the target for each pass
    let fb1: WGLFramebuffer = source_fb, fb2: WGLFramebuffer = aux_fb[0];

    for (let ipass = 0; ipass < n_passes; ipass++) {
        // Clear and unbind destination texture
        fb2.clear([0., 0., 0., 1.]);
        fb2.texture.deactivate();

        // Do whatever rendering task we want to do
        do_render(fb1, fb2, ipass);

        if (ipass > 0) {
            // Flip the framebuffers so the destination on this pass becomes the source on the next pass and vice-versa
            aux_fb.reverse();
        }
        [fb1, fb2] = aux_fb;
    }

    // The most recent target is fb2, but the two framebuffers got flipped at the end of the loop, so the data we want are in fb1.
    return fb1;
}

export {WGLFramebuffer, WGLScreenbuffer, flipFlopBuffers};