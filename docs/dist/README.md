# Pre-built autumnplot-gl JS files

## Files
* [autumnplot-gl.js](autumnplot-gl.js): The main code
* [110.autumnplot-gl.js](110.autumnplot-gl.js): A web worker file

## Usage
To use autumnplot-gl, grab both these files and put them in the same directory in your project. Then add this to your web page:

```html
<script src="path/to/autumnplot-gl.js"></script>
```

This exposes the [API](https://tsupinie.github.io/autumnplot-gl/modules.html) via the `apgl` global variable. (Side note: if anyone knows how to make webpack5 output a different name for the web worker file, I'm all ears.)
