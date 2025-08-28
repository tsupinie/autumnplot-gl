# autumnplot-gl
Hardware-accelerated geospatial data plotting in the browser

## Links
[Github](https://github.com/tsupinie/autumnplot-gl) | [Tutorial](https://tsupinie.github.io/autumnplot-gl) | [API docs](https://tsupinie.github.io/autumnplot-gl/docs/api) | [NPM](https://www.npmjs.com/package/autumnplot-gl)

## What is this?
Lots of meteorological data web sites have a model where the data live on a central server, get plotted on the server, and then the server serves static images to the client. This creates a bottleneck where adding fields and view sectors takes exponentially more processing power for the server. One way around this is to offload the plotting to the client and to have the browser plot the data on a pan-and-zoomable map. Unfortunately, in the past, this has required developing low-level plotting code, and depending on the mapping library, the performance may be poor.

autumnplot-gl provides a solution to this problem by making hardware-accelerated data plotting in the browser easy. This was designed with meteorological data in mind, but anyone wanting to contour geospatial data on a map can use autumnplot-gl.

## How do I use this?

Check out the [tutorial](https://tsupinie.github.io/autumnplot-gl) for installation and usage information.

## Development

To work on autumnplot-gl itself, it takes a few steps to set up

1. Install [node.js](https://nodejs.org/en/download/) if you don't have it already
2. Install [emscripten](https://emscripten.org/docs/getting_started/downloads.html) and source the relevant SDK environment for your shell
3. Clone the autumnplot-gl git repo (`git clone https://github.com/tsupinie/autumnplot-gl ; cd autumnplot-gl`)
4. Install the dependencies (`npm install`)
5. Build the WASM module (`cd src/cpp ; make js ; cd -`)
6. Start the dev server (`npm run start`)
