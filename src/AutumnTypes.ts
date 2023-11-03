
import { Float16Array } from "@petamoriken/float16";

interface WindProfile {
    lat: number;
    lon: number;
    jlat: number;
    ilon: number;
    smu: number;
    smv: number;
    u: Float32Array;
    v: Float32Array;
    z: Float32Array
}

interface BillboardSpec {
    BB_WIDTH: number;
    BB_HEIGHT: number;
    BB_TEX_WIDTH: number;
    BB_TEX_HEIGHT: number;
    BB_MAG_BIN_SIZE: number;
    BB_MAG_WRAP: number;
    BB_MAG_MAX: number;
}

interface PolylineSpec {
    origin: Float32Array;
    verts: Float32Array;
    extrusion: Float32Array;
    zoom: Float32Array;
    texcoords: Float32Array
}

interface LineSpec {
    verts: [number, number][];
    origin: [number, number];
    zoom: number,
    texcoords: [number, number][];
}

type WebGLAnyRenderingContext = WebGLRenderingContext | WebGL2RenderingContext;

function isWebGL2Ctx(gl: WebGLAnyRenderingContext) : gl is WebGL2RenderingContext {
    return gl.getParameter(gl.VERSION).includes('WebGL 2.0');
}

type TypedArray = Float16Array | Float32Array;

export {isWebGL2Ctx};
export type {WindProfile, BillboardSpec, PolylineSpec, LineSpec, WebGLAnyRenderingContext, TypedArray};