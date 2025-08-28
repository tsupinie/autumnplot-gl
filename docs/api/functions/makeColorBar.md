---
title: makeColorBar()
---

# Function: makeColorBar()

> **makeColorBar**(`colormap`, `opts`): `SVGElement`

Defined in: [ColorBar.ts:95](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/ColorBar.ts#L95)

Make an SVG containing a color bar. The color bar can either be oriented horizontal or vertical, and a label can be provided.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `colormap` | [`ColorMap`](../classes/ColorMap.md) | The color map to use |
| `opts` | [`ColorBarOptions`](../interfaces/ColorBarOptions.md) | The options for creating the color bar |

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
