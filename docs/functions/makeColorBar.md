[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / makeColorBar

# Function: makeColorBar()

> **makeColorBar**(`colormap`, `opts`): `SVGElement`

Make an SVG containing a color bar. The color bar can either be oriented horizontal or vertical, and a label can be provided.

## Parameters

• **colormap**: [`ColorMap`](../classes/ColorMap.md)

The color map to use

• **opts**: [`ColorBarOptions`](../interfaces/ColorBarOptions.md)

The options for creating the color bar

## Returns

`SVGElement`

An SVGElement containing the color bar image.

## Example

```ts
// Create the color bar
const svg = makeColorBar(color_map, {label: 'Wind Speed (kts)', orientation: 'horizontal', 
                                     fontface: 'Trebuchet MS'});

// Add colorbar to the page
document.getElementById('colorbar-container').appendChild(svg);
```

## Source

[ColorBar.ts:71](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/ColorBar.ts#L71)
