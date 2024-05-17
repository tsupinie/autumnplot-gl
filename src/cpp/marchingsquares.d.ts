import { type MainModule } from "./marchingsquares_embind";

export type MarchingSquaresModule = MainModule & EmscriptenModule;

declare const Module: EmscriptenModuleFactory<MarchingSquaresModule>;
export default Module;