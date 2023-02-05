
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

interface BarbDimSpec {
    BARB_WIDTH: number;
    BARB_HEIGHT: number;
    BARB_TEX_WRAP: number;
    BARB_TEX_WIDTH: number;
    BARB_TEX_HEIGHT: number;
    MAX_BARB: number;
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

export type {WindProfile, BarbDimSpec, PolylineSpec, LineSpec};