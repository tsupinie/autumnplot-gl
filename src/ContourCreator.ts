
import { FloatList, LineString, Point } from "./cpp/marchingsquares_embind";
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
}

async function contourCreator<ArrayType extends TypedArray>(data: ArrayType, grid: Grid, opts: FieldContourOpts) {
    if (opts.interval === undefined && opts.levels === undefined) {
        throw "Must supply either an interval or levels to contourCreator()"
    }

    const interval = opts.interval === undefined ? 0 : opts.interval;
    const levels = opts.levels === undefined ? [] : [...opts.levels];

    const msm = await initMSModule();

    console.time('contour');
    const grid_coords = grid.getGridCoords();

    const grid_data = new msm.FloatList();
    grid_data.resize(grid.ni * grid.nj, 0);
    const tex_data = data;

    tex_data.forEach((v, i) => grid_data.set(i, v));

    const grid_x = new msm.FloatList();
    grid_x.resize(grid.ni, 0);
    grid_coords.x.forEach((v, i) => grid_x.set(i, v));

    const grid_y = new msm.FloatList();
    grid_y.resize(grid.nj, 0);
    grid_coords.y.forEach((v, i) => grid_y.set(i, v));

    let levels_cpp: FloatList;

    if (levels.length == 0) {
        levels_cpp = msm.getContourLevelsFloat32(grid_data, grid.ni, grid.nj, interval);
    }
    else {
        levels_cpp = new msm.FloatList();
        levels_cpp.resize(levels.length, 0);
        levels.forEach((v, i) => levels_cpp.set(i, v));
    }

    const contours: ContourData = {};
    const contours_cpp = msm.makeContoursFloat32(grid_data, grid_x, grid_y, levels_cpp);
    for (let ilvl = 0; ilvl < levels_cpp.size(); ilvl++) {
        const v = levels_cpp.get(ilvl);

        const contour_cpp = contours_cpp.get(v);
        if (contour_cpp === undefined)
            continue;

        contours[v] = [];
        for (let icntr = 0; icntr < contour_cpp.size(); icntr++) {
            const contour: LineString = contour_cpp.get(icntr);
            const contour_point_list = contour.point_list;

            contours[v].push([]);

            for (let ipt = 0; ipt < contour_point_list.size(); ipt++) {
                const pt: Point = contour_point_list.get(ipt);
                const [lon, lat] = grid.transform(pt.x, pt.y, {inverse: true});
                contours[v][icntr].push([lon, lat]);

                pt.delete();
            }

            contour_point_list.delete();
            contour.delete();
        }

        contour_cpp.delete();
    }

    contours_cpp.delete();

    grid_data.delete();
    grid_x.delete();
    grid_y.delete();
    levels_cpp.delete();
    console.timeEnd('contour');

    return contours;
}

export {contourCreator, initMSModule};
export type {FieldContourOpts};