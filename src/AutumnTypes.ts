
import { Float16Array } from "@petamoriken/float16";

/** A wind profile with a storm-motion for plotting storm-relative hodographs */
interface StormRelativeWindProfile {
    /** The grid index in the j direction (ignored for unstructured grids) */
    jlat: number;

    /** The grid index in the i direction */
    ilon: number;

    /** u component of storm motion in kts */
    smu: number;

    /** v component of storm motion in kts */
    smv: number;

    /** Ground-relative u winds in kts (will be converted to storm-relative during plotting) */
    u: Float32Array;

    /** Ground-relative v winds in kts (will be converted to storm-relative during plotting) */
    v: Float32Array;

    /** Height of each data point in km */
    z: Float32Array
}

/** A wind profile without a storm motion for plotting ground-relative hodographs */
interface GroundRelativeWindProfile {
    /** The grid index in the j direction (ignored for unstructured grids) */
    jlat: number;

    /** The grid index in the i direction */
    ilon: number;

    /** Ground-relative u winds in kts */
    u: Float32Array;

    /** Ground-relative v winds in kts */
    v: Float32Array;

    /** Height of each data point in km */
    z: Float32Array
}

/** Different types of wind profiles for {@link Hodographs} components */
type WindProfile = StormRelativeWindProfile | GroundRelativeWindProfile;

function isStormRelativeWindProfile(obj: any) : obj is StormRelativeWindProfile {
    return 'smu' in obj && 'smv' in obj;
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

/** WebGL rendering contexts (either WebGL1 or WebGL2) */
type WebGLAnyRenderingContext = WebGLRenderingContext | WebGL2RenderingContext;

function isWebGL2Ctx(gl: WebGLAnyRenderingContext) : gl is WebGL2RenderingContext {
    return gl.getParameter(gl.VERSION).includes('WebGL 2.0');
}

/** Javascript typed arrays for use in raw fields */
type TypedArray = Float16Array | Float32Array | Uint8Array;
type TypedArrayStr = 'float16' | 'float32' | 'uint8'

/** 
 * The result of contouring a field
 *
 * Each property is a different contour level giving an array of contours, and each contour is an array of [longitude, latitude].
 */
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

export {isWebGL2Ctx, getRendererData, isStormRelativeWindProfile};
export type {WindProfile, StormRelativeWindProfile, GroundRelativeWindProfile, BillboardSpec, Polyline, LineData, WebGLAnyRenderingContext, 
             TypedArray, TypedArrayStr, ContourData, RenderMethodArg, RendererData, RenderShaderData};