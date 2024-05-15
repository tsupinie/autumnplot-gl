
import { LineString, Point } from "./cpp/marchingsquares_embind";
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
    interval?: number;
    levels?: number[];
}

async function contourCreator<ArrayType extends TypedArray>(data: ArrayType, grid: Grid, opts: FieldContourOpts) {
    if (opts.interval === undefined && opts.levels === undefined) {
        throw "Must supply either an interval or levels to contourCreator()"
    }

    const interval = opts.interval === undefined ? 0 : opts.interval;
    const levels = opts.levels === undefined ? [] : [...opts.levels];

    const msm = await initMSModule();

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

    if (levels.length == 0) {
        const levels_cpp = msm.getContourLevelsFloat32(grid_data, grid.ni, grid.nj, interval);

        for (let ilvl = 0; ilvl < levels_cpp.size(); ilvl++) {
            levels.push(levels_cpp.get(ilvl));
        }

        levels_cpp.delete();
    }

    const contours: ContourData = {};
    levels.forEach(v => {
        const contours_ = msm.makeContoursFloat32(grid_data, grid_x, grid_y, v);
        contours[v] = [];

        for (let icntr = 0; icntr < contours_.size(); icntr++) {
            const contour: LineString = contours_.get(icntr);
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

        contours_.delete();
    });

    grid_data.delete();
    grid_x.delete();
    grid_y.delete();

    return contours;
}

export {contourCreator, initMSModule};
export type {FieldContourOpts};