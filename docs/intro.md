---
sidebar_position: 1
---

# Introduction
Lots of meteorological data web sites have a model where the data live on a central server, get plotted on the server, and then the server serves static images to the client. This creates a bottleneck where adding fields and view sectors takes exponentially more processing power for the server. One way around this is to offload the plotting to the client and to have the browser plot the data on a pan-and-zoomable map. Unfortunately, in the past, this has required developing low-level plotting code, and depending on the mapping library, the performance may be poor.

autumnplot-gl provides a solution to this problem by making hardware-accelerated data plotting in the browser easy. This was designed with meteorological data in mind, but anyone wanting to contour geospatial data on a map can use autumnplot-gl.

## Installation from NPM
autumnplot-gl is designed to be used with either [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/) or [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/) mapping libraries. If you're using webpack or another node-based build tool, you can install by running

```bash
npm i autumnplot-gl
```

You may have to modify your build tool configuration to include the WebAssembly binary. For webpack, I've found adding this to your `webpack.config.js` works:

```javascript
{
    "module": {
        "rules": [
            {
                test: /\.wasm$/,
                type: "asset/resource",
                generator: {
                    filename: "[name].wasm"
                }
            }
        ]
    }
}
```

## Pre-built Javascript source files
If you'd rather use pre-built files and not mess with webpack or any other bundler ([understandable!](https://bsky.app/profile/plustssn.autumnsky.us/post/3luxvjinjo22n)), you can grab these three files and include them in the same directory in your project.

* <a href="/assets/dist/autumnplot-gl.js" target="_blank" download>autumnplot-gl.js</a>
* <a href="/assets/dist/983.autumnplot-gl.js" target="_blank" download>983.autumnplot-gl.js</a>
* <a href="/assets/dist/marchingsquares.wasm" target="_blank" download>marchingsquares.wasm</a>

Then include the main `autumnplot-gl.js` file in your html as a Javascript source.

```html
<script src="path/to/autumnplot-gl.js"></script>
```

When you these in your project, everything will appear in the `apgl` namespace. So instead of `new PlateCarreeGrid()`, for example, you'll have to use `new apgl.PlateCarreeGrid()`.