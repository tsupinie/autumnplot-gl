
import { lambertConformalConic } from "./Map";
import { zip } from "./utils";

class Cache<A extends unknown[], R> {
    cached_value: R | null;
    compute_value: (...args: A) => R;

    constructor(compute_value: (...args: A) => R) {
        this.cached_value = null;
        this.compute_value = compute_value;
    }

    getValue(...args: A) {
        if (this.cached_value === null) {
            this.cached_value = this.compute_value(...args);
        }

        return this.cached_value;
    }
}

interface Coords {
    lons: Float32Array;
    lats: Float32Array;
}

/** A plate carree (a.k.a. lat/lon) grid with uniform grid spacing */
class PlateCarreeGrid {
    readonly type: 'latlon';

    readonly ni: number;
    readonly nj: number;
    readonly ll_lon: number;
    readonly ll_lat: number;
    readonly ur_lon: number;
    readonly ur_lat: number;

    /** @private */
    readonly _ll_cache: Cache<[], Coords>;

    /**
     * Create a plate carree grid
     * @param ni     - The number of grid points in the i (longitude) direction
     * @param nj     - The number of grid points in the j (latitude) direction
     * @param ll_lon - The longitude of the lower left corner of the grid
     * @param ll_lat - The latitude of the lower left corner of the grid
     * @param ur_lon - The longitude of the upper right corner of the grid
     * @param ur_lat - The latitude of the upper right corner of the grid
     */
    constructor(ni: number, nj: number, ll_lon: number, ll_lat: number, ur_lon: number, ur_lat: number) {
        this.type = 'latlon';

        this.ni = ni;
        this.nj = nj;
        this.ll_lon = ll_lon;
        this.ll_lat = ll_lat;
        this.ur_lon = ur_lon;
        this.ur_lat = ur_lat;

        this._ll_cache = new Cache(() => {
            const dlon = (this.ur_lon - this.ll_lon) / (this.ni - 1);
            const dlat = (this.ur_lat - this.ll_lat) / (this.nj - 1);

            const lons = new Float32Array(this.ni * this.nj);
            const lats = new Float32Array(this.ni * this.nj);

            for (let i = 0; i < this.ni; i++) {
                for (let j = 0; j < this.nj; j++) {
                    const idx = i + j * this.ni;

                    lons[idx] = this.ll_lon + i * dlon;
                    lats[idx] = this.ll_lat + j * dlat;
                }
            }

            return {'lons': lons, 'lats': lats};
        });
    }

    /**
     * Get a list of longitudes and latitudes on the grid (internal method)
     */
    getCoords() {
        return this._ll_cache.getValue();
    }
}

class LambertGrid {
    readonly type: 'lcc';

    readonly ni: number;
    readonly nj: number;
    readonly lon_0: number;
    readonly lat_0: number;
    readonly lat_std: [number, number];
    readonly ll_x: number;
    readonly ll_y: number;
    readonly ur_x: number;
    readonly ur_y: number;
    readonly lcc: (a: number, b: number, opts?: {inverse: boolean}) => [number, number];

    readonly _ll_cache: Cache<[], Coords>;

    constructor(ni: number, nj: number, lon_0: number, lat_0: number, lat_std: [number, number], 
                ll_x: number, ll_y: number, ur_x: number, ur_y: number) {
        this.type = 'lcc';

        this.ni = ni;
        this.nj = nj;
        this.lon_0 = lon_0;
        this.lat_0 = lat_0;
        this.lat_std = lat_std;
        this.ll_x = ll_x;
        this.ll_y = ll_y;
        this.ur_x = ur_x;
        this.ur_y = ur_y;
        this.lcc = lambertConformalConic({lon_0: lon_0, lat_0: lat_0, lat_std: lat_std});

        this._ll_cache = new Cache(() => {
            const lons = new Float32Array(this.ni * this.nj);
            const lats = new Float32Array(this.ni * this.nj);

            for (let i = 0; i < this.ni; i++) {
                const x = this.ll_x + (this.ur_x - this.ll_x) * i / (this.ni - 1);
                for (let j = 0; j < this.nj; j++) {
                    const y = this.ll_y + (this.ur_y - this.ll_y) * j / (this.nj - 1);

                    const [lon, lat] = this.lcc(x, y, {inverse: true});
                    const idx = i + j * this.ni;
                    lons[idx] = lon;
                    lats[idx] = lat;
                }
            }

            return {lons: lons, lats: lats};
        });
    }

    getCoords() {
        return this._ll_cache.getValue();
    }
}

type Grid = PlateCarreeGrid | LambertGrid;
type GridType = typeof PlateCarreeGrid | typeof LambertGrid;

/** A class representing a raw 2D field of gridded data, such as height or u wind. */
class RawScalarField {
    readonly grid: Grid;
    readonly data: Float32Array;

    /** @private */
    readonly _pad_cache: Cache<[], {width: number, height: number, data: Float32Array}>;

    /**
     * Create a data field. 
     * @param grid - The grid on which the data are defined
     * @param data - The data, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid.
     */
    constructor(grid: Grid, data: Float32Array) {
        this.grid = grid;
        this.data = data;

        this._pad_cache = new Cache(() => {
            const pad_width = Math.pow(2, Math.ceil(Math.log2(this.grid.ni)));
            const pad_height = Math.pow(2, Math.ceil(Math.log2(this.grid.nj)));
    
            const data_pad = new Float32Array(pad_width * pad_height);
    
            for (let irow = 0; irow < this.grid.nj; irow++) {
                data_pad.set(this.data.slice(irow * this.grid.ni, (irow + 1) * this.grid.ni), irow * pad_width);
                data_pad.set(this.data.slice((irow + 1) * this.grid.ni - 1, (irow + 1) * this.grid.ni), irow * pad_width + this.grid.ni);
            }
            data_pad.set(this.data.slice((this.grid.nj - 1) * this.grid.ni, this.grid.nj * this.grid.ni), this.grid.nj * pad_width);
    
            return {'width': pad_width, 'height': pad_height, 'data': data_pad};
        })
    }
    
    /**
     * Pad the data such that both axes are a power of 2 in length (internal method)
     */
    getPaddedData() {
        return this._pad_cache.getValue();
    }

    /**
     * Create a new field by aggregating a number of fields using a specific function
     * @param func - A function that will be applied each element of the field. It should take the same number of arguments as fields you have and return a single number.
     * @param args - The RawScalarFields to aggregate
     * @returns a new gridded field
     * @example
     * // Compute wind speed from u and v
     * wind_speed_field = RawScalarField.aggreateFields(Math.hypot, u_field, v_field);
     */
    static aggregateFields(func: (...args: number[]) => number, ...args: RawScalarField[]) {
        function* mapGenerator<T, U>(gen: Generator<T>, func: (arg: T) => U) {
            for (const elem of gen) {
                yield func(elem);
            }
        }

        const zipped_args = zip(...args.map(a => a.data));
        const agg_data = new Float32Array(mapGenerator(zipped_args, (a: number[]): number => func(...a)));

        return new RawScalarField(args[0].grid, agg_data);
    }
}

type RawVectorField = {u: RawScalarField, v: RawScalarField};

export {RawScalarField, PlateCarreeGrid, LambertGrid};
export type {RawVectorField, Grid};