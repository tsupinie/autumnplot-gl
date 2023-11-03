
import * as Comlink from 'comlink';

import { PlotLayerWorker } from './PlotLayer.worker';
import { MapType } from './Map';
import { WebGLAnyRenderingContext, isWebGL2Ctx } from './AutumnTypes';

const worker = new Worker(new URL('./PlotLayer.worker', import.meta.url));
const layer_worker = Comlink.wrap<PlotLayerWorker>(worker);

abstract class PlotComponent {
    abstract onAdd(map: MapType, gl: WebGLAnyRenderingContext) : Promise<void>;
    abstract render(gl: WebGLAnyRenderingContext, matrix: number[]) : void;
}

function getGLFormatType(gl: WebGLAnyRenderingContext, is_float16: boolean) {
    let format, type;
    if (isWebGL2Ctx(gl)) {
        format = is_float16 ? gl.R16F : gl.R32F;
        type = is_float16 ? gl.HALF_FLOAT : gl.FLOAT;
    }
    else {
        const ext = gl.getExtension('OES_texture_half_float');
        gl.getExtension('OES_texture_float_linear');

        format = gl.LUMINANCE;
        type = is_float16 ? ext.HALF_FLOAT_OES : gl.FLOAT;
    }

    return {format: format, type: type};
}

export { PlotComponent, layer_worker, getGLFormatType };