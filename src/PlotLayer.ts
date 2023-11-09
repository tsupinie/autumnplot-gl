
import { WebGLAnyRenderingContext } from './AutumnTypes';
import { MapType } from './Map';

import { PlotComponent } from './PlotComponent';

abstract class PlotLayerBase {
    public readonly type: 'custom';
    public readonly id: string;

    constructor(id: string) {
        this.type = 'custom';
        this.id = id;
    }

    public abstract onAdd(map: MapType, gl: WebGLAnyRenderingContext) : void;
    public abstract render(gl: WebGLAnyRenderingContext, matrix: number[]) : void;
}

/** 
 * A static map layer. The data are assumed to be static in time. If the data have a time component (e.g., a model forecast), an {@link MultiPlotLayer} 
 * may be more appropriate.
 * @example
 * // Create map layers from provided fields
 * const height_layer = new PlotLayer('height-contours', height_contours);
 * const wind_speed_layer = new PlotLayer('wind-speed-fill', wind_speed_fill);
 * const barb_layer = new PlotLayer('barbs', wind_barbs);
 */
class PlotLayer extends PlotLayerBase {
    private readonly field: PlotComponent;

    /**
     * Create a map layer from a field
     * @param id    - A unique id for this layer
     * @param field - The field to plot in this layer
     */
    constructor(id: string, field: PlotComponent) {
        super(id);
        this.field = field;
    }

    /**
     * @internal
     * Add this layer to a map
     */
    public onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        this.field.onAdd(map, gl);
    }

    /**
     * @internal
     * Render this layer
     */
    public render(gl: WebGLAnyRenderingContext, matrix: number[]) {
        this.field.render(gl, matrix);
    }
}

/**
 * A varying map layer. If the data don't have a varying component, such as over time, it might be easier to use an {@link PlotLayer} instead.
 * @example
 * // Create a varying map layer
 * height_layer = new MultiPlotLayer('height-contours');
 * 
 * // Add some fields to it
 * height_layer.addField(height_contour_f00, '20230112_1200');
 * height_layer.addField(height_contour_f01, '20230112_1300');
 * height_layer.addField(height_contour_f02, '20230112_1400');
 * 
 * // Set the date/time in the map layer
 * height_layer.setActiveKey('20230112_1200');
 */
class MultiPlotLayer extends PlotLayerBase {
    private fields: Record<string, PlotComponent>;
    private field_key: string | null;

    private map: MapType | null;
    private gl: WebGLAnyRenderingContext | null

    /**
     * Create a time-varying map layer
     * @param id - A unique id for this layer
     */
    constructor(id: string) {
        super(id);

        this.fields = {};
        this.field_key = null;
        this.map = null;
        this.gl = null;
    }

    /**
     * @internal
     * Add this layer to a map
     */
    public onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        this.map = map;
        this.gl = gl;

        Object.values(this.fields).forEach(field => {
            field.onAdd(map, gl).then(res => {
                this.repaintIfNecessary(null);
            });
        });

        this.repaintIfNecessary(null);
    }

    /**
     * @internal
     * Render this layer
     */
    public render(gl: WebGLAnyRenderingContext, matrix: number[]) {
        if (this.map !== null && this.gl !== null && this.field_key !== null 
            && this.fields.hasOwnProperty(this.field_key) && this.fields[this.field_key] !== null) {
            this.fields[this.field_key].render(gl, matrix);
        }
    }

    /**
     * Set the active key
     * @param key - The new key
     */
    public setActiveKey(key: string) {
        const old_field_key = this.field_key;
        this.field_key = key;

        this.repaintIfNecessary(old_field_key);
    }

    /**
     * Get a list of all dates/times that have been added to the layer
     * @returns An array of dates/times
     */
    public getKeys() {
        return Object.keys(this.fields);
    }

    /**
     * Add a field valid at a specific date/time
     * @param field - The field to add
     * @param dt    - The date/time at which the field is valid
     */
    public addField(field: PlotComponent, key: string) {
        const old_field_key = this.field_key;

        if (this.map !== null && this.gl !== null && field !== null) {
            field.onAdd(this.map, this.gl).then(res => {
                this.repaintIfNecessary(null);
            });
        }

        this.fields[key] = field;
        
        if (this.field_key === null) {
            this.field_key = key;
        }
    }

    private repaintIfNecessary(old_field_key: string | null) {
        if (this.map !== null && old_field_key !== this.field_key) {
            this.map.triggerRepaint();
        }
    }
}

export {PlotLayer, MultiPlotLayer};