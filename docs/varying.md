---
sidebar_position: 4
---

# Varying the Data Plots
In previous examples, we've plotted a static dataset on a map, but in many instances, you want to view a dataset that changes, say over time. In order to switch the data currently plotted, you can call `updateField()` on the plot component (e.g, `ContourFilled`, `Barbs`, etc.) to switch what field is plotted.

```javascript
// Create the initial field
const height_field_f00 = new RawScalarField(grid, height_data_f00);
const fills = new Contour(height_data_f00, {interval: 30});

// Update the field plotted
const height_field_f01 = new RawScalarField(grid, height_data_f01);
fills.updateField(height_field_f01);
```

One potential issue with this method for contour plots in particular is that the contouring is done when you call `updateField()`. If you have large grids, this can introduce some lag into your application when the user updates the plot time. One way to solve this is to use `MultiPlotLayer`. The main difference between this and using `updateField()` is that `MultiPlotLayer` will put all data for all times onto VRAM at once. In contrast, with `PlotLayer` and `updateField()`, only the data currently plotted are stored on VRAM. For contour plots, this means all the contouring is done up front, so switching fields is fast. However, for large grids, using a `MultiPlotLayer` may take up a large amount of VRAM, so consider mobile devices with limited VRAM when using a `MultiPlotLayer`.

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

The second argument to `addField()` is the key to associate with this field. This example uses the absolute time, but you could just as easily use `'f00'`, `'f01'`, etc., or anything else that's relevant as long as it's unique. Now to set the active time (i.e., the time that gets plotted):

```javascript
// Set the active field in the map layer (the map updates automatically)
height_layer.setActiveKey('20230112_1200');
```