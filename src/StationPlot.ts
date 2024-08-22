
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

/**
 * Positions around the station plot at which to draw the various elements
 *  'cl' -> center-left
 *  'll' -> lower-left
 *  'lc' -> lower-center
 *  'lr' -> lower-right
 *  'cr' -> center-right
 *  'ur' -> upper-right
 *  'uc' -> upper-center
 *  'ul' -> upper-left
 *  'c' -> center
 */
type SPPosition = 'cl' | 'll' | 'lc' | 'lr' | 'cr' | 'ur' | 'uc' | 'ul' | 'c';

interface SPNumberConfig {
    type: 'number';

    /**
     * The position on the station plot at which to place the number
     */
    pos: SPPosition;

    /**
     * The color to use to draw the number
     * @default #000000
     */
    color?: string;

    /**
     * A function that properly formats the number for display
     * @example (val) => val === null ? '' : val.toFixed(0)
     * @param val - The number to format
     * @returns A string containing the formatted nubmer
     */
    formatter?: (val: number | null) => string;
}

interface SPStringConfig {
    type: 'string';

    /**
     * The position on the station plot at which to place the number
     */
    pos: SPPosition;

    /**
     * The color to use to draw the number
     * @default #000000
     */
    color?: string;
}

interface SPBarbConfig {
    type: 'barb';

    /**
     * The color to use to draw the number
     * @default #000000
     */
    color?: string;

    /**
     * A multiplier for the barb size
     * @default 1
     */
    barb_size_multipler?: number;
}

type Symbol = ('0/8' | '1/8' | '2/8' | '3/8' | '4/8' | '5/8' | '6/8' | '7/8' | '8/8' | 
               'clr' | 'few' | 'sct' | 'bkn' | 'ovc' | 'obsc' |
               'va' | 'fu' | 'hz' | 'du' | 'bldu' | 'sa' | 'blsa' | 'vcblsa' | 'vcbldu' | 'blpy' | 'po' | 'vcpo' | 'vcds' | 'vcss' | 
               'br' | 'bcbr' | 'bc' | 'mifg' | 'vcts' | 'virga' | 'vcsh' | 'ts' | 'thdr' | 'vctshz' | 'tsfzfg' | 'tsbr' | 'tsdz' | 'vctsup' | '-tsup' | 'tsup' | '+tsup' | 
               'sq' | 'fc' | '+fc' | 'ds' | 'ss' | 'drsa' | 'drdu' | '+ds' | '+ss' | 'drsn' | '+drsn' | '-blsn' | 'blsn' | '+blsn' | 'vcblsn' | 
               'vcfg' | 'bcfg' | 'prfg' | 'fg' | 'fzfg' | 
               '-vctsdz' | '-dz' | '-dzbr' | 'vctsdz' | 'dz' | '+vctsdz' | '+dz' | '-fzdz' | '-fzdzsn' | 'fzdz' | '+fzdz' | 'fzdzsn' | '-dzra' | 'dzra' | '+dzra' | 
               '-ra' | '-rabr' | 'ra' | 'rabr' | 'rafg' | 'vcra' | '+ra' | 
               '-fzra' | '-fzrasn' | '-fzrabr' | '-fzrapl' | '-fzrasnpl' | 'tsfzrapl' | '-tsfzra' | 'fzra' | '+fzra' | 'fzrasn' | 'tsfzra' | 
               '-dzsn' | '-rasn' | '-snra' | '-sndz' | 'rasn' | '+rasn' | 'snra' | 'dzsn' | 'sndz' | '+dzsn' | '+sndz' | '-sn' | '-snbr' | 'sn' | '+sn' |  '-snsg' | 'sg' | '-sg' | 'ic' | 
               '-fzdzpl' | '-fzdzplsn' | 'fzdzpl' | '-fzraplsn' | 'fzrapl' | '+fzrapl' | '-rapl' | '-rasnpl' | '-raplsn' | '+rapl' | 'rapl' | '-snpl' | 'snpl' | 
               '-pl' | 'pl' | '-plsn' | '-plra' | 'plra' | '-pldz' | '+pl' | 'plsn' | 'plup' | '+plsn' | 
               '-sh' | '-shra' | 'sh' | 'shra' | '+sh' | '+shra' | '-shrasn' | '-shsnra' | '+shrabr' | 'shrasn' | '+shrasn' | 'shsnra' | '+shsnra' | '-shsn' | 'shsn' | '+shsn' | 
               '-gs' | '-shgs' | 'fzraplgs' | '-sngs' | 'gsplsn' | 'gspl' | 'plgssn' | 'gs' | 'shgs' | '+gs' | '+shgs' | '-gr' | '-shgr' | '-sngr' | 'gr' | 'shgr' | '+gr' | '+shgr' | 
               '-tsrasn' | 'tsrasn' | '-tssnra' | 'tssnra' | '-vctsra' | '-tsra' | 'tsra' | 
               '-tsdz' | 'vctsra' | 'tspl' | '-tssn' | '-tspl' | 'tssn' | '-vctssn' | 'vctssn' | 'tsplsn' | 'tssnpl' | 
               '-tssnpl' | '-tsragr' | 'tsrags' | 'tsragr' | 'tsgs' | 'tsgr' | 
               '+tsfzrapl' | '+vctsra' | '+tsra' | '+tsfzra' | '+tssn' | '+tspl' | '+tsplsn' | '+vctssn' | 'tssa' | 'tsds' | 'tsdu' | '+tsgs' | '+tsgr' | '+tsrags' | '+tsragr' | 
               'in' | '-up' | 'up' | '+up' | '-fzup' | 'fzup' | '+fzup');

