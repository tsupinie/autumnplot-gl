---
sidebar_position: 3
---
import {DemoMap, DemoObsLayer, DemoHodographLayer, DemoPaintballLayer} from '@site/src/components/DemoMap';
import {SymbolSpread} from '@site/src/components/SymbolSpread';

# Advanced Data Plotting

## Paintball plots

Paintball plots are a slightly niche way to display data from ensembles of meteorological models. The idea is to only contour each member where the field meets some threshold. One could download each member individually and do a `ContourFill` on them, but that could potentially be a lot of data downloaded. Especially because what is being plotting is effectively one bit of information about each member at each data point: whether the member is above or below the desired threshold. 

So one optimization is to treat each member as a bit, and pack all the thresholded members into a bit mask. Constructing this field in Javascript might look something like this

```javascript
for (let i = 0; i < n_grid_points; i++) {
    paintball_data[i] = ((member1[i] >= threshold ? 1 : 0) * 1 +
                         (member2[i] >= threshold ? 1 : 0) * 2 +
                         (member3[i] >= threshold ? 1 : 0) * 4 + 
                         (member4[i] >= threshold ? 1 : 0) * 8 + 
                         /* ... */);
}
```

where `member1`, `member2`, etc. are the member data for each member.

:::warning
For now, `paintball_data` must be either a `Float32Array` or `Float16Array`, which puts a cap on the maximum number of members that are possible with this configuration. For 32-bit floats, the number of bits in the mantissa (significand; see https://en.wikipedia.org/wiki/Single-precision_floating-point_format) is 23, so you can represent up to 23 members in a 32-bit float. For `Float16Array`s, that number is 10.
:::

Colors are specified in member order:

```javascript
const colors = [member1_color, member2_color, member3_color, /* ... */];
const paintball_field = new RawScalarField(grid, paintball_data);
const paintball = new Paintball(paintball_field, {colors: colors});
const paintball_layer = new PlotLayer('paintball', paintball);

map.on('load', () => {
    map.addLayer(paintball_layer, 'countries-boundary');
});
```

<DemoMap>
    <DemoPaintballLayer/>
</DemoMap>

:::tip
Members are plotted in order, so members plotted later cover up members plotted earlier. For this reason, paintball plots are most effective with small areas of color, such as area of simulated radar reflectivity > 40 dBZ.
:::

Like with color fills, a color key is typically used with paintball plots to tell which member is which color. You can make a paintball color key with the `makePaintballKey()` function (this example sets `n_cols` to 3 to make a key with 3 columns of color/name pairs).

```javascript
const member_names = ['Member 1', 'Member 2', 'Member 3', /* ... */];
const paintball_key_svg = apgl.makePaintballKey(colors, member_names, {n_cols: 3});
document.getElementById('paintball-key-container').appendChild(paintball_key_svg);
```

## Station plots

This is the typical plotting method for in-situ observed data (such as surface weather observations). However, because these data are typically not gridded, and these plots typically contain many elements, it takes a bit of care to set everything up in the code. First, we should specify how the observation data should be structured. Here's one example:

```json
[
    {
        "coord": {"lat": -14.33, "lon": -170.71}, // Coordinate of the
                                                  // observation station
        "data": {
            "pres": 1012.88,        // Pressure (not used in the example below,
                                    //   and that's fine)
            "tmpf": 78.8,           // Temperature
            "dwpf": null,           // Dewpoint (null means missing)
            "wind": [13.97, 120.0], // Wind (or any vector quantity) is 
                                    //   specified as a (speed, direction) pair
            "skyc": "0/8",          // Sky cover is specified as fraction out
                                    //   of 8 ("obsc" for "sky obscured" is
                                    //   also an option).
        }
    },
    // ... Additional observations
]
```

Strictly speaking, the coordinates and data don't need to be bundled together, but it's the most convenient way. Like with plotting gridded data, point data have a "grid" object and then a "field" object defined on that grid. The grid object will require an array of coordinates, and the fieldo object will require an array of each data point. This can be accomplished like so:

```javascript
// Create an unstructured grid from the 'coord' property of each observation
const obs_grid = new UnstructuredGrid(obs.map(o => o.coord));

// Create the field of observations on the above unstructured grid
const obs_field = new RawObsField(obs_grid, obs.map(o => o.data));
```

Now that we have our grid and field objects created, we need to specify how the station plots should look. We can do this with another object.

```javascript
const station_plot_locs = {
    tmpf: {               // tmpf will be matched with the same property in
                          //   the observed data
        type: 'number',   // 'number' means to plot this as a numerical value
                          //   beside the station plot
        pos: 'ul',        // 'ul' means plot to the upper left of the station
        color: '#cc0000', // Text color

        // Specifies how to format the number. Takes number or null and returns
        //   a string
        formatter: val => val === null ? '' : val.toFixed(0)
    },
    dwpf: {
        type: 'number',
        pos: 'll', 
        color: '#00aa00', 
        formatter: val => val === null ? '' : val.toFixed(0)
    },
    wind: {
        type: 'barb',   // 'barb' means that this should be plotted as a wind
                        //   barb. The 'wind' property in the data should be a
                        //   vector with speed and direction.
    },
    skyc: {
        type: 'symbol', // 'symbol' means that this property should be plotted
                        //   as a symbol. This can be either a sky cover or
                        //   present weather symbol. See below for a list
                        //   of accepted codes and the symbols they produce.
        pos: 'c'        // Plot this in the center. It will be plotted on top
                        //   of the barb, since it's after the barb in this 
                        //   object.
    },
};
```

Now create the plot component and plot layer and add it to the map as in previous examples.

```javascript
const station_plot = new StationPlot(obs_field, 
    {config: station_plot_locs, thin_fac: 8, font_size: 14});

const station_plot_layer = new PlotLayer('station-plots', station_plot);

map.on('load', () => {
    map.addLayer(station_plot_layer, 'countries-boundary');
});
```

<DemoMap>
  <DemoObsLayer/>
</DemoMap>

### Symbol list

Here is a list of all the symbols that are available along with the codes to put in the observation data to get them.

<SymbolSpread/>

## Hodograph plots

Hodographs are tools to visualize wind profiles for severe weather forecasting, and they can be plotted on a map to visualize how wind profiles change across space. Because they're profiles, the hodographs require a different way to specify the data than the typical gridded data source. One way to specify for an unstructured grid might be like so:

```json
[
    {
        "lat": 39.496,    // Latitude of the profile point
        "lon": -121.632,  // Longitude of the profile point
        "u": [-4.30, -5.63, -4.87 /* ... */], // List of u winds in knots
        "v": [11.20, 10.60, 12.05 /* ... */], // List of v winds in knots
        "z": [0.098, 0.171, 0.236 /* ... */]  // List of altitudes in kilometers
    }
    // ... Additional profiles
]
```

Next, process the raw profiles into an unstructured grid and a profile field object.

```javascript
const points = profile_json.map(prof => ({lon: prof.lon, lat: prof.lat}));
const profs = profile_json.map((prof, iprof) => ({ilon: iprof, jlat: 0, 
                                                  u: new Float32Array(prof.u), 
                                                  v: new Float32Array(prof.v), 
                                                  z: new Float32Array(prof.z)}));

const hodo_grid = new UnstructuredGrid(points);
const raw_prof_field = new RawProfileField(hodo_grid, profs);
```

The profiles that get passed to `RawProfileField` must have the `ilon` and `jlat` properties. If we were using a 2-dimensional Cartesian grid (for example, a `LambertGrid`), these would be the indices for the profile in each dimension of the grid. However, on an unstructured grid like we're using here, `ilon` should be the profile index, and `jlat` is ignored. These are used for the automatic thinning when the map zooms in and out. Now create a hodographs object and a plot layer like usual.

```javascript
const hodos = new Hodographs(raw_prof_field, {bgcolor: '#ffffff', thin_fac: 8});
const hodo_layer = new PlotLayer('hodos', hodos);

map.on('load', () => {
    map.addLayer(hodo_layer, 'countries-boundary');
});
```

<DemoMap>
  <DemoHodographLayer/>
</DemoMap>