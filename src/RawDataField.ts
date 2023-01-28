
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

class PlateCarreeGrid {
    readonly type: 'latlon';

    readonly ni: number;
    readonly nj: number;
    readonly ll_lon: number;
    readonly ll_lat: number;
    readonly ur_lon: number;
    readonly ur_lat: number;

    readonly _ll_cache: Cache<[], Coords>;

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

            const lons = new Float32Array(this.ni);
            const lats = new Float32Array(this.nj);

            for (let i = 0; i < this.ni; i++) {
                lons[i] = this.ll_lon + i * dlon;
            }

            for (let j = 0; j < this.nj; j++) {
                lats[j] = this.ll_lat + j * dlat;
            }

            return {'lons': lons, 'lats': lats};
        });
    }

    getCoords() {
        return this._ll_cache.getValue();
    }

    static fromBuffer(buffer: Uint8Array, offset: number) {
        const dims = new Uint16Array(buffer.buffer, offset, 2);
        const [ni, nj] = [...dims];

        const grid_def = new Float32Array(buffer.buffer, offset + 4, 4);
        const [ll_lon, ll_lat, ur_lon, ur_lat] = [...grid_def];

        return {
            'grid': new PlateCarreeGrid(ni, nj, ll_lon, ll_lat, ur_lon, ur_lat),
            'nbytesread': 20
        }
    }
}

class LambertGrid {
    readonly type: 'lcc';

    readonly ni: number;
    readonly nj: number;

    readonly _ll_cache: Cache<[], Coords>;

    constructor(ni: number, nj: number) {
        this.type = 'lcc';

        this.ni = ni;
        this.nj = nj;

        this._ll_cache = new Cache(() => {
            return {
                'lons': new Float32Array(this.ni),
                'lats': new Float32Array(this.nj)
            }
        });
    }

    getCoords() {
        return this._ll_cache.getValue();
    }

    static fromBuffer(buffer: Uint8Array, offset: number) {
        const dims = new Uint16Array(buffer.buffer, offset, 2);
        const [ni, nj] = [...dims];

        return {
            'grid': new LambertGrid(ni, nj),
            'nbytesread': 4
        };
    }
}

type Grid = PlateCarreeGrid | LambertGrid;
type GridType = typeof PlateCarreeGrid | typeof LambertGrid;

class RawDataField {
    readonly grid: Grid;
    readonly data: Float32Array;

    readonly _pad_cache: Cache<[], {width: number, height: number, data: Float32Array}>;

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
    
    getPaddedData() {
        return this._pad_cache.getValue();
    }

    static aggregateFields(func: (...args: number[]) => number, ...args: RawDataField[]) {
        function* mapGenerator<T, U>(gen: Generator<T>, func: (arg: T) => U) {
            for (const elem of gen) {
                yield func(elem);
            }
        }

        const zipped_args = zip(...args.map(a => a.data));
        const agg_data = new Float32Array(mapGenerator(zipped_args, (a: number[]): number => func(...a)));

        return new RawDataField(args[0].grid, agg_data);
    }
}

export {RawDataField, PlateCarreeGrid};