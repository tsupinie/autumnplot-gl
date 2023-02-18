autumnplot-gl / [Exports](modules.md)

# autumnplot-gl
Hardware-accelerated geospatial data plotting in the browser

## What is this?
Lots of meteorological data web sites have a model where the data live on a central server, get plotted on the server, and then the server serves static images to the client. This creates a bottleneck where adding fields and view sectors takes exponentially more processing power for the server. One way around this is to offload the plotting to the client and to have the browser plot the data on a pan-and-zoomable map. Unfortunately, in the past, this has required developing low-level plotting code, and depending on the mapping library, the performance may be poor.

autumnplot-gl provides a solution to this problem by making hardware-accelerated data plotting in the browser easy. This was designed with meteorological data in mind, but anyone wanting to contour geospatial data on a map can use autumnplot-gl.

## Usage
autumnplot-gl is designed to be used with either [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/) or [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/) mapping libraries.

To use autumnplot-gl, grab both the files from [dist/](https://github.com/tsupinie/autumnplot-gl/tree/main/dist) and put them in the same directory in your project. Then add this to your web page:

```html
<script src="path/to/autumnplot-gl.js"></script>
```

This exposes the API via the `apgl` global variable. (Side note: if anyone knows how to make webpack 5 output a different name for the web worker file, I'm all ears.)

### A basic contour plot
The first step in plotting data is to create a grid. Currently, the only supported grid is PlateCarree (a.k.a. Lat/Lon), but support for a Lambert Conformal conic grid is planned.

```javascript
// Create a grid object that covers the continental United States
const nx = 121, ny = 61;
const grid = new apgl.PlateCarreeGrid(nx, ny, -130, 20, -65, 55);
```

Next, create a RawScalarField with the data. autumnplot-gl doesn't care about how data get to the browser, but it should end up in a Float32Array in row-major order with the first element being at the southwest corner of the grid. A future version might include support for reading from, say, a Zarr file. Once you have your data in that format, to create the raw data field:

```javascript
// Create the raw data field
const height_field = new apgl.RawScalarField(grid, height_data);
```

Next, to contour the field, create a Contour object and pass it some options. At this time, a somewhat limited set of options is supported, but I do plan to expand this.

```javascript
// Contour the data
const height_contour = new apgl.Contour(height_field, {color: '#000000', interval: 30});
```

Next, create the actual layer that gets added to the map. The first argument (`'height-contour'` here) is an id. It doesn't mean much, but it does need to be unique between the different `PlotLayer`s you add to the map.

```javascript
// Create the map layer
const height_layer = new apgl.PlotLayer('height-contour', height_contour);
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

The `'railway_transit_tunnel'` argument is a layer in the map style, and this means to add your layer just below that layer on the map. This usually produces better results than just blindly slapping all your layers on top of all the map (though the map style itself my require some tweaking to produce the best results).

### Barbs

Wind barb plotting is similar to the contours, but it requires u and v data.

```javascript
const vector_field = {u: new apgl.RawScalarField(grid, u_data), 
                      v: new apgl.RawScalarField(grid, v_data)}
const barbs = new apgl.Barbs(vector_field, {color: '#000000', thin_fac: 16});
const barb_layer = new apgl.PlotLayer('barbs', barbs);

map.on('load', () => {
    map.addLayer(barb_layer, 'railway_transit_tunnel');
});
```

The density of the wind barbs is automatically varied based on the map zoom level. The `'thin_fac': 16` option means to plot every 16th wind barb in the i and j directions, and this is defined at zoom level 1. So at zoom level 2, it will plot every 8th wind barb, and at zoom level 3 every 4th wind barb, and so on. Because it divides in 2 for every deeper zoom level, `'thin_fac'` should be a power of 2.

### Filled contours

Plotting filled contours is also similar to plotting regular contours, but there's some additional steps for the color map. A couple color maps are available by default, but if you have the colors you want, creating your own is (relatively) painless (hopefully). First, set up the colormap. Here, we'll just use the bluered colormap included by default.

```javascript
const colormap = apgl.ColorMap.bluered(-10, 10, 20);
const fills = new apgl.ContourFilled(height, {cmap: colormap});
const height_fill_layer = new apgl.PlotLayer('height-fill', fills);

map.on('load', () => {
    map.addLayer(height_fill_layer, 'railway_transit_tunnel');
});
```

Normally, when you have color-filled contours, you have a color bar on the plot. To create an SVG color bar:

```javascript
const colorbar_svg = apgl.makeColorBar(colormap, {label: "Height Perturbation (m)", 
                                                  orientation: 'horizontal', 
                                                  tick_direction: 'bottom'});

document.getElementById('colorbar-container').appendChild(colorbar_svg);
```

### Varying the data plots
The previous steps have gone through plotting a static dataset on a map, but in many instances, you want to view a dataset that changes, say over time. Rather than continually remove and add new layers when the user changes the time, which would get tedious and probably wouldn't perform very well, autumnplot-gl provides `MultiPlotLayer`, which allows the plotted data to easily and quickly change over time (or height or any other axis that might be relevant).

```javascript
// Contour some data
const height_contour_f00 = new apgl.Contour(grid, height_f00);
const height_contour_f01 = new apgl.Contour(grid, height_f01);
const height_contour_f02 = new apgl.Contour(grid, height_f02);

// Create a varying map layer
const height_layer_time = new apgl.MultiPlotLayer('height-contour-time');

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

## Links
[Github](https://github.com/tsupinie/autumnplot-gl) | API docs (link will be here when it's available)

## Closing thoughts
Even though autumnplot-gl is currently an extremely new package with relatively limited capability, I hope folks see potential and find it useful. Any contributions to fill out some missing features are welcome.
