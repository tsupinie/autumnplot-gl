
import Module from './cpp/marchingsquares';
import { MarchingSquaresModule } from './cpp/marchingsquares';
import './cpp/marchingsquares.wasm';
import { Grid } from "./Grid";
import { ContourData, TypedArray } from "./AutumnTypes";

let msm_promise: Promise<MarchingSquaresModule> | null = null;

function initMSModule() {
    if (msm_promise === null) {
        msm_promise = Module();
    }

    return msm_promise;
}

interface FieldContourOpts {
    /**
     * The interval at which to create contours. The field will be contoured at this interval from its minimum to its maximum.
     */
    interval?: number;

    /**
     * Contour the field at these specific levels.
     */
    levels?: number[];

    /**
     * Add triangles in the contouring, which takes longer and generates more detailed (not necessarily smoother or better) contours
     */
    quad_as_tri?: boolean;
}

async function contourCreator<ArrayType extends TypedArray>(data: ArrayType, grid: Grid, opts: FieldContourOpts) {
    if (opts.interval === undefined && opts.levels === undefined) {
        throw "Must supply either an interval or levels to contourCreator()"
    }

    const interval = opts.interval === undefined ? 0 : opts.interval;
    const quad_as_tri = opts.quad_as_tri === undefined ? false : opts.quad_as_tri;

    const msm = await initMSModule();

    const grid_coords = grid.getGridCoords();

    const getContourLevels = data instanceof Float32Array ? msm.getContourLevelsFloat32 : msm.getContourLevelsFloat16;
    const makeContours = data instanceof Float32Array ? msm.makeContoursFloat32 : msm.makeContoursFloat16;

    const levels = opts.levels === undefined ? getContourLevels(data, grid.ni, grid.nj, interval) : opts.levels;
    const contours = makeContours(data, grid_coords.x, grid_coords.y, levels, (x: number, y: number) => grid.transform(x, y, {inverse: true}), quad_as_tri);

    return contours as ContourData;
}

export {contourCreator, initMSModule};
export type {FieldContourOpts};