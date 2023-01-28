
import * as Comlink from 'comlink';

import { AutumnFieldLayerWorker } from './AutumnFieldLayer.worker';
import { AutumnMap } from './AutumnMap';

const worker = new Worker(new URL('./AutumnFieldLayer.worker', import.meta.url));
const layer_worker = Comlink.wrap<AutumnFieldLayerWorker>(worker);

abstract class Field {
    abstract onAdd(map: AutumnMap, gl: WebGLRenderingContext) : Promise<void>;
    abstract render(gl: WebGLRenderingContext, matrix: number[]) : void;
}

export { Field, layer_worker };