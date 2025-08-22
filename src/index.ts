
import { PlotComponent } from "./PlotComponent";
import Contour, {ContourOptions, ContourLabels, ContourLabelOptions} from "./Contour";
import {ContourFill, Raster, ContourFillOptions, RasterOptions} from "./Fill";
import Barbs, {BarbsOptions} from "./Barbs";
import Paintball, {PaintballOptions} from "./Paintball";
import Hodographs, {HodographOptions} from './Hodographs';
import StationPlot, {StationPlotOptions, SPPosition, SPNumberConfig, SPStringConfig, SPBarbConfig, SPSymbolConfig, SPConfig, SPDataConfig, SPSymbol} from "./StationPlot";

import { PlotLayer, MultiPlotLayer } from './PlotLayer';
import { WindProfile, StormRelativeWindProfile, GroundRelativeWindProfile, WebGLAnyRenderingContext, TypedArray, ContourData } from "./AutumnTypes";
import { MapLikeType } from "./Map";
import { ColorMap, ColorMapOptions, bluered, redblue, pw_speed500mb, pw_speed850mb, pw_cape, pw_t2m, pw_td2m, nws_storm_clear_refl } from './Colormap';
import { Color } from "./Color";
import { makeColorBar, makePaintballKey, ColorbarOrientation, ColorbarTickDirection, ColorBarOptions, PaintballKeyOptions } from "./ColorBar";
import { LineStyle } from "./PolylineCollection";
import { RawScalarField, RawVectorField, RawProfileField, VectorRelativeTo, RawVectorFieldOptions, RawObsField, ObsRawData} from "./RawField";
import { Grid, GridType, StructuredGrid, PlateCarreeGrid, PlateCarreeRotatedGrid, LambertGrid, UnstructuredGrid } from './Grid'

import { initMSModule, FieldContourOpts } from './ContourCreator';

/** All built-in colormaps */
const colormaps = {
    bluered: bluered,
    redblue: redblue,
    pw_speed500mb: pw_speed500mb,
    pw_speed850mb: pw_speed850mb,
    pw_cape: pw_cape,
    pw_t2m: pw_t2m,
    pw_td2m: pw_td2m,
    nws_storm_clear_refl: nws_storm_clear_refl,
}

/**
 * Initialize the WebAssembly module in autumnplot-gl. It's not strictly necessary to call it first, but if you call it
 * first, you can prevent races when you contour a bunch of fields at once.
 */
function initAutumnPlot() {
    initMSModule();
}

export {PlotComponent,
        Barbs, BarbsOptions,
        Contour, ContourOptions, ContourLabels, ContourLabelOptions,
        ContourFill, Raster, ContourFillOptions, RasterOptions,
        Paintball, PaintballOptions,
        Hodographs, HodographOptions, WindProfile, StormRelativeWindProfile, GroundRelativeWindProfile,
        StationPlot, StationPlotOptions, SPPosition, SPNumberConfig, SPStringConfig, SPBarbConfig, SPSymbolConfig, SPConfig, SPDataConfig, SPSymbol,
        PlotLayer, MultiPlotLayer, 
        MapLikeType, LineStyle,
        ColorMap, ColorMapOptions, colormaps, makeColorBar, makePaintballKey, Color, ColorbarOrientation, ColorbarTickDirection, ColorBarOptions, PaintballKeyOptions,
        RawScalarField, RawVectorField, RawProfileField, RawObsField, ObsRawData,
        Grid, GridType, StructuredGrid, VectorRelativeTo, RawVectorFieldOptions, PlateCarreeGrid, PlateCarreeRotatedGrid, LambertGrid, UnstructuredGrid,
        WebGLAnyRenderingContext, TypedArray, ContourData,
        initAutumnPlot, FieldContourOpts};
