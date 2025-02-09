
import { Float16Array } from "@petamoriken/float16";

interface WindProfile {
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

type TypedArray = Float16Array | Float32Array | Uint8Array;
type TypedArrayStr = 'float16' | 'float32' | 'uint8'

type ContourData = Record<number, [number, number][][]>;

type mat4 = number[] | Float32Array | Float64Array;
type RenderShaderData = {vertexShaderPrelude: string, define: string, variantName: string};

type MapLibreRendererDataProjection = {
    clippingPlane: [number, number, number, number];
    fallbackMatrix: mat4;
    mainMatrix: mat4;
    projectionTransition: number;
    tileMercatorCoords: [number, number, number, number];
};
type MapLibreRendererDataShader = RenderShaderData;

type MapLibreRendererData = {
    defaultProjectionData: MapLibreRendererDataProjection;
    farZ: number
    fov: number
    modelViewProjectionMatrix: mat4;
    nearZ: number
    projectionMatrix: mat4;
    shaderData: MapLibreRendererDataShader;
};

type RenderMethodArg = mat4 | MapLibreRendererData;

function isMapLibreRenderArg(obj: any) : obj is MapLibreRendererData {
    return 'modelViewProjectionMatrix' in obj && 'defaultProjectionData' in obj && 'mainMatrix' in obj.defaultProjectionData;
}

type RendererDataProjection = {
    clippingPlane: number[];
    fallbackMatrix: number[];
    mainMatrix: number[];
    projectionTransition: number;
    tileMercatorCoords: number[];
};
type RendererDataShader = RenderShaderData;

type RendererDataMapLibre = {
    type: 'maplibre';
    defaultProjectionData: RendererDataProjection;
    farZ: number
    fov: number
    modelViewProjectionMatrix: number[];
    nearZ: number
    projectionMatrix: number[];
    shaderData: RendererDataShader;
};

type RendererDataAutumn = {
    type: 'autumn';
    mainMatrix: number[];
    shaderData: null;
}

type RendererData = RendererDataMapLibre | RendererDataAutumn;

function getRendererData(arg: RenderMethodArg) : RendererData{
    if (isMapLibreRenderArg(arg)) {
        return {
            type: 'maplibre',
            defaultProjectionData: {
                clippingPlane: [...arg.defaultProjectionData.clippingPlane],
                fallbackMatrix: [...arg.defaultProjectionData.fallbackMatrix],
                mainMatrix: [...arg.defaultProjectionData.mainMatrix],
                projectionTransition: arg.defaultProjectionData.projectionTransition,
                tileMercatorCoords: [...arg.defaultProjectionData.tileMercatorCoords]
            },
            farZ: arg.farZ,
            fov: arg.fov,
            modelViewProjectionMatrix: [...arg.modelViewProjectionMatrix],
            nearZ: arg.nearZ,
            projectionMatrix: [...arg.projectionMatrix],
            shaderData: arg.shaderData
        };
    }

    return {type: 'autumn', mainMatrix: [...arg], shaderData: null};
}

export {isWebGL2Ctx, getRendererData};
export type {WindProfile, BillboardSpec, Polyline, LineData, WebGLAnyRenderingContext, TypedArray, TypedArrayStr, ContourData, RenderMethodArg, RendererData, RenderShaderData};