const SYMBOLS: Record<Symbol, number> = {
    // Sky cover symbols
    '0/8': 59658, '1/8': 59659, '2/8': 59660, '3/8': 59661, '4/8': 59662, '5/8': 59663, '6/8': 59664, '7/8': 59665, '8/8': 59666,
    'clr': 59658, 'few': 59660, 'sct': 59662, 'bkn': 59664, 'ovc': 59666, 'obsc': 59667,

    // Present weather symbols
    'va': 59810, 'fu': 59810, 'hz': 59811, 'du': 59812, 'bldu': 59814, 'sa': 59814, 'blsa': 59814, 'vcblsa': 59814, 'vcbldu': 59814, 'blpy': 59814,
    'po': 59816, 'vcpo': 59816, 'vcds': 59817, 'vcss': 59817,
    'br': 59818, 'bcbr': 59818, 'bc': 59819, 'mifg': 59820,
    'vcts': 59821, 'virga': 59822, 'vcsh': 59824, 'ts': 59825, 'thdr': 59825, 'vctshz': 59825,
    'tsfzfg': 59825, 'tsbr': 59825, 'tsdz': 59825, 'vctsup': 59825,
    '-tsup': 59825, 'tsup': 59825, '+tsup': 59825,
    'sq': 59826, 'fc': 59827, '+fc': 59827,
    'ds': 59839,'ss': 59839, 'drsa': 59839, 'drdu': 59839, '+ds': 59842, '+ss': 59842,
    'drsn': 59844, '+drsn': 59845, '-blsn': 59846, 'blsn': 59846, '+blsn': 59847, 'vcblsn': 59846,
    'vcfg': 59848, 'bcfg': 59849, 'prfg': 59852, 'fg': 59853, 'fzfg': 59857,
    '-vctsdz': 59859, '-dz': 59859, '-dzbr': 59859, 'vctsdz': 59861, 'dz': 59861, '+vctsdz': 59863, '+dz': 59863,
    '-fzdz': 59864, '-fzdzsn': 59864, 'fzdz': 59865, '+fzdz': 59865, 'fzdzsn': 59865,
    '-dzra': 59866, 'dzra': 59867, '+dzra': 59867, '-ra': 59869, '-rabr': 59869, 'ra': 59871, 'rabr': 59871, 'rafg': 59871, 'vcra': 59871, '+ra': 59873,
    '-fzra': 59874, '-fzrasn': 59874, '-fzrabr': 59874, '-fzrapl': 59874, '-fzrasnpl': 59874, 'tsfzrapl': 59875, '-tsfzra': 59875,
    'fzra': 59875, '+fzra': 59875, 'fzrasn': 59875, 'tsfzra': 59875,
    '-dzsn': 59876, '-rasn': 59876, '-snra': 59876, '-sndz': 59876, 'rasn': 59877, '+rasn': 59877, 'snra': 59877, 'dzsn': 59877, 'sndz': 59877, '+dzsn': 59877, '+sndz': 59877,
    '-sn': 59879, '-snbr': 59879, 'sn': 59881, '+sn': 59883, '-snsg': 59885, 'sg': 59885, '-sg': 59885, 'ic': 59886,
    '-fzdzpl': 59887, '-fzdzplsn': 59887, 'fzdzpl': 59887, '-fzraplsn': 59887, 'fzrapl': 59887, '+fzrapl': 59887,
    '-rapl': 59887, '-rasnpl': 59887, '-raplsn': 59887, '+rapl': 59887, 'rapl': 59887, '-snpl': 59887, 'snpl': 59887,
    '-pl': 59887, 'pl': 59887, '-plsn': 59887, '-plra': 59887, 'plra': 59887, '-pldz': 59887, '+pl': 59887, 'plsn': 59887, 'plup': 59887, '+plsn': 59887,
    '-sh': 59888, '-shra': 59888, 'sh': 59889, 'shra': 59889, '+sh': 59889, '+shra': 59889, '-shrasn': 59891, '-shsnra': 59891, '+shrabr': 59892,
    'shrasn': 59892, '+shrasn': 59892, 'shsnra': 59892, '+shsnra': 59892, '-shsn': 59893, 'shsn': 59894, '+shsn': 59894,
    '-gs': 59895, '-shgs': 59895, 'fzraplgs': 59896, '-sngs': 59896, 'gsplsn': 59896, 'gspl': 59896, 'plgssn': 59896, 'gs': 59896, 'shgs': 59896, '+gs': 59896, '+shgs': 59896,
    '-gr': 59897, '-shgr': 59897, '-sngr': 59898, 'gr': 59898, 'shgr': 59898, '+gr': 59898, '+shgr': 59898,
    '-tsrasn': 59907, 'tsrasn': 59907, '-tssnra': 59907, 'tssnra': 59907, '-vctsra': 59908, '-tsra': 59908, 'tsra': 59908, '-tsdz': 59908, 'vctsra': 59908,
    'tspl': 59909, '-tssn': 59909, '-tspl': 59909, 'tssn': 59909, '-vctssn': 59909, 'vctssn': 59909, 'tsplsn': 59909, 'tssnpl': 59909, '-tssnpl': 59909, '-tsragr': 59910,
    'tsrags': 59910, 'tsragr': 59910, 'tsgs': 59910, 'tsgr': 59910,
    '+tsfzrapl': 59911, '+vctsra': 59912, '+tsra': 59912, '+tsfzra': 59912, '+tssn': 59913, '+tspl': 59913, '+tsplsn': 59913, '+vctssn': 59913,
    'tssa': 59914, 'tsds': 59914, 'tsdu': 59914, '+tsgs': 59915, '+tsgr': 59915, '+tsrags': 59915, '+tsragr': 59915, 'in': 59750,
    '-up': 59750, 'up': 59750, '+up': 59751, '-fzup': 59756, 'fzup': 59756, '+fzup': 59757,
}

