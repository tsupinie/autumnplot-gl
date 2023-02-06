
import * as Comlink from 'comlink';

import { PlotLayerWorker } from './PlotLayer.worker';
import { MapType } from './Map';

const worker = new Worker(new URL('./PlotLayer.worker', import.meta.url));
const layer_worker = Comlink.wrap<PlotLayerWorker>(worker);

abstract class PlotComponent {
    abstract onAdd(map: MapType, gl: WebGLRenderingContext) : Promise<void>;
    abstract render(gl: WebGLRenderingContext, matrix: number[]) : void;
}

export { PlotComponent, layer_worker };