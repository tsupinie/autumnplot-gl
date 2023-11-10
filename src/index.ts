
import { PlotComponent } from "./PlotComponent";
import Contour, {ContourOptions} from "./Contour";
import {ContourFill, Raster, ContourFillOptions, RasterOptions} from "./Fill";
import Barbs, {BarbsOptions} from "./Barbs";
import Paintball, {PaintballOptions} from "./Paintball";
import Hodographs, {HodographOptions} from './Hodographs';

import { PlotLayer, MultiPlotLayer } from './PlotLayer';
import { WindProfile, WebGLAnyRenderingContext, TypedArray } from "./AutumnTypes";
import { MapType } from "./Map";
import { ColorMap, bluered, redblue, pw_speed500mb, pw_speed850mb, pw_cape, pw_t2m, pw_td2m, Color, nws_storm_clear_refl } from './Colormap';
import { makeColorBar, makePaintballKey, ColorbarOrientation, ColorbarTickDirection, ColorBarOptions, PaintballKeyOptions } from "./ColorBar";
import { RawScalarField, RawVectorField, RawProfileField, Grid, GridType, VectorRelativeTo, RawVectorFieldOptions, PlateCarreeGrid, PlateCarreeRotatedGrid, LambertGrid } from "./RawField";

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

export {PlotComponent,
        Barbs, BarbsOptions,
        Contour, ContourOptions,
        ContourFill, Raster, ContourFillOptions, RasterOptions,
        Paintball, PaintballOptions,
        Hodographs, HodographOptions, WindProfile,
        PlotLayer, MultiPlotLayer, 
        MapType,
        ColorMap, colormaps, makeColorBar, makePaintballKey, Color, ColorbarOrientation, ColorbarTickDirection, ColorBarOptions, PaintballKeyOptions,
        RawScalarField, RawVectorField, RawProfileField, Grid, GridType, VectorRelativeTo, RawVectorFieldOptions, PlateCarreeGrid, PlateCarreeRotatedGrid, LambertGrid,
        WebGLAnyRenderingContext, TypedArray};