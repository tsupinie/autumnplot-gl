
import { DateTime } from 'luxon';
import { AutumnMap } from './AutumnMap';

import { Field } from './Field';

const ENV_FMT = 'yyyyMMddHH';

abstract class AutumnFieldLayerBase {
    readonly type: 'custom';
    readonly id: string;

    constructor(id: string) {
        this.type = 'custom';
        this.id = id;
    }

    abstract onAdd(map: AutumnMap, gl: WebGLRenderingContext) : void;
    abstract render(gl: WebGLRenderingContext, matrix: number[]) : void;
}

class AutumnFieldLayer extends AutumnFieldLayerBase {
    readonly field: Field;

    constructor(id: string, field: Field) {
        super(id);
        this.field = field;
    }

    onAdd(map: AutumnMap, gl: WebGLRenderingContext) {
        this.field.onAdd(map, gl);
    }

    render(gl: WebGLRenderingContext, matrix: number[]) {
        this.field.render(gl, matrix);
    }
}

class AutumnTimeFieldLayer extends AutumnFieldLayerBase {
    fields: Record<string, Field>;
    field_key: string | null;

    map: AutumnMap | null;
    gl: WebGLRenderingContext | null

    constructor(id: string) {
        super(id);

        this.fields = {};
        this.field_key = null;
        this.map = null;
        this.gl = null;
    }

    onAdd(map: AutumnMap, gl: WebGLRenderingContext) {
        this.map = map;
        this.gl = gl;

        Object.values(this.fields).forEach(field => {
            field.onAdd(map, gl).then(res => {
                this._repaintIfNecessary(null);
            });
        });

        this._repaintIfNecessary(null);
    }

    render(gl: WebGLRenderingContext, matrix: number[]) {
        if (this.map !== null && this.gl !== null && this.field_key !== null 
            && this.fields.hasOwnProperty(this.field_key) && this.fields[this.field_key] !== null) {
            this.fields[this.field_key].render(gl, matrix);
        }
    }

    setDatetime(dt: DateTime) {
        const key = dt.toFormat(ENV_FMT);

        const old_field_key = this.field_key;
        this.field_key = key;

        this._repaintIfNecessary(old_field_key);
    }

    getDatetimes() {
        let dts = Object.keys(this.fields).map(key => DateTime.fromFormat(key, ENV_FMT, {'zone': 'utc'}));
        dts.sort((a, b) => a.toMillis() - b.toMillis());
        return dts;
    }

    addField(field: Field, dt: DateTime) {
        const key = dt.toFormat(ENV_FMT);
        const old_field_key = this.field_key;

        if (this.map !== null && this.gl !== null && field !== null) {
            field.onAdd(this.map, this.gl).then(res => {
                this._repaintIfNecessary(null);
            });
        }

        this.fields[key] = field;
        
        if (this.field_key === null) {
            this.field_key = key;
        }
    }

    _repaintIfNecessary(old_field_key: string | null) {
        if (this.map !== null && old_field_key !== this.field_key) {
            this.map.triggerRepaint();
        }
    }
}

export {AutumnFieldLayer, AutumnTimeFieldLayer};