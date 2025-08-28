---
sidebar_position: 5
---
import {ColorMapSpread} from '@site/src/components/ColorMapSpread';

# Color Maps

## Built-in color maps
autumnplot-gl comes with several built-in color maps. These are basic blue/red and red/blue diverging color maps plus a selection from [PivotalWeather](https://www.pivotalweather.com). The blue/red and red/blue are functions that take a minimum contour level, a maximum contour level, and a number of colors. For example, this creates a blue/red colormap starting at -10, ending at 10, and with 20 colors:

```javascript
import {colormaps} from 'autumnplot-gl'
const colormap = colormaps.bluered(-10, 10, 20);
```

Here are all the colormaps available:

<ColorMapSpread/>

## Custom color maps
If you want to create your own color map, you can supply arrays of data levels and colors and create one like so:

```javascript
import {ColorMap} from 'autumnplot-gl';

const levels = [1, 2, 3];
const colors = ['#999999', '#cccccc'];
const cmap = new ColorMap(levels, colors, {underflow_color: '#666666', 
                                           overflow_color: '#ffffff'});
```

There should be one more data level than color in the arrays. You can also supply an `underflow_color` and `overflow_color` for values outside the range of the data levels, and those will be noted with the arrows on the ends of the color bar.