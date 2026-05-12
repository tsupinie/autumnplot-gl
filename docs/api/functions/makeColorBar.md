---
title: makeColorBar()
---

# Function: makeColorBar()

> **makeColorBar**(`colormap`, `opts`): `SVGElement`

Defined in: [ColorBar.ts:96](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/ColorBar.ts#L96)

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
