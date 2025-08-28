---
sidebar_position: 2
---
import {DemoMap, DemoContourLayer, DemoBarbLayer, DemoContourFillLayer} from '@site/src/components/DemoMap';

# Basic Data Plotting
The first step in plotting data is to create a grid. Currently, these are the only supported grids:
- `PlateCarreeGrid` (a.k.a. Lat/Lon)
- `RotatedPlateCarreeGrid`
- `LambertGrid` (a.k.a. Lambert Conformal Conic)

```javascript
// Create a grid object that covers the continental United States
const nx = 121, ny = 61;
const grid = new PlateCarreeGrid(nx, ny, -130, 20, -65, 55);
```

Next, create a RawScalarField with the data. autumnplot-gl doesn't care about how data get to the browser, but it should end up in a `Float32Array` or `Float16Array` in row-major order with the first element being at the southwest corner of the grid. 

:::tip
If you're using [zarr.js](https://github.com/gzuidhof/zarr.js/), you can use the `getRaw()` function on a `ZarrArray` to get data in the correct format.
:::

:::note
As of July 2025, `Float16Array`s are supported natively by the latest versions of all major desktop browsers and most major mobile browsers. If you need to support `Float16Array`s in older versions of these browsers, you can use [this library](https://github.com/petamoriken/float16). The nice part about using a `Float16Array` is that your data will be stored as float16s in VRAM, so they'll take up half the space as the same data as float32s. 
:::

Once you have your data in that format, to create the raw data field:

```javascript
// Create the raw data field
const height_field = new RawScalarField(grid, height_data);
```

## Contouring data
Next, to contour the field, create a Contour object and pass it some options. See [here](./api/classes/Contour) for a full list of options.

```javascript
// Contour the data
const height_contour = new Contour(height_field,
    {color: '#000000', interval: 3});
```

Next, create the actual layer that gets added to the map. The first argument (`'height-contour'` here) is an id. It doesn't mean much, but it does need to be unique between the different `PlotLayer`s you add to the map.

```javascript
// Create the map layer
const height_layer = new PlotLayer('height-contour', height_contour);
```

Finally, add it to the map. The interface for Mapbox and MapLibre are the same, at least currently, though there's nothing that says they'll stay that way in the future. Assuming you're using MapLibre:

```javascript
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=' + maptiler_api_key,
    center: [-97.5, 38.5],
    zoom: 4
});

map.on('load', () => {
    map.addLayer(height_layer, 'countries-boundary');
});
```

<DemoMap>
    <DemoContourLayer/>
</DemoMap>

The `'countries-boundary'` argument is a layer in the map style, and this means to add your layer just below that layer on the map. This usually produces better results than just blindly slapping all your layers on top of all the map (though the map style itself may require some tweaking to produce the best results).

## Labeling contours

Typically, when plotting meteorological data, contours are labeled with their values, which you can do with `ContourLabels`:

```javascript
const labels = new ContourLabels(height_contour,
    {text_color: '#000000', halo: true, halo_color: '#f0f0f0'});
    
const label_layer = new PlotLayer('label', labels);

map.on('load', () => {
    map.addLayer(label_layer, 'countries-boundary');
});
```

<!--DemoMap>
    <DemoContourLayer label_contours={true}/>
</DemoMap-->

## Creating wind barbs

Wind barb plotting is similar to the contours, but it requires using a `RawVectorField` with u and v data.

```javascript
const vector_field = new RawVectorField(grid, u_data, v_data);
const barbs = new Barbs(vector_field, {color: '#f0f0f0', thin_fac: 16});
const barb_layer = new PlotLayer('barbs', barbs);

map.on('load', () => {
    map.addLayer(barb_layer, 'countries-boundary');
});
```

<DemoMap>
    <DemoBarbLayer/>
</DemoMap>

The wind barbs are automatically rotated based on the grid projection. Also, the density of the wind barbs is automatically varied based on the map zoom level. The `'thin_fac': 16` option means to plot every 16th wind barb in the i and j directions, and this is defined at zoom level 1. So at zoom level 2, it will plot every 8th wind barb, and at zoom level 3 every 4th wind barb, and so on. Because it divides in 2 for every deeper zoom level, `'thin_fac'` should be a power of 2.

## Creating filled contours or raster plots

Plotting filled contours is also similar to plotting regular contours, but there's some additional steps for the color map. A couple color maps are available by default (see [here](/docs/colormaps) for more details), but if you have the colors you want, creating your own is (relatively) painless (hopefully). First, set up the colormap. Here, we'll just use the bluered colormap included by default.

```javascript
// colormaps is imported via `import {colormaps} from 'autumnplot-gl'`
const colormap = colormaps.pw_speed500mb;
const fills = new ContourFilled(height, {cmap: colormap, opacity: 0.6});
const height_fill_layer = new PlotLayer('height-fill', fills);

map.on('load', () => {
    map.addLayer(height_fill_layer, 'countries-boundary');
});
```

<DemoMap>
    <DemoContourFillLayer/>
</DemoMap>

Making a raster plot is very similar (the two classes support the same options):

```javascript
const raster = new Raster(height, {cmap: colormap, opacity: 0.6});
```

Normally, when you have a color fill, you have a color bar on the plot. To create an SVG color bar:

```javascript
const colorbar_svg = makeColorBar(colormap, {label: "Height Perturbation (m)", 
                                             ticks: [-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10],
                                             orientation: 'horizontal', 
                                             tick_direction: 'bottom'});

document.getElementById('colorbar-container').appendChild(colorbar_svg);
```