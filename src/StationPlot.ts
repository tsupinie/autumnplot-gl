
import { WebGLAnyRenderingContext } from "./AutumnTypes";
import { MapLikeType } from "./Map";
import { PlotComponent } from "./PlotComponent";
import { normalizeOptions } from "./utils";
import { Grid } from "./Grid";
import { RawObsField } from "./RawField";
import { HorizontalAlign, TextCollection, TextCollectionOptions, TextSpec, VerticalAlign } from "./TextCollection";
import { Float16Array } from "@petamoriken/float16";
import { Color } from "./Color";
import Barbs from "./Barbs";

type SPPositions = 'cl' | 'll' | 'lc' | 'lr' | 'cr' | 'ur' | 'uc' | 'ul' | 'c';

interface SPConfigBase {
    pos: SPPositions;
    color?: string;
}

interface SPTextConfig extends SPConfigBase {
    type: 'text';
    n_decimal_places?: number;
}

interface SPBarbConfig extends SPConfigBase {
    type: 'barb';
    barb_size_multipler?: number;
}

interface SPSymbolConfig extends SPConfigBase {
    type: 'symbol';
}

type SPConfig = SPTextConfig | SPBarbConfig; // | SPSymbolConfig;
type SPDataPosition<ObsFieldName extends string> = Record<ObsFieldName, SPConfig>;

interface StationPlotOptions {
    thin_fac?: number;
    font_face?: string;
    font_size?: number;
    font_url_template?: string;
}

const station_plot_opts_defaults: Required<StationPlotOptions> = {
    thin_fac: 1,
    font_face: 'Trebuchet MS',
    font_size: 12,
    font_url_template: '',
};

interface StationPlotGLElems<GridType extends Grid, MapType extends MapLikeType> {
    map: MapType;
    components: (TextCollection | Barbs<Float16Array, GridType, MapType>)[];
}

class StationPlot<GridType extends Grid, MapType extends MapLikeType, ObsFieldName extends string> extends PlotComponent<MapType> {
    public readonly field: RawObsField<GridType, ObsFieldName>;
    public readonly config: SPDataPosition<ObsFieldName>;
    public readonly opts: Required<StationPlotOptions>;
    private gl_elems: StationPlotGLElems<GridType, MapType> | null;

    constructor(field: RawObsField<GridType, ObsFieldName>, config: SPDataPosition<ObsFieldName>, opts: StationPlotOptions) {
        super();

        this.field = field;
        this.config = config;
        this.opts = normalizeOptions(opts, station_plot_opts_defaults);
        this.gl_elems = null;
    }

    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        const keys = this.field.getObsFieldNames();

        const map_style = map.getStyle();

        const font_url_template = this.opts.font_url_template == '' ? map_style.glyphs : this.opts.font_url_template;
        if (font_url_template === undefined)
            throw "The map style doesn't have any glyph information. Please pass the font_url_template option to StationPlot";

        const font_url = font_url_template.replace('{range}', '0-255').replace('{fontstack}', this.opts.font_face);

        const sub_component_promises = Object.entries<SPConfig>(this.config).map(async ([k_, config]) => {
            const k = k_ as ObsFieldName;

            if (config.type === 'text') {
                const comp = this.field.getScalar(k);

                const pos = config.pos;
                const color_opt = config.color;
                const color = color_opt === undefined ? Color.fromHex('#000000') : Color.normalizeColor(color_opt);
                const n_decimal_places = config.n_decimal_places === undefined ? 0 : config.n_decimal_places;
                const pow = Math.pow(10, n_decimal_places);

                const coords = this.field.grid.getEarthCoords();
                const zoom = this.field.grid.getMinVisibleZoom(this.opts.thin_fac);
                const text_specs: TextSpec[] = comp.map((v, i) => ({text: typeof v == 'number' ? (Math.round(v * pow) / pow).toString() : v.toString(), 
                                                                    lat: coords.lats[i], lon: coords.lons[i], min_zoom: zoom[i]}));

                let ha: HorizontalAlign, va: VerticalAlign;
                let xoff: number, yoff: number;
                const off_size = 10;

                if(pos == 'll' || pos == 'cl' || pos == 'ul')      { ha = 'right'; xoff = -off_size; }
                else if (pos == 'lc' || pos == 'c' || pos == 'uc') { ha = 'center'; xoff = 0; }
                else                                               { ha = 'left'; xoff = off_size;}

                if (pos == 'll' || pos == 'lc' || pos == 'lr')     { va = 'top'; yoff = -off_size; }
                else if (pos == 'cl' || pos == 'c' || pos == 'cr') { va = 'middle'; yoff = 0; }
                else                                               { va = 'baseline'; yoff = off_size; }

                const tc_opts: TextCollectionOptions = {
                    horizontal_align: ha, vertical_align: va, font_size: this.opts.font_size, offset_x: xoff, offset_y: yoff,
                    halo: true, 
                    text_color: color, halo_color: Color.fromHex('#ffffff'),
                };

                return await TextCollection.make(gl, text_specs, font_url, tc_opts);
            }
            else if (config.type == 'barb') {
                const comp = this.field.getVector(k);

                const color = config.color === undefined ? '#000000' : config.color;
                const barb_size = config.barb_size_multipler === undefined ? 1 : config.barb_size_multipler;
                const barb_comp = new Barbs<Float16Array, GridType, MapType>(comp, {thin_fac: this.opts.thin_fac, color: color, barb_size_multiplier: barb_size});
                await barb_comp.onAdd(map, gl);
                return barb_comp;
            }
            else {
                throw `Unknown station plot configuration type ${(config as any).type}`;
            }
        });

        const sub_components = await Promise.all(sub_component_promises);

        this.gl_elems = {
            map: map, components: sub_components
        }
    }

    public render(gl: WebGLAnyRenderingContext, matrix: Float32Array | number[]) {
        if (this.gl_elems === null) return;

        if (matrix instanceof Float32Array)
            matrix = [...matrix];

        const gl_elems = this.gl_elems;

        const map_width = gl_elems.map.getCanvas().width;
        const map_height = gl_elems.map.getCanvas().height;
        const map_zoom = gl_elems.map.getZoom();

        gl_elems.components.forEach(comp => {
            comp.render(gl, matrix, [map_width, map_height], map_zoom);
        })
    }
}

export default StationPlot;
export type {StationPlotOptions};