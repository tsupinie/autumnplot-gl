import { WebGLAnyRenderingContext } from "../AutumnTypes";
import { verticalPerspective } from "../Map";
import { gridCoordinateMixin } from "./GridCoordinates";
import { StructuredGrid, makeCartesianDomainBuffers } from "./StructuredGrid";

// Maybe this shouldn't be called "geostationary" but something like "image" ... for all the non-geostationary satellites out there.
class GeostationaryImage extends gridCoordinateMixin(StructuredGrid) {
    public readonly satellite_lon: number;
    public readonly ll_x: number;
    public readonly ll_y: number;
    public readonly ur_x: number;
    public readonly ur_y: number;

    private readonly vpp: (a: number, b: number, opts?: {inverse: boolean}) => [number, number];

    constructor(ni: number, nj: number, ll_x: number, ll_y: number, ur_x: number, ur_y: number, satellite_lon: number) {
        super('geostationary', false, ni, nj);

        this.satellite_lon = satellite_lon;
        this.ll_x = ll_x;
        this.ll_y = ll_y;
        this.ur_x = ur_x;
        this.ur_y = ur_y;

        this.vpp = verticalPerspective({lon_0: satellite_lon, lat_0: 0, alt: 35786023.0, a: 6378137.0, b: 6356752.31414});

        this.setupCoordinateCaches(ll_x, ur_x, ll_y, ur_y);
    }

    protected async makeDomainBuffers(gl: WebGLAnyRenderingContext) {
        const simplify_ni = Math.max(Math.floor(this.ni / 20), 20);
        const simplify_nj = Math.max(Math.floor(this.nj / 20), 20);
        return await makeCartesianDomainBuffers(gl, this as StructuredGrid, simplify_ni, simplify_nj, {margin_r: false, margin_s: false});
    }

    public transform(x: number, y: number, opts?: {inverse?: boolean}): [number, number] {
        opts = opts === undefined ? {}: opts;
        const inverse = opts.inverse === undefined ? false : opts.inverse;

        return this.vpp(x, y, {inverse: inverse});
    }

    public copy() {
        return new GeostationaryImage(this.ni, this.nj, this.ll_x, this.ll_y, this.ur_x, this.ur_y, this.satellite_lon);
    }
}

export {GeostationaryImage};