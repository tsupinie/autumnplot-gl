
// Should rename this eventually
import Module from './cpp/marchingsquares';
import { MarchingSquaresModule } from './cpp/marchingsquares';
import './cpp/marchingsquares.wasm';

let msm_promise: Promise<MarchingSquaresModule> | null = null;

interface InitMSModuleOpts {
    document_script?: string;
}

function initMSModule(opts: InitMSModuleOpts) {
    if (msm_promise === null) {
        msm_promise = Module({'locateFile': (fname: string, dir: string) => (opts.document_script === undefined ? dir : opts.document_script) + fname});
    }

    return msm_promise;
}

export {initMSModule};