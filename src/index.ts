
import { PlotComponent } from "./PlotComponent";
import Contour, {ContourOptions} from "./Contour";
import ContourFill, {ContourFillOptions} from "./ContourFill";
import Barbs, {BarbsOptions} from "./Barbs";
import Paintball, {PaintballOptions} from "./Paintball";
import Hodographs from './Hodographs';

import { PlotLayer, MultiPlotLayer } from './PlotLayer';
import { WindProfile } from "./AutumnTypes";
import { MapType } from "./Map";
import { ColorMap, bluered, redblue, pw_speed500mb, pw_speed850mb, pw_cape, pw_t2m, pw_td2m, 
         makeColorBar, Color, ColorbarOrientation, ColorbarTickDirection, ColorBarOptions } from './Colormap';
import { RawScalarField, RawVectorField, Grid, PlateCarreeGrid, LambertGrid } from "./RawField";

const colormaps = {
    bluered: bluered,
    redblue: redblue,
    pw_speed500mb: pw_speed500mb,
    pw_speed850mb: pw_speed850mb,
    pw_cape: pw_cape,
    pw_t2m: pw_t2m,
    pw_td2m: pw_td2m
}

export {PlotComponent,
        Barbs, BarbsOptions,
        Contour, ContourOptions,
        ContourFill, ContourFillOptions,
        Paintball, PaintballOptions,
        Hodographs, WindProfile,
        PlotLayer, MultiPlotLayer, 
        MapType,
        ColorMap, colormaps, makeColorBar, Color, ColorbarOrientation, ColorbarTickDirection, ColorBarOptions,
        RawScalarField, RawVectorField, Grid, PlateCarreeGrid, LambertGrid};