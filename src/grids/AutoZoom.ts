import { WGLBuffer, WGLTexture, WGLTextureSpec } from "autumn-wgl";
import { TypedArray, WebGLAnyRenderingContext } from "../AutumnTypes";
import { Cache } from "../utils";
import { AbstractConstructor, Grid } from "./Grid";
import { getGLFormatTypeAlignment, layer_worker } from "../PlotComponent";
import { Float16Array } from "@petamoriken/float16";

async function makeWGLBillboardBuffers(gl: WebGLAnyRenderingContext, grid: AutoZoomGrid<Grid>, thin_fac: number, map_max_zoom: number) {
    const {lats: field_lats, lons: field_lons} = grid.getEarthCoords();
    const min_zoom = grid.getMinVisibleZoom(thin_fac);
    const bb_elements = await layer_worker.makeBBElements(field_lats, field_lons, min_zoom, grid.ni, grid.nj, map_max_zoom);

    const vertices = new WGLBuffer(gl, bb_elements['pts'], 2, gl.POINTS, {per_instance: true});
    const texcoords = new WGLBuffer(gl, bb_elements['tex_coords'], 2, gl.POINTS, {per_instance: true});

    return {'vertices': vertices, 'texcoords': texcoords};
}

function makeVectorRotationTexture(gl: WebGLAnyRenderingContext, grid: AutoZoomGrid<Grid>, data_are_earth_relative: boolean) {
    const coords = grid.getEarthCoords();

    const rot_vals = new Float16Array(grid.ni * grid.nj).fill(parseFloat('nan'));

    if (data_are_earth_relative) {
        rot_vals.fill(0);
    }
    else {
        if (!grid.is_conformal) {
            // If the grid is non-conformal, we need a fully general change of basis from grid coordinates to earth coordinates. This is not supported for now, so warn about it.
            console.warn('Vector rotations for non-conformal projections are not supported. The output may look incorrect.')
        }

        for (let icd = 0; icd < coords.lats.length; icd++) {
            const lon = coords.lons[icd];
            const lat = coords.lats[icd];
    
            rot_vals[icd] = grid.getVectorRotationAtPoint(lon, lat);
        }
    }

    const {format, type, row_alignment} = getGLFormatTypeAlignment(gl, 'float16');

    const rot_img: WGLTextureSpec = {
        format: format, type: type, row_alignment: row_alignment, image: new Uint16Array(rot_vals.buffer),
        width: grid.ni, height: grid.nj, mag_filter: gl.LINEAR
    };

    const rot_tex = new WGLTexture(gl, rot_img);
    return {'rotation': rot_tex};
}

function autoZoomGridMixin<G extends AbstractConstructor<Grid>>(base: G) {
    abstract class AutoZoomGrid extends base {
        private readonly billboard_buffer_cache: Cache<[WebGLAnyRenderingContext, number, number], Promise<{'vertices': WGLBuffer, 'texcoords': WGLBuffer}>>;
        private readonly vector_rotation_cache: Cache<[WebGLAnyRenderingContext, boolean], {'rotation': WGLTexture}>

        constructor(...args: any[]) {
            super(...args);

            this.billboard_buffer_cache = new Cache((gl: WebGLAnyRenderingContext, thin_fac: number, max_zoom: number) => {
                return makeWGLBillboardBuffers(gl, this, thin_fac, max_zoom);
            });

            this.vector_rotation_cache = new Cache((gl: WebGLAnyRenderingContext, data_are_earth_relative: boolean) => {
                return makeVectorRotationTexture(gl, this, data_are_earth_relative);
            });
        }

        public async getWGLBillboardBuffers(gl: WebGLAnyRenderingContext, thin_fac: number, max_zoom: number) {
            return await this.billboard_buffer_cache.getValue(gl, thin_fac, max_zoom);
        }

        public getVectorRotationTexture(gl: WebGLAnyRenderingContext, data_are_earth_relative: boolean) {
            return this.vector_rotation_cache.getValue(gl, data_are_earth_relative);
        }

        public getVectorRotationAtPoint(lon: number, lat: number) {    
            const [x, y] = this.transform(lon, lat);
            const [x_pertlon, y_pertlon] = this.transform(lon + 0.01, lat);
            return Math.atan2(y_pertlon - y, x_pertlon - x);
        }

        public abstract getThinnedGrid(thin_fac: number, map_max_zoom: number): AutoZoomGrid;
        public abstract thinDataArray<ArrayType extends TypedArray>(original_grid: AutoZoomGrid, ary: ArrayType): ArrayType;
        public abstract getMinVisibleZoom(thin_fac: number): Uint8Array;
    }

    return AutoZoomGrid;
}

type AutoZoomGrid<T extends Grid> = InstanceType<ReturnType<typeof autoZoomGridMixin<AbstractConstructor<T>>>>;

export {autoZoomGridMixin};
export type {AutoZoomGrid};