interface SPSymbolConfig {
    type: 'symbol';

    /**
     * The position on the station plot at which to place the number
     */
    pos: SPPosition;

    /**
     * The color to use to draw the number
     * @default #000000
     */
    color?: string;
}

type SPConfig = SPNumberConfig | SPStringConfig | SPBarbConfig | SPSymbolConfig;
type SPDataConfig<ObsFieldName extends string> = Record<ObsFieldName, SPConfig>;

interface StationPlotOptions {
    /**
     * Thin factor at zoom level 1 for the station plots. Should be a power of 2.
     * @default 1
     */
    thin_fac?: number;

    /**
     * Font face to use for plotting text
     * @default 'Trebuchet MS'
     */
    font_face?: string;
    
    /**
     * Size of the font to use for the text
     * @default 12
     */
    font_size?: number;

    /**
     * URL template to use in retrieving the font data for the text. The default is to use the template from the map style.
     */
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

function positionToAlignmentAndOffset(pos: SPPosition, off_size?: number) {
    off_size = off_size === undefined ? 10 : off_size;

    let ha: HorizontalAlign, va: VerticalAlign;
    let xoff: number, yoff: number;

    if(pos == 'll' || pos == 'cl' || pos == 'ul')      { ha = 'right'; xoff = -off_size; }
    else if (pos == 'lc' || pos == 'c' || pos == 'uc') { ha = 'center'; xoff = 0; }
    else                                               { ha = 'left'; xoff = off_size;}

    if (pos == 'll' || pos == 'lc' || pos == 'lr')     { va = 'top'; yoff = -off_size; }
    else if (pos == 'cl' || pos == 'c' || pos == 'cr') { va = 'middle'; yoff = 0; }
    else                                               { va = 'baseline'; yoff = off_size; }

    return {horizontal_align: ha, vertical_align: va, offset_x: xoff, offset_y: yoff};
}

class StationPlot<GridType extends Grid, MapType extends MapLikeType, ObsFieldName extends string> extends PlotComponent<MapType> {
    public readonly field: RawObsField<GridType, ObsFieldName>;
    public readonly config: SPDataConfig<ObsFieldName>;
    public readonly opts: Required<StationPlotOptions>;
    private gl_elems: StationPlotGLElems<GridType, MapType> | null;

