---
title: API Reference
---

# autumnplot-gl

## Classes

| Class | Description |
| ------ | ------ |
| [Barbs](classes/Barbs.md) | A class representing a field of wind barbs. The barbs are automatically thinned based on the zoom level on the map; the user only has to provide a thinning factor at zoom level 1. |
| [Color](classes/Color.md) | A class for handling colors and translations between different color spaces |
| [ColorMap](classes/ColorMap.md) | A mapping from values to colors |
| [Contour](classes/Contour.md) | A field of contoured data. |
| [ContourFill](classes/ContourFill.md) | A filled contoured field |
| [ContourLabels](classes/ContourLabels.md) | Label the contours on a plot |
| [Grid](classes/Grid.md) | The base class for grid types |
| [Hodographs](classes/Hodographs.md) | A class representing a field of hodograph plots |
| [LambertGrid](classes/LambertGrid.md) | A Lambert conformal conic grid with uniform grid spacing |
| [MultiPlotLayer](classes/MultiPlotLayer.md) | A varying map layer. If the data don't have a varying component, such as over time, it might be easier to use a [PlotLayer](classes/PlotLayer.md) instead. |
| [Paintball](classes/Paintball.md) | A class representing a paintball plot, which is a plot of objects in every member of an ensemble. Objects are usually defined by a single threshold on a field (such as simulated reflectivity greater than 40 dBZ), but could in theory be defined by any arbitrarily complicated method. In autumnplot-gl, the data for the paintball plot is given as a single field with the objects from each member encoded as "bits" in the field. Because the field is made up of single-precision floats, this works for up to 24 members. (Technically speaking, I don't need the quotes around "bits", as they're bits of the significand of an IEEE 754 float.) |
| [PlateCarreeGrid](classes/PlateCarreeGrid.md) | A plate carree (a.k.a. lat/lon) grid with uniform grid spacing |
| [PlateCarreeRotatedGrid](classes/PlateCarreeRotatedGrid.md) | A rotated lat-lon (plate carree) grid with uniform grid spacing |
| [PlotComponent](classes/PlotComponent.md) | Base class for all plot components |
| [PlotLayer](classes/PlotLayer.md) | A static map layer. The data are assumed to be static in time. If the data have a time component (e.g., a model forecast), a [MultiPlotLayer](classes/MultiPlotLayer.md) may be more appropriate. |
| [Raster](classes/Raster.md) | A raster (i.e. pixel) plot |
| [RawObsField](classes/RawObsField.md) | Raw observation data, given as a list of objects |
| [RawProfileField](classes/RawProfileField.md) | A class grid of wind profiles |
| [RawScalarField](classes/RawScalarField.md) | A class representing a raw 2D field of gridded data, such as height or u wind. |
| [RawVectorField](classes/RawVectorField.md) | A class representing a 2D gridded field of vectors |
| [StationPlot](classes/StationPlot.md) | Station model plots for observed data |
| [StructuredGrid](classes/StructuredGrid.md) | A structured grid (in this case meaning a cartesian grid with i and j coordinates) |
| [UnstructuredGrid](classes/UnstructuredGrid.md) | An unstructured grid defined by a list of latitudes and longitudes |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [BarbsOptions](interfaces/BarbsOptions.md) | Options for [Barbs](classes/Barbs.md) components |
| [ColorBarOptions](interfaces/ColorBarOptions.md) | Options for ColorBars |
| [ColorMapOptions](interfaces/ColorMapOptions.md) | Options for [ColorMap](classes/ColorMap.md)s |
| [ContourFillOptions](interfaces/ContourFillOptions.md) | Options for [ContourFill](classes/ContourFill.md) components |
| [ContourLabelOptions](interfaces/ContourLabelOptions.md) | Options for [ContourLabels](classes/ContourLabels.md) |
| [ContourOptions](interfaces/ContourOptions.md) | Options for [Contour](classes/Contour.md) components |
| [FieldContourOpts](interfaces/FieldContourOpts.md) | Options for contouring data via [RawScalarField.getContours()](classes/RawScalarField.md#getcontours) |
| [GroundRelativeWindProfile](interfaces/GroundRelativeWindProfile.md) | A wind profile without a storm motion for plotting ground-relative hodographs |
| [HodographOptions](interfaces/HodographOptions.md) | Options for [Hodographs](classes/Hodographs.md) components |
| [InitAutumnPlotOpts](interfaces/InitAutumnPlotOpts.md) | Options for initializing the autumnplot-gl library |
| [PaintballKeyOptions](interfaces/PaintballKeyOptions.md) | Options for [makePaintballKey()](functions/makePaintballKey.md) |
| [PaintballOptions](interfaces/PaintballOptions.md) | Options for [Paintball](classes/Paintball.md) components |
| [RasterOptions](interfaces/RasterOptions.md) | Options for [Raster](classes/Raster.md) components |
| [RawVectorFieldOptions](interfaces/RawVectorFieldOptions.md) | Options for [RawVectorField](classes/RawVectorField.md)s |
| [SPBarbConfig](interfaces/SPBarbConfig.md) | Configuration for wind barbs on station plots |
| [SPNumberConfig](interfaces/SPNumberConfig.md) | Configuration for numerical values on station plots |
| [SPStringConfig](interfaces/SPStringConfig.md) | Configuration for strings on station plots |
| [SPSymbolConfig](interfaces/SPSymbolConfig.md) | Configuration for symbols on station plots |
| [StationPlotOptions](interfaces/StationPlotOptions.md) | Options for [StationPlot](classes/StationPlot.md) components |
| [StormRelativeWindProfile](interfaces/StormRelativeWindProfile.md) | A wind profile with a storm-motion for plotting storm-relative hodographs |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ColorbarOrientation](type-aliases/ColorbarOrientation.md) | The orientation for color bars (horizontal or vertical) |
| [ColorbarTickDirection](type-aliases/ColorbarTickDirection.md) | Which side of a color bar the ticks are on |
| [ContourData](type-aliases/ContourData.md) | The result of contouring a field |
| [GridType](type-aliases/GridType.md) | - |
| [LineStyle](type-aliases/LineStyle.md) | A style to use to draw lines. The possible options are '-' for a solid line, '--' for a dashed line, ':' for a dotted line, '-.' for a dash-dot line, or you could pass a list of numbers (e.g., [1, 1, 1, 0, 1, 0]) to specify a custom dash scheme. |
| [MapLikeType](type-aliases/MapLikeType.md) | Type with the required methods for mapping libraries |
| [ObsRawData](type-aliases/ObsRawData.md) | Type for an observation data point |
| [SPConfig](type-aliases/SPConfig.md) | Configuration for station plot sub-elements |
| [SPDataConfig](type-aliases/SPDataConfig.md) | Configuration for station data plots |
| [SPPosition](type-aliases/SPPosition.md) | Positions around the station plot at which to draw the various elements |
| [SPSymbol](type-aliases/SPSymbol.md) | Accepted symbol codes for sky cover and present weather symbols |
| [TypedArray](type-aliases/TypedArray.md) | Javascript typed arrays for use in raw fields |
| [VectorRelativeTo](type-aliases/VectorRelativeTo.md) | The basis vectors for vector fields (i.e, whether vectors a relative to Earth or the grid) |
| [WebGLAnyRenderingContext](type-aliases/WebGLAnyRenderingContext.md) | WebGL rendering contexts (either WebGL1 or WebGL2) |
| [WindProfile](type-aliases/WindProfile.md) | Different types of wind profiles for [Hodographs](classes/Hodographs.md) components |

## Variables

| Variable | Description |
| ------ | ------ |
| [colormaps](variables/colormaps.md) | All built-in colormaps |

## Functions

| Function | Description |
| ------ | ------ |
| [initAutumnPlot](functions/initAutumnPlot.md) | Initialize the WebAssembly module in autumnplot-gl. It's not strictly necessary to call it first, but if you call it first, you can prevent races when you contour a bunch of fields at once. |
| [makeColorBar](functions/makeColorBar.md) | Make an SVG containing a color bar. The color bar can either be oriented horizontal or vertical, and a label can be provided. |
| [makePaintballKey](functions/makePaintballKey.md) | Make an SVG containing a color key for a paintball plot. The key can be split over any number of columns. |
