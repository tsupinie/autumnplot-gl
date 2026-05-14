---
title: makePaintballKey()
---

# Function: makePaintballKey()

> **makePaintballKey**(`colors`, `labels`, `opts?`): `SVGElement`

Defined in: [ColorBar.ts:329](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/ColorBar.ts#L329)

Make an SVG containing a color key for a paintball plot. The key can be split over any number of columns.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `colors` | (`string` \| [`Color`](../classes/Color.md))[] | A list of colors |
| `labels` | `string`[] | The labels corresponding to each color |
| `opts?` | [`PaintballKeyOptions`](../interfaces/PaintballKeyOptions.md) | The options for creating the color key |

## Returns

`SVGElement`

An SVGElement containing the color bar image.

## Example

```ts
// Create the color key
const svg = makePaintballKey(colors, labels, {n_cols: 2, fontface: 'Trebuchet MS'});

// Add the color key to the page
document.getElementById('pb-key-container').appendChild(svg);
```
