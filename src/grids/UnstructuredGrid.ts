import { kdTree } from "kd-tree-javascript";
import { Cache, argMin, getArrayConstructor } from "../utils";
import { autoZoomGridMixin } from "./AutoZoom";
import { Grid, GridCoords } from "./Grid";
import { LngLat } from "../Map";
import { TypedArray } from "../AutumnTypes";

/** An unstructured grid defined by a list of latitudes and longitudes */
class UnstructuredGrid extends autoZoomGridMixin(Grid) {
    public readonly coords: {lon: number, lat: number}[];
    private readonly zoom_cache: Cache<[number], Uint8Array>
    private readonly zoom_arg: Uint8Array | null;

    /**
     * Create an unstructured grid
     * @param coords - The lat/lon coordinates of the grid points
     */
    constructor(coords: {lon: number, lat: number}[], zoom?: Uint8Array) {
        const MAX_DIM = 4096;

        super('unstructured', true, Math.min(coords.length, MAX_DIM), Math.floor(coords.length / MAX_DIM) + 1);
        this.coords = coords;
        this.zoom_arg = zoom === undefined ? null : zoom;

        this.zoom_cache = new Cache((thin_fac: number) => {
            interface kdNode {
                x: number;
                y: number;
                min_zoom: number;
            }
    
            const MAP_MAX_ZOOM = 24;
            const offset = Math.log2(thin_fac);
            const kd_nodes = this.coords.map(c => ({...new LngLat(c.lon, c.lat).toMercatorCoord(), min_zoom: MAP_MAX_ZOOM} as kdNode));
            const tree = new kdTree([...kd_nodes], (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)), ['x', 'y']);
    
            const recursiveThin = (x: number, y: number, depth: number) => {
                const size = Math.pow(0.5, depth + 1);
                const nodes = tree.nearest({x: x, y: y, min_zoom: 0}, 2, size);

                if (nodes.length > 0) {
                    const [node, dist] = nodes.sort((a, b) => a[1] - b[1])[0];
                    if (node.min_zoom == MAP_MAX_ZOOM) {
                        node.min_zoom = Math.max(depth - offset, 0);
                    }
                }

                if (nodes.length > 1 && depth < MAP_MAX_ZOOM + offset) {
                    recursiveThin(x - size / 2, y - size / 2, depth + 1);
                    recursiveThin(x + size / 2, y - size / 2, depth + 1);
                    recursiveThin(x - size / 2, y + size / 2, depth + 1);
                    recursiveThin(x + size / 2, y + size / 2, depth + 1);
                }
            }

            recursiveThin(0.5, 0.5, 0);

            return new Uint8Array(kd_nodes.map(n => n.min_zoom));
        });
    }

    /** @internal */
    public copy() {
        return new UnstructuredGrid(this.coords);
    }

    /** @internal */
    public getEarthCoords() {
        return {lons: new Float32Array(this.coords.map(c => c.lon)), lats: new Float32Array(this.coords.map(c => c.lat))};
    }

    /** @internal */
    public getGridCoords() {
        const {lons, lats} = this.getEarthCoords();
        return {x: lons, y: lats} as GridCoords;
    }

    /** @internal */
    public transform(x: number, y: number, opts?: {inverse?: boolean}) {
        return [x, y] as [number, number];
    }

    /** @internal */
    public getMinVisibleZoom(thin_fac: number) {
        if (this.zoom_arg !== null) 
            return this.zoom_arg;
        return this.zoom_cache.getValue(thin_fac);
    }

    /** @internal */
    public getThinnedGrid(thin_fac: number, map_max_zoom: number) {
        const min_zoom = this.getMinVisibleZoom(thin_fac);
        return new UnstructuredGrid(this.coords.filter((ll, ill) => min_zoom[ill] <= map_max_zoom), min_zoom.filter(ll => ll <= map_max_zoom))
    }

    /** @internal */
    public thinDataArray<ArrayType extends TypedArray>(original_grid: UnstructuredGrid, ary: ArrayType) {
        let i_new = 0;
        
        const arrayType = getArrayConstructor(ary);
        const new_data = new arrayType(this.ni * this.nj);

        for (let i = 0; i < original_grid.coords.length; i++) {
            if (this.coords[i_new].lat == original_grid.coords[i].lat && this.coords[i_new].lon == original_grid.coords[i].lon) {
                new_data[i_new++] = ary[i];

                if (i_new >= this.coords.length) break;
            }
        }

        return new_data;
    }

    public sampleNearestGridPoint(lon: number, lat: number, ary: TypedArray): {sample: number, sample_lon: number, sample_lat: number} {
        // TAS: This is gonna be slow. Need to think about using the kdTree here.
        const idx = argMin(this.coords.map(c => (c.lon - lon) * (c.lon - lon) + (c.lat - lat) * (c.lat - lat)));
        return {sample: ary[idx], sample_lon: this.coords[idx].lon, sample_lat: this.coords[idx].lat};
    }
}

export {UnstructuredGrid};