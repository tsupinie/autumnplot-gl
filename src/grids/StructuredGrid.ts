import { WGLBuffer } from "autumn-wgl";
import { TypedArray, WebGLAnyRenderingContext } from "../AutumnTypes";
import { argMin, getArrayConstructor, getMinZoom } from "../utils";
import { EarthCoords, Grid, GridType } from "./Grid";
import { layer_worker } from "../PlotComponent";
import { domainBufferMixin } from "./DomainBuffer";

async function makeCartesianDomainBuffers(gl: WebGLAnyRenderingContext, grid: StructuredGrid, simplify_ni: number, simplify_nj: number) {
    const texcoord_margin_r = 1 / (2 * grid.ni);
    const texcoord_margin_s = 1 / (2 * grid.nj);

    const {lats: field_lats, lons: field_lons} = grid.getEarthCoords(simplify_ni, simplify_nj);
    const domain_coords = await layer_worker.makeDomainVerticesAndTexCoords(field_lats, field_lons, simplify_ni, simplify_nj, texcoord_margin_r, texcoord_margin_s);

    const vertices = new WGLBuffer(gl, domain_coords['vertices'], 2, gl.TRIANGLE_STRIP);
    const texcoords = new WGLBuffer(gl, domain_coords['tex_coords'], 2, gl.TRIANGLE_STRIP);

    return {'vertices': vertices, 'texcoords': texcoords};
}

/** A structured grid (in this case meaning a cartesian grid with i and j coordinates) */
abstract class StructuredGrid extends domainBufferMixin(Grid) {
    protected readonly thin_x: number;
    protected readonly thin_y: number;

    constructor(type: GridType, is_conformal: boolean, ni: number, nj: number, thin_x?: number, thin_y?: number) {
        super(type, is_conformal, ni, nj);

        this.thin_x = thin_x === undefined ? 1 : thin_x;
        this.thin_y = thin_y === undefined ? 1 : thin_y;
    }

    public abstract getEarthCoords(ni?: number, nj?: number): EarthCoords;

    /** @internal */
    protected xyThinFromMaxZoom(thin_fac: number, map_max_zoom: number) {
        const n_density_tiers = Math.log2(thin_fac);
        const n_inaccessible_tiers = Math.max(n_density_tiers + 1 - map_max_zoom, 0);
        const xy_thin = Math.pow(2, n_inaccessible_tiers);

        return [xy_thin, xy_thin] as [number, number];
    }

    /** @internal */
    public getMinVisibleZoom(thin_fac: number) {
        const min_zoom = new Uint8Array(this.ni * this.nj);
        const zoom_thin_fac = thin_fac / Math.max(this.thin_x, this.thin_y);
        for (let ilat = 0; ilat < this.nj * this.thin_y; ilat++) {
            for (let ilon = 0; ilon < this.ni * this.thin_x; ilon++) {
                const idx = ilat * this.ni + ilon;
                min_zoom[idx] = getMinZoom(ilat, ilon, zoom_thin_fac);
            }
        }

        return min_zoom;
    }

    /** @internal */
    public thinDataArray<ArrayType extends TypedArray>(original_grid: StructuredGrid, ary: ArrayType) {
        const arrayType = getArrayConstructor(ary);
        const new_data = new arrayType(this.ni * this.nj);

        for (let i = 0; i < this.ni; i++) {
            for (let j = 0 ; j < this.nj; j++) {
                const idx_old = i * this.thin_x + original_grid.ni * j * this.thin_y;
                const idx = i + this.ni * j;

                new_data[idx] = ary[idx_old];
            }
        }

        return new_data;
    }

    public abstract copy(opts?: {ni?: number, nj?: number}): Grid;

    protected async makeDomainBuffers(gl: WebGLAnyRenderingContext) {
        const simplify_ni = Math.max(Math.floor(this.ni / 20), 20);
        const simplify_nj = Math.max(Math.floor(this.nj / 20), 20);
        return makeCartesianDomainBuffers(gl, this, simplify_ni, simplify_nj);
    }

    public sampleNearestGridPoint(lon: number, lat: number, ary: TypedArray): {sample: number, sample_lon: number, sample_lat: number} {
        const [x, y] = this.transform(lon, lat);
        const {x: xs, y: ys} = this.getGridCoords();

        const ll_x = xs[0];
        const ur_x = xs[xs.length - 1];
        const dx = xs[1] - xs[0];
        const ll_y = ys[0];
        const ur_y = ys[ys.length - 1];
        const dy = ys[1] - ys[0];

        if (x < ll_x - 0.5 * dx || x > ur_x + 0.5 * dx || y < ll_y - 0.5 * dy || y > ur_y + 0.5 * dy) {
            return {sample: NaN, sample_lon: NaN, sample_lat: NaN};
        }

        const i_min = argMin(xs.map(xv => Math.abs(xv - x)));
        const j_min = argMin(ys.map(yv => Math.abs(yv - y)));
        const idx = i_min + j_min * this.ni;

        const [lon_min, lat_min] = this.transform(xs[i_min], ys[j_min], {inverse: true});

        return {sample: ary[idx], sample_lon: lon_min, sample_lat: lat_min};
    }
}

export {StructuredGrid};