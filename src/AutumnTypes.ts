
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

type LineData = {
    vertices: [number, number][];
    offsets?: [number, number][];
    data?: number[];
    zoom?: number;
}

type Polyline = {
    extrusion: Float32Array;
    vertices: Float32Array;
    offsets?: Float32Array;
    data?: Float32Array;
    zoom?: Float32Array;
};

type WebGLAnyRenderingContext = WebGLRenderingContext | WebGL2RenderingContext;

function isWebGL2Ctx(gl: WebGLAnyRenderingContext) : gl is WebGL2RenderingContext {
    return gl.getParameter(gl.VERSION).includes('WebGL 2.0');
}

type TypedArray = Float16Array | Float32Array;

type ContourData = Record<number, [number, number][][]>;

export {isWebGL2Ctx};
export type {WindProfile, BillboardSpec, Polyline, LineData, WebGLAnyRenderingContext, TypedArray, ContourData};