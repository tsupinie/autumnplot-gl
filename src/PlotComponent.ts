
import * as Comlink from 'comlink';

import { getOS } from "./utils";
import { PlotLayerWorker } from './PlotLayer.worker';
import { MapType } from './Map';
import { WebGLAnyRenderingContext, isWebGL2Ctx } from './AutumnTypes';

const worker = new Worker(new URL('./PlotLayer.worker', import.meta.url));
const layer_worker = Comlink.wrap<PlotLayerWorker>(worker);

abstract class PlotComponent {
    public abstract onAdd(map: MapType, gl: WebGLAnyRenderingContext) : Promise<void>;
    public abstract render(gl: WebGLAnyRenderingContext, matrix: number[]) : void;
}

function getGLFormatTypeAlignment(gl: WebGLAnyRenderingContext, is_float16: boolean) {
    let format, type, row_alignment;
    const is_webgl2 = isWebGL2Ctx(gl);

    if (is_float16) {
        const ext = gl.getExtension('OES_texture_half_float');
        const ext_lin = gl.getExtension('OES_texture_half_float_linear');

        if ((!is_webgl2 && ext === null) || (!is_webgl2 && ext_lin === null)) {
            throw "Float16 data are not supported on this hardware. Try Float32 data instead.";
        }

        format = is_webgl2 ? gl.R16F : gl.LUMINANCE;
        type = is_webgl2 ? gl.HALF_FLOAT : ext.HALF_FLOAT_OES;
        row_alignment = 2;
    }
    else {
        const ext = gl.getExtension('OES_texture_float');
        const ext_lin = gl.getExtension('OES_texture_float_linear');

		// As of 11/3/2023, Safari/WebKit on iOS reports as supporting float textures,
		// but really doesn't. It just silently fails. In WebGL 1, Safari/Webkit returns
		// null for ext_lin here, but in WebGL2, both ext vars are null because they were 
		// merged into the standard. This means that to properly fail for iOS devices using
		// WebGL2, we have to hard code an OS check... this OS check also works when uers
		// request desktop-mode websites.
		if ((!is_webgl2 && ext === null) || (!is_webgl2 && ext_lin === null) || (getOS() === 'iOS')) {	
            throw "Float32 data are not supported on this hardware. Try Float16 data instead.";
        }

        format = is_webgl2 ? gl.R32F : gl.LUMINANCE;
        type = gl.FLOAT;
        row_alignment = 4;
    }

    return {format: format, type: type, row_alignment: row_alignment};
}

export { PlotComponent, layer_worker, getGLFormatTypeAlignment };