    constructor(field: RawObsField<GridType, ObsFieldName>, config: SPDataConfig<ObsFieldName>, opts: StationPlotOptions) {
        super();

        this.field = field;
        this.config = config;
        this.opts = normalizeOptions(opts, station_plot_opts_defaults);
        this.gl_elems = null;
    }

    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        const map_style = map.getStyle();

        const font_url_template = this.opts.font_url_template == '' ? map_style.glyphs : this.opts.font_url_template;
        if (font_url_template === undefined)
            throw "The map style doesn't have any glyph information. Please pass the font_url_template option to StationPlot";

        const font_url = font_url_template.replace('{fontstack}', this.opts.font_face);

        const sub_component_promises = Object.entries<SPConfig>(this.config).map(async ([k_, config]) => {
            const k = k_ as ObsFieldName;

            if (config.type == 'number' || config.type == 'string') {
                const pos = config.pos;
                const color_opt = config.color;
                const color = color_opt === undefined ? Color.fromHex('#000000') : Color.normalizeColor(color_opt);

                const coords = this.field.grid.getEarthCoords();
                const zoom = this.field.grid.getMinVisibleZoom(this.opts.thin_fac);

                let text_specs: TextSpec[];
                if (config.type == 'number') {
                    const comp = this.field.getScalar(k);
                    const formatter = config.formatter === undefined ? (val: number | null) => val === null ? 'null' : val.toString() : config.formatter;
    
                    text_specs = comp.map((v, i) => ({text: formatter(v), lat: coords.lats[i], lon: coords.lons[i], min_zoom: zoom[i]}));
                }
                else {
                    const comp = this.field.getStrings(k);
                    text_specs = comp.map((v, i) => ({text: v === null ? '' : v, lat: coords.lats[i], lon: coords.lons[i], min_zoom: zoom[i]}));
                }

                const tc_opts: TextCollectionOptions = {
                    ...positionToAlignmentAndOffset(pos),
                    font_size: this.opts.font_size, halo: true, 
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
            else if (config.type == 'symbol') {
                const pos = config.pos;
                const color_opt = config.color;
                const color = color_opt === undefined ? Color.fromHex('#000000') : Color.normalizeColor(color_opt);

                const comp = this.field.getStrings(k) as (Symbol | null)[];
                const coords = this.field.grid.getEarthCoords();
                const zoom = this.field.grid.getMinVisibleZoom(this.opts.thin_fac);

                const wxsym_font_url = font_url_template.replace('{fontstack}', 'wx_symbols');
                const text_specs: TextSpec[] = comp.map((v, i) => ({text: v === null ? '' : String.fromCharCode(SYMBOLS[v]), 
                                                                    lat: coords.lats[i], lon: coords.lons[i], min_zoom: zoom[i]}));
                
                const tc_opts: TextCollectionOptions = {
                    ...positionToAlignmentAndOffset(pos),
                    font_size: this.opts.font_size, halo: true, 
                    text_color: color, halo_color: Color.fromHex('#ffffff'),
                };

                if (tc_opts.offset_x !== undefined) tc_opts.offset_x -= 3;

                return await TextCollection.make(gl, text_specs, wxsym_font_url, tc_opts);
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
export type {StationPlotOptions, SPPosition, SPNumberConfig, SPStringConfig, SPBarbConfig, SPSymbolConfig, SPConfig, SPDataConfig};