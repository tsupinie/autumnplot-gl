import { Geodesic, GeodesicClass } from "geographiclib-geodesic";
import { gridCoordinateMixin } from "./GridCoordinates";
import { StructuredGrid, makeCartesianDomainBuffers } from "./StructuredGrid";
import { WebGLAnyRenderingContext } from "../AutumnTypes";

class RadarSweepGrid extends gridCoordinateMixin(StructuredGrid) {
    readonly longitude: number;
    readonly latitude: number;
    readonly start_az: number;
    readonly end_az: number;
    readonly start_rn: number;
    readonly end_rn: number;
    readonly geod: GeodesicClass;

    constructor(nt: number, nr: number, start_az: number, end_az: number, start_rn: number, end_rn: number, longitude: number, latitude: number) {
        super('radar', true, nt, nr);

        this.longitude = longitude;
        this.latitude = latitude;
        this.start_az = start_az;
        this.end_az = end_az;
        this.start_rn = start_rn;
        this.end_rn = end_rn;

        this.geod = Geodesic.WGS84;

        this.setupCoordinateCaches(start_az, end_az, start_rn, end_rn);
    }

    public copy(opts?: {nt?: number, nr?: number, start_az?: number, end_az?: number, start_rn?: number, end_rn?: number, longitude?: number, latitude?: number}): RadarSweepGrid {
        opts = opts === undefined ? {} : opts;

        const nt = opts.nt === undefined ? this.ni : opts.nt;
        const nr = opts.nr === undefined ? this.nj : opts.nr;
        const longitude = opts.longitude === undefined ? this.longitude : opts.longitude;
        const latitude = opts.latitude === undefined ? this.latitude : opts.latitude;
        const start_az = opts.start_az === undefined ? this.start_az : opts.start_az;
        const end_az = opts.end_az === undefined ? this.end_az : opts.end_az;
        const start_rn = opts.start_rn === undefined ? this.start_rn : opts.start_rn;
        const end_rn = opts.end_rn === undefined ? this.end_rn : opts.end_rn;

        return new RadarSweepGrid(nt, nr, start_az, end_az, start_rn, end_rn, longitude, latitude);
    }

    protected async makeDomainBuffers(gl: WebGLAnyRenderingContext) {
        return await makeCartesianDomainBuffers(gl, this as StructuredGrid, this.ni, 16, {margin_r: false, margin_s: false});
    }

    public transform(a: number, b: number, opts?: { inverse?: boolean | undefined; } | undefined): [number, number] {
        opts = opts === undefined ? {} : opts;
        const inverse = opts.inverse === undefined ? false : opts.inverse;

        // geographiclib calls the "forward" transformation what the rest of my code calls the "inverse" transformation and vice versa
        if (inverse) {
            const ret = this.geod.Direct(this.latitude, this.longitude, a, b);
            if (ret.lon2 === undefined || ret.lat2 === undefined)
                throw "Why are lon2 and lat2 not in the return value?";
            return [ret.lon2, ret.lat2];
        }
        else {
            const ret = this.geod.Inverse(this.latitude, this.longitude, b, a);
            if (ret.azi1 === undefined || ret.s12 === undefined)
                throw "Why are azi1 and s12 not in the return value?";

            if (!Number.isFinite(ret.azi1) || !Number.isFinite(ret.s12))
                return [NaN, NaN];

            const half_dt = 0.5 * (this.end_az - this.start_az) / this.ni;

            let az1 = ret.azi1;
            while (az1 < this.start_az - half_dt) az1 += 360;
            while (az1 >= this.end_az + half_dt) az1 -= 360;
            return [az1, ret.s12];
        }
    }
}

export {RadarSweepGrid};