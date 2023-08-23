
import * as Comlink from 'comlink';

import { PlotLayerWorker } from './PlotLayer.worker';
import { MapType } from './Map';
import { WebGLAnyRenderingContext } from './AutumnTypes';

const worker = new Worker(new URL('./PlotLayer.worker', import.meta.url));
const layer_worker = Comlink.wrap<PlotLayerWorker>(worker);

abstract class PlotComponent {
    abstract onAdd(map: MapType, gl: WebGLAnyRenderingContext) : Promise<void>;
    abstract render(gl: WebGLAnyRenderingContext, matrix: number[]) : void;
}

export { PlotComponent, layer_worker };