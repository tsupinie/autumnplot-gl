
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
    const is_webgl2 = isWebGL2Ctx(gl);

    if (is_float16) {
        const ext = gl.getExtension('OES_texture_half_float');
        const ext_lin = gl.getExtension('OES_texture_float_linear');

        if ((!is_webgl2 && ext === null) || ext_lin === null) {
            throw "Float16 data are not supported on this hardware. Try Float32 data instead.";
        }

        format = is_webgl2 ? gl.R16F : gl.LUMINANCE;
        type = is_webgl2 ? gl.HALF_FLOAT : ext.HALF_FLOAT_OES;
    }
    else {
        const ext = gl.getExtension('OES_texture_float');
        const ext_lin = gl.getExtension('OES_texture_float_linear');

        if ((!is_webgl2 && ext === null) || ext_lin === null) {
            throw "Float32 data are not supported on this hardware. Try Float16 data instead.";
        }

        format = is_webgl2 ? gl.R32F : gl.LUMINANCE;
        type = gl.FLOAT;
    }

    return {format: format, type: type};
}

export { PlotComponent, layer_worker, getGLFormatType };