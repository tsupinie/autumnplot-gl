import { WGLBuffer } from "autumn-wgl";
import { WebGLAnyRenderingContext } from "../AutumnTypes";
import { Cache } from "../utils";
import { AbstractConstructor, Grid } from "./Grid";

type DomainBuffers = {vertices: WGLBuffer, texcoords: WGLBuffer};

function domainBufferMixin<G extends AbstractConstructor<Grid>>(base: G) {
    abstract class DomainBufferMixin extends base {
        private readonly buffer_cache: Cache<[WebGLAnyRenderingContext], Promise<DomainBuffers>>;

        constructor(...args: any[]) {
            super(...args);

            this.buffer_cache = new Cache((gl: WebGLAnyRenderingContext) => {
                return this.makeDomainBuffers(gl);
            });
        }

        protected abstract makeDomainBuffers(gl: WebGLAnyRenderingContext) : Promise<DomainBuffers>;

        public async getDomainBuffers(gl: WebGLAnyRenderingContext) {
            return await this.buffer_cache.getValue(gl);
        }
    }

    return DomainBufferMixin;
}

type DomainBufferGrid<T extends Grid = Grid> = InstanceType<ReturnType<typeof domainBufferMixin<AbstractConstructor<T>>>>;

export {domainBufferMixin};
export type {DomainBuffers, DomainBufferGrid};