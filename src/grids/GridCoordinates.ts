import { Cache } from "../utils";
import { AbstractConstructor, EarthCoords, Grid, GridCoords } from "./Grid";

type GridElement = 'center' | 'edge';

function gridCoordinateMixin<G extends AbstractConstructor<Grid>>(base: G) {
    abstract class GridCoordinates extends base {
        private ll_cache: Cache<[number, number, GridElement, GridElement], EarthCoords> | null = null;
        private gc_cache: Cache<[], GridCoords> | null = null;

        protected setupCoordinateCaches(start_i: number, end_i: number, start_j: number, end_j: number) {
            const di = (end_i - start_i) / (this.ni - 1);
            const dj = (end_j - start_j) / (this.nj - 1);

            this.ll_cache = new Cache((ni: number, nj: number, which_i: GridElement, which_j: GridElement) => {
                const ni_grid = which_i == 'center' ? ni : ni + 1;
                const nj_grid = which_j == 'center' ? nj : nj + 1;
                const ni_grid_full = which_i == 'center' ? this.ni : this.ni + 1;
                const nj_grid_full = which_j == 'center' ? this.nj : this.nj + 1;
                const ni_offset = which_i == 'center' ? 0 : -di / 2;
                const nj_offset = which_j == 'center' ? 0 : -dj / 2;

                const lons = new Float32Array(ni_grid * nj_grid);
                const lats = new Float32Array(ni_grid * nj_grid);

                const di_req = (ni_grid_full - 1) / (ni_grid - 1) * di;
                const dj_req = (nj_grid_full - 1) / (nj_grid - 1) * dj;

                for (let i = 0; i < ni_grid; i++) {
                    const x = start_i + i * di_req + ni_offset;
                    for (let j = 0; j < nj_grid; j++) {
                        const y = start_j + j * dj_req + nj_offset;

                        const [lon, lat] = this.transform(x, y, {inverse: true});
                        const idx = i + j * ni_grid;
                        lons[idx] = lon;
                        lats[idx] = lat;
                    }
                }

                return {lons: lons, lats: lats};
            });

            this.gc_cache = new Cache(() => {
                const x = new Float32Array(this.ni);
                const y = new Float32Array(this.nj);

                for (let i = 0; i < this.ni; i++) {
                    x[i] = start_i + i * di;
                }

                for (let j = 0; j < this.nj; j++) {
                    y[j] = start_j + j * dj;
                }

                return {x: x, y: y};
            });
        }

        public getEarthCoords(ni?: number, nj?: number, which_i?: GridElement, which_j?: GridElement): EarthCoords {
            if (this.ll_cache === null) throw "Need to set up coordinate caches first";
            ni = ni === undefined ? this.ni : ni;
            nj = nj === undefined ? this.nj : nj;
            which_i = which_i === undefined ? 'center' : which_i;
            which_j = which_j === undefined ? 'center' : which_j;
            return this.ll_cache.getValue(ni, nj, which_i, which_j);
        }

        public getGridCoords(): GridCoords {
            if (this.gc_cache === null) throw "Need to set up coordinate caches first";
            return this.gc_cache.getValue();
        }
    }

    return GridCoordinates;
}

export {gridCoordinateMixin};
export type {GridElement};