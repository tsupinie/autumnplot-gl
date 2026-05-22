
import * as Comlink from 'comlink';

import { GridCoords } from './grids/Grid';
import { ContourData, ContourableTypedArray } from "./AutumnTypes";
import { initMSModule } from "./WasmInterface";
import { MarchingSquaresModule } from './cpp/marchingsquares';

let _msm: MarchingSquaresModule | null = null;

async function init(wasm_base_url: string | undefined) {
    _msm = await initMSModule({document_script: wasm_base_url});
}

/** Options for contouring data via {@link RawScalarField.getContours | RawScalarField.getContours()} */
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

interface ContourCreatorOpts extends FieldContourOpts {
    missing_value?: number;
}

async function contourCreator(data: ContourableTypedArray, grid_coords: GridCoords, opts: ContourCreatorOpts) {
    if (opts.interval === undefined && opts.levels === undefined) {
        throw "Must supply either an interval or levels to contourCreator()"
    }

    const interval = opts.interval === undefined ? 0 : opts.interval;
    const quad_as_tri = opts.quad_as_tri === undefined ? false : opts.quad_as_tri;
    const missing = opts.missing_value === undefined ? NaN : opts.missing_value;

    const msm = _msm === null ? await initMSModule({}) : _msm;
    _msm = msm;

    const getContourLevels = data instanceof Float32Array ? msm.getContourLevelsFloat32 : msm.getContourLevelsFloat16;
    const makeContours = data instanceof Float32Array ? msm.makeContoursFloat32 : msm.makeContoursFloat16;

    const levels = opts.levels === undefined ? getContourLevels(data, grid_coords.x.length, grid_coords.y.length, interval, missing) : opts.levels;
    const contours = makeContours(data, grid_coords.x, grid_coords.y, levels, quad_as_tri, missing);

    return contours as ContourData;
}

const ep_interface = {
    'contourCreator': contourCreator,
    'init': init,
}

type ContourCreatorWorker = typeof ep_interface;

Comlink.expose(ep_interface);

export type {ContourCreatorWorker, FieldContourOpts, ContourCreatorOpts}
