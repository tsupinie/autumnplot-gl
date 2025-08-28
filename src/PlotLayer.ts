
import { RenderMethodArg, WebGLAnyRenderingContext } from './AutumnTypes';
import { MapLikeType } from './Map';

import { PlotComponent } from './PlotComponent';

abstract class PlotLayerBase<MapType extends MapLikeType> {
    public readonly type: 'custom';
    public readonly id: string;
    protected map: MapType | null;

    constructor(id: string) {
        this.type = 'custom';
        this.id = id;
        this.map = null;
    }

    public abstract onAdd(map: MapType, gl: WebGLAnyRenderingContext) : void;
    public abstract render(gl: WebGLAnyRenderingContext, matrix: number[] | Float32Array) : void;

    protected repaint() {
        if (this.map !== null) {
            this.map.triggerRepaint();
        }
    }
}

/** 
 * A static map layer. The data are assumed to be static in time. If the data have a time component (e.g., a model forecast), a {@link MultiPlotLayer} 
 * may be more appropriate.
 * @example
 * // Create map layers from provided fields
 * const height_layer = new PlotLayer('height-contours', height_contours);
 * const wind_speed_layer = new PlotLayer('wind-speed-fill', wind_speed_fill);
 * const barb_layer = new PlotLayer('barbs', wind_barbs);
 */
class PlotLayer<MapType extends MapLikeType> extends PlotLayerBase<MapType> {
    private readonly field: PlotComponent<MapType>;

    /**
     * Create a map layer from a field
     * @param id    - A unique id for this layer
     * @param field - The field to plot in this layer
     */
    constructor(id: string, field: PlotComponent<MapType>) {
        super(id);
        this.field = field;
    }

    /**
     * @internal
     * Add this layer to a map
     */
    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        this.map = map;
        await this.field.onAdd(map, gl);
    }

    /**
     * @internal
     * Render this layer
     */
    public render(gl: WebGLAnyRenderingContext, matrix: RenderMethodArg) {
        this.field.render(gl, matrix);
    }
}

/**
 * A varying map layer. If the data don't have a varying component, such as over time, it might be easier to use a {@link PlotLayer} instead.
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
class MultiPlotLayer<MapType extends MapLikeType> extends PlotLayerBase<MapType> {
    private fields: Record<string, PlotComponent<MapType>>;
    private field_key: string | null;

    private gl: WebGLAnyRenderingContext | null;

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
                this.repaint();
            });
        });

        this.repaint();
    }

    /**
     * @internal
     * Render this layer
     */
    public render(gl: WebGLAnyRenderingContext, matrix: RenderMethodArg) {
        if (this.map !== null && this.gl !== null && this.field_key !== null 
            && this.fields.hasOwnProperty(this.field_key) && this.fields[this.field_key] !== null) {
            this.fields[this.field_key].render(gl, matrix);
        }
    }

    /**
     * Set the active key
     * @param key - The new key. The field with that key is plotted immediately.
     */
    public setActiveKey(key: string) {
        const old_field_key = this.field_key;
        this.field_key = key;

        this.repaint();
    }

    /**
     * Get a list of all dates/times that have been added to the layer
     * @returns An array of dates/times
     */
    public getKeys() {
        return Object.keys(this.fields);
    }

    /**
     * Add a field with a given key
     * @param field - The field to add
     * @param key   - The key to associate with the field
     */
    public addField(field: PlotComponent<MapType>, key: string) {
        const old_field_key = this.field_key;

        if (this.map !== null && this.gl !== null && field !== null) {
            field.onAdd(this.map, this.gl).then(res => {
                this.repaint();
            });
        }

        this.fields[key] = field;
        
        if (this.field_key === null) {
            this.field_key = key;
        }
    }
}

export {PlotLayer, MultiPlotLayer};