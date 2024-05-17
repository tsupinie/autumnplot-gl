# Pre-built autumnplot-gl JS files

## Files
* [autumnplot-gl.js](autumnplot-gl.js): The main code
* [autumnplot-gl.js.map](autumnplot-gl.js.map): The source map for the main code (optional)
* [110.autumnplot-gl.js](110.autumnplot-gl.js): A web worker file
* [110.autumnplot-gl.js.map](110.autumnplot-gl.js.map): The source map for the web worker file (optional)
* [marchingsquares.wasm](marchingsquares.wasm): A WebAssembly binary file for the contouring

## Usage
To use autumnplot-gl, grab these files and put them in the same directory in your project. Then add this to your web page:

```html
<script src="path/to/autumnplot-gl.js"></script>
```

This exposes the [API](https://tsupinie.github.io/autumnplot-gl/modules.html) via the `apgl` global variable. (Side note: if anyone knows how to make webpack5 output a different name for the web worker file, I'm all ears.)
