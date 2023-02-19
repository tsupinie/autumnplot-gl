# Autumn Map Tiles
Low-detail map tiles for use with MapLibre. These tiles are probably really only good down to zoom level 8 or 9 (half a US state to a few counties in size). Below that, the Natural Earth data do not contain sufficient detail.

## Files
* [autumn-tiles.tar.gz](autumn-tiles.tar.gz): The tiles themselves
* [tiles.json](tiles.json): Some metadata for the tiles
* [style.json](style.json): A default style for the tiles

## Usage
MapLibre expects to fetch these itself, so you'll want to untar the tiles and put them and the JSON files on on a server (or start up a local web server on your machine). Next, you'll need to modify tiles.json to point to where the tiles are located:

```json
{
    "tiles": [
        "https://example.com/path/to/tiles/{z}/{x}/{y}.pbf"
    ]
}
```

You'll also need to modify style.json to point to your tiles.json file.

```json
{
    "sources": {
        "autumn": {
            "url": "https://example.com/path/to/tiles.json",
            "type": "vector"
        }
    }
}
```

Finally, add the style.json when you create your map object.

```javascript
const map = new maplibregl.Map({
    # ...
    style: 'https://example.com/path/to/style.json'
});
```

## Customizing the tile style
You can modify style.json however you see fit. Specifically, this file is a [maplibre-gl style specification](https://maplibre.org/maplibre-gl-js-docs/style-spec/). Most things are relatively straightforward, but there are a few non-intuitive things (that aren't helped by the inability to put comments in a JSON file). 

### "Stops"
In a few instances, you might see something like

```json
"line-width": {
    "stops": [
        [5, 1.5],
        [6, 2.25]
    ]
}
```

This specifies a linear interpolation as a function of zoom level. So in this case at zoom level 5 or below, the line width will be 1.5, and at 6 or above, the line width will be 2.25. In between, maplibregl will linearly interpolate. You can add as many stops as you like.

### Expressions

For the place name text size, you'll see something this:

```json
"text-size": [
    "step", ["zoom"], 12,
    3, ["case", [">=", ["get", "rank"], 13], 16, 12],
    6, ["case", [">=", ["get", "rank"], 13], 20, [">=", ["get", "rank"], 10], 16, 12]
],
```

This is effectively a couple nested if statement, put into one of the more confusing data structures. This effectively implements this if statement:
```javascript
let text_size;
if (zoom < 3) {
    text_size = 12;
}
else if (zoom >= 3 && zoom < 6) {
    if (place.rank >= 13) {
        text_size = 16;
    }
    else {
        text_size = 12;
    }
}
else if (zoom >= 6) {
    if (place.rank >= 13) {
        text_size = 20;
    }
    else if (place.rank >= 10) {
        text_size = 16;
    }
    else {
        text_size = 12;
    }
}
```

Here, `place.rank` is a Natural Earth city importance ranking (for a point of reference, New York City is rank 14).
