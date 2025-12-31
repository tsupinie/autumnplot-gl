import { verticalPerspective } from "../Map";
import { gridCoordinateMixin } from "./GridCoordinates";
import { StructuredGrid } from "./StructuredGrid";

// Maybe this shouldn't be called "geostationary" but something like "image" ... for all the non-geostationary satellites out there.
class GeostationaryImage extends gridCoordinateMixin(StructuredGrid) {
    public readonly satellite_lon: number;
    public readonly satellite_lat: number;

    private readonly vpp: (a: number, b: number, opts?: {inverse: boolean}) => [number, number];

    constructor(ni: number, nj: number, satellite_lon: number, satellite_lat: number) {
        super('geostationary', false, ni, nj);

        this.satellite_lon = satellite_lon;
        this.satellite_lat = satellite_lat;
        this.vpp = verticalPerspective({lon_0: satellite_lon, lat_0: satellite_lat, alt: 35786000., a: 6731229, b: 6371229});
    }

    public transform(x: number, y: number, opts?: {inverse?: boolean}): [number, number] {
        opts = opts === undefined ? {}: opts;
        const inverse = opts.inverse === undefined ? false : opts.inverse;

        return this.vpp(x, y, {inverse: inverse});
    }

    public copy() {
        return new GeostationaryImage(this.ni, this.nj, this.satellite_lon, this.satellite_lat);
    }
}

export {GeostationaryImage};