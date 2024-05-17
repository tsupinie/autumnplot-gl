# autumnplot-gl
Hardware-accelerated geospatial data plotting in the browser

## Links
[Github](https://github.com/tsupinie/autumnplot-gl) | [API docs](https://tsupinie.github.io/autumnplot-gl/) | [NPM](https://www.npmjs.com/package/autumnplot-gl)

## What is this?
Lots of meteorological data web sites have a model where the data live on a central server, get plotted on the server, and then the server serves static images to the client. This creates a bottleneck where adding fields and view sectors takes exponentially more processing power for the server. One way around this is to offload the plotting to the client and to have the browser plot the data on a pan-and-zoomable map. Unfortunately, in the past, this has required developing low-level plotting code, and depending on the mapping library, the performance may be poor.

autumnplot-gl provides a solution to this problem by making hardware-accelerated data plotting in the browser easy. This was designed with meteorological data in mind, but anyone wanting to contour geospatial data on a map can use autumnplot-gl.

## Usage
autumnplot-gl is designed to be used with either [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/) or [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/) mapping libraries. If you're using webpack or another node-based build tool, you can install by running

```bash
npm i autumnplot-gl
```

Unfortunately, you may have to modify your build tool configuration to include the WebAssembly binary. For webpack, I've found adding this to webpack.config.js works:

```javascript
{
    "module": {
        "rules": [
            {
                test: /\.wasm$/,
                type: "asset/resource",
                generator: {
                    filename: "static/js/[name].wasm"
                }
            }
        ]
    }
}
```

In addition to the Typescript library, pre-built autumnplot-gl javascript files area available [here](https://tsupinie.github.io/autumnplot-gl/dist/). Adding them to your page exposes the API via the `apgl` global variable (e.g., instead of `new PlateCarreeGrid(...)` in the examples, you'd call `new apgl.PlateCarreeGrid(...)`). 

### A basic contour plot
The first step in plotting data is to create a grid. Currently, the only supported grids are PlateCarreeGrid (a.k.a. Lat/Lon), RotatedPlateCarreeGrid, and LambertGrid (a.k.a. Lambert Conformal Conic).

```javascript
// Create a grid object that covers the continental United States
const nx = 121, ny = 61;
const grid = new PlateCarreeGrid(nx, ny, -130, 20, -65, 55);
```

Next, create a RawScalarField with the data. autumnplot-gl doesn't care about how data get to the browser, but it should end up in a `Float32Array` or `Float16Array` in row-major order with the first element being at the southwest corner of the grid. If you're using [zarr.js](https://github.com/gzuidhof/zarr.js/), you can use the `getRaw()` function on a `ZarrArray` to get data in the correct format. Also, `Float16Array`s are not in the Javascript standard library (for now), so for the time being, you'll need to use [this library](https://github.com/petamoriken/float16). However, the nice part about using a `Float16Array` is that your data will be stored as float16s in VRAM, so they'll take up half the space as the same data as float32s. Once you have your data in that format, to create the raw data field:

```javascript
// Create the raw data field
const height_field = new RawScalarField(grid, height_data);
```

Next, to contour the field, create a Contour object and pass it some options. At this time, a somewhat limited set of options is supported, but I do plan to expand this.

```javascript
// Contour the data
const height_contour = new Contour(height_field, {color: '#000000', interval: 30});
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
    map.addLayer(height_layer, 'railway_transit_tunnel');
});
```

The `'railway_transit_tunnel'` argument is a layer in the map style, and this means to add your layer just below that layer on the map. This usually produces better results than just blindly slapping all your layers on top of all the map (though the map style itself may require some tweaking to produce the best results).

### Contour Labeling

Typically, when plotting meteorological data, contours are labeled with their values, which you can do with `ContourLabels`:

```javascript
const labels = new ContourLabels(height_contour, {text_color: '#ffffff', halo: true});
const label_layer = new PlotLayer('label', labels);

map.on('load', () => {
    map.addLayer(label_layer, 'railway_transit_tunnel');
});
```

### Barbs

Wind barb plotting is similar to the contours, but it requires using a `RawVectorField` with u and v data.

```javascript
const vector_field = new RawVectorField(grid, u_data, v_data);
const barbs = new Barbs(vector_field, {color: '#000000', thin_fac: 16});
const barb_layer = new PlotLayer('barbs', barbs);

map.on('load', () => {
    map.addLayer(barb_layer, 'railway_transit_tunnel');
});
```

The wind barbs are automatically rotated based on the grid projection. Also, the density of the wind barbs is automatically varied based on the map zoom level. The `'thin_fac': 16` option means to plot every 16th wind barb in the i and j directions, and this is defined at zoom level 1. So at zoom level 2, it will plot every 8th wind barb, and at zoom level 3 every 4th wind barb, and so on. Because it divides in 2 for every deeper zoom level, `'thin_fac'` should be a power of 2.

### Filled contours or raster plots

Plotting filled contours is also similar to plotting regular contours, but there's some additional steps for the color map. A couple color maps are available by default (see [here](#built-in-color-maps) for more details), but if you have the colors you want, creating your own is (relatively) painless (hopefully). First, set up the colormap. Here, we'll just use the bluered colormap included by default.

```javascript
// colormaps is imported via `import {colormaps} from 'autumnplot-gl'`
const colormap = colormaps.bluered(-10, 10, 20);
const fills = new ContourFilled(height, {cmap: colormap});
const height_fill_layer = new PlotLayer('height-fill', fills);

map.on('load', () => {
    map.addLayer(height_fill_layer, 'railway_transit_tunnel');
});
```

Making a raster plot is very similar (the two classes support the same options):

```javascript
const raster = new Raster(height, {cmap: colormap});
```

Normally, when you have a color fill, you have a color bar on the plot. To create an SVG color bar:

```javascript
const colorbar_svg = makeColorBar(colormap, {label: "Height Perturbation (m)", 
                                             ticks: [-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10],
                                             orientation: 'horizontal', 
                                             tick_direction: 'bottom'});

document.getElementById('colorbar-container').appendChild(colorbar_svg);
```

### Varying the data plots
The previous steps have gone through plotting a static dataset on a map, but in many instances, you want to view a dataset that changes, say over time. In order to switch the data currently plotted, you can call `updateField()` on the plot component (e.g, `ContourFilled`, `Barbs`, etc.) to switch what field is plotted. 

```javascript
// Create the initial field
const height_field_f00 = new RawScalarField(grid, height_data_f00);
const fills = new Contour(height_data_f00, {interval: 30});

// Update the field plotted
const height_field_f01 = new RawScalarField(grid, height_data_f01);
fills.updateField(height_field_f01);
```

Another way to vary the data is to use `MultiPlotLayer`. The main difference between this and using `updateField()` is that `MultiPlotLayer` will put all data for all times onto VRAM at once. In contrast, with `PlotLayer` and `updateField()`, only the data currently plotted are stored on VRAM. For large grids, this may take up a large amount of VRAM, so you may not want to use this, and it may be removed in later versions.

```javascript
// Contour some data
const height_contour_f00 = new Contour(height_f00);
const height_contour_f01 = new Contour(height_f01);
const height_contour_f02 = new Contour(height_f02);

// Create a varying map layer
const height_layer_time = new MultiPlotLayer('height-contour-time');

// Add the contoured data to it
height_layer_time.addField(height_contour_f00, '20230112_1200');
height_layer_time.addField(height_contour_f01, '20230112_1300');
height_layer_time.addField(height_contour_f02, '20230112_1400');

// Add to the map like normal
map.on('load', () => {
    map.addLayer(height_layer_time, 'railway_transit_tunnel');
});
```

The second argument to `addField()` is the key to associate with this field. This example uses the absolute time, but you could just as easily use `'f00'`, `'f01'`, ... or anything else that's relevant as long as it's unique. Now to set the active time (i.e., the time that gets plotted):

```javascript
// Set the active field in the map layer (the map updates automatically)
height_layer.setActiveKey('20230112_1200');
```

### Typescript Considerations

autumnplot-gl is written in Tyescript to facilitate type info in large projects. Typescript isn't necessary to use autumnplot-gl, but if you want to use it, there are some considerations. 

Many of the plot component classes have generic types. The typescript compiler can generally figure out the generic type parameters, but if you're declaring a variable to be a plot component, you'll probably need to specify those ahead of time. The first type parameter is the array type (either Float32Array or Float16Array), and the second is the type of the Map you're using.

```typescript
// Import the map from maplibre-gl, if that's what you're using. Mapbox should be similar.
import { Map } from 'maplibre-gl';

// Declare a contour field which contours an array of float float32s with the MapLibre map.
const cntr: Contour<Float32Array, Map>;
```

## Built-in color maps
autumnplot-gl comes with several built-in color maps, accessible via `import {colormaps} from 'autumnplot-gl'`. These are basic blue/red and red/blue diverging color maps plus a selection from [PivotalWeather](https://www.pivotalweather.com). The blue/red and red/blue are functions that take a minimum contour level, a maximum contour level, and a number of colors. For example, this creates a blue/red colormap starting at -10, ending at 10, and with 20 colors:

```javascript
const colormap = colormaps.bluered(-10, 10, 20);
```

Here are all the colormaps available:

![colormaps](https://github.com/tsupinie/autumnplot-gl/assets/885575/348eb23a-67ed-48b3-9c69-b7d834ba1b03)


## Map tiles
The above exmple uses map tiles from [Maptiler](https://www.maptiler.com/). Map tiles from Maptiler or Mapbox or others are free up to a (reasonably generous) limit, but the pricing can be a tad steep after reaching the limit. The tiles from these services are extremely detailed, and really what you're paying for there is the hardware to store, process, and serve that data. While these tiles are very nice, the detail is way overkill for a lot of uses in meteorology. 

So, I've created some [less-detailed map tiles](https://tsupinie.github.io/autumnplot-gl/tiles/) that are small enough that they can be hosted without dedicated hardware. However the tradeoff is that they're only useful down to zoom level 8 or 9 on the map, such that the viewport is somewhere between half a US state and a few counties in size. If that's good enough for you, then these tiles could be useful.

## Conspicuous absences
A few capabilities are missing from this library as of v3.0.
* Helper functions for reading from specific data formats. For instance, I'd like to add support for reading from a zarr file.
* A whole bunch of little things that ought to be fairly straightforward like tweaking the size of the wind barbs and contour thicknesses.

## Closing thoughts
Even though autumnplot-gl is currently an extremely new package with relatively limited capability, I hope folks see potential and find it useful. Any contributions to fill out some missing features are welcome.
