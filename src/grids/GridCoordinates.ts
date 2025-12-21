import { Cache } from "../utils";
import { AbstractConstructor, EarthCoords, Grid, GridCoords } from "./Grid";

function gridCoordinateMixin<G extends AbstractConstructor<Grid>>(base: G) {
    abstract class GridCoordinates extends base {
        private ll_cache: Cache<[number, number], EarthCoords> | null = null;
        private gc_cache: Cache<[], GridCoords> | null = null;

        protected setupCoordinateCaches(start_i: number, end_i: number, start_j: number, end_j: number) {
            const di = (end_i - start_i) / (this.ni - 1);
            const dj = (end_j - start_j) / (this.nj - 1);

            this.ll_cache = new Cache((ni: number, nj: number) => {
                const lons = new Float32Array(ni * nj);
                const lats = new Float32Array(ni * nj);

                const di_req = (this.ni - 1) / (ni - 1) * di;
                const dj_req = (this.nj - 1) / (nj - 1) * dj;

                for (let i = 0; i < ni; i++) {
                    const x = start_i + i * di_req;
                    for (let j = 0; j < nj; j++) {
                        const y = start_j + j * dj_req;

                        const [lon, lat] = this.transform(x, y, {inverse: true});
                        const idx = i + j * ni;
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

        public getEarthCoords(ni?: number, nj?: number): EarthCoords {
            if (this.ll_cache === null) throw "Need to set up coordinate caches first";
            ni = ni === undefined ? this.ni : ni;
            nj = nj === undefined ? this.nj : nj;
            return this.ll_cache.getValue(ni, nj);
        }

        public getGridCoords(): GridCoords {
            if (this.gc_cache === null) throw "Need to set up coordinate caches first";
            return this.gc_cache.getValue();
        }
    }

    return GridCoordinates;
}

export {gridCoordinateMixin};