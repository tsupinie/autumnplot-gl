---
sidebar_position: 7
---

# Map Tiles
The examples here use map tiles from [Maptiler](https://www.maptiler.com/). Map tiles from Maptiler or Mapbox or others are free up to a (reasonably generous) limit, but the pricing can be a tad steep after reaching the limit. The tiles from these services are extremely detailed, and really what you're paying for there is the hardware to store, process, and serve that data. While these tiles are very nice, the detail is way overkill for a lot of uses in meteorology. 

So, I've created some less-detailed map tiles that are small enough that they can be hosted without dedicated hardware. However the tradeoff is that they're only useful down to zoom level 8 or 9 on the map, such that the viewport is somewhere between half a US state and a few counties in size. Below that, the Natural Earth data do not contain enough detail. If that's good enough for you, then these tiles could be useful.

## Files
* [autumn-tiles.tar.gz](/assets/tiles/autumn-tiles.tar.gz): The tiles themselves
* [tiles.json](/assets/tiles/tiles.json): Some metadata for the tiles
* [style.json](/assets/tiles/style.json): A default style for the tiles

## Usage
MapLibre expects to fetch the tiles itself, so you'll want to untar the them and put them and the JSON files on on a server (or start up a local web server on your machine). Next, you'll need to modify tiles.json to point to where the tiles are located:

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

:::tip
If you're using a bundler for your project, you could also import the style json file and pass that object straight to the map instance.

```javascript
import map_style from './style.json';

const map = new maplibregl.Map({
    # ...
    style: map_style
});
```

This could make it easier to modify the style later.
:::

## Customizing the tile style
You can modify style.json however you see fit. Specifically, this file is a [maplibre-gl style specification](https://maplibre.org/maplibre-gl-js-docs/style-spec/). Most things are relatively straightforward, but there are a few non-intuitive things (that aren't helped by the inability to put comments in a JSON file). 

### "Stops"
In a few instances, you might see something like

```json
{
    "line-width": {
        "stops": [
            [5, 1.5],
            [6, 2.25]
        ]
    }
}
```

This specifies a linear interpolation as a function of zoom level. So in this case at zoom level 5 or below, the line width will be 1.5, and at 6 or above, the line width will be 2.25. In between, maplibregl will linearly interpolate. You can add as many stops as you like.

### Expressions

For the place name text size, you'll see something this:

```json
{
    "text-size": [
        "step", ["zoom"], 12,
        3, ["case", [">=", ["get", "rank"], 13], 16, 12],
        6, ["case", [">=", ["get", "rank"], 13], 20, [">=", ["get", "rank"], 10], 16, 12]
    ],
}
```

This represents a couple nested if statements, put into one of the more confusing data structures. This effectively implements this if statement:
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