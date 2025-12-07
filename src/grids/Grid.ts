import { TypedArray } from "../AutumnTypes";

interface EarthCoords {
    lons: Float32Array;
    lats: Float32Array;
}

interface GridCoords {
    x: Float32Array;
    y: Float32Array;
}

type GridType = 'latlon' | 'latlonrot' | 'lcc' | 'unstructured' | 'radar';

const WGS84_SEMIMAJOR = 6378137.0;
const WGS84_SEMIMINOR = 6356752.314245;

/** The base class for grid types */
abstract class Grid {
    public readonly type: GridType;
    public readonly ni: number;
    public readonly nj: number;
    public readonly is_conformal: boolean;

    constructor(type: GridType, is_conformal: boolean, ni: number, nj: number) {
        this.type = type;
        this.is_conformal = is_conformal;
        this.ni = ni;
        this.nj = nj;
    }

    public abstract getEarthCoords(): EarthCoords;
    public abstract getGridCoords(): GridCoords;
    public abstract transform(x: number, y: number, opts?: {inverse?: boolean}): [number, number];
    public abstract sampleNearestGridPoint(lon: number, lat: number, ary: TypedArray): {sample: number, sample_lon: number, sample_lat: number};

    public abstract copy(): Grid;
}

type AbstractConstructor<T> = abstract new(...args: any[]) => T;

export {Grid, WGS84_SEMIMAJOR, WGS84_SEMIMINOR};
export type {AbstractConstructor, EarthCoords, GridCoords, GridType};