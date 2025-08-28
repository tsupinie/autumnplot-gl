---
title: makePaintballKey()
---

# Function: makePaintballKey()

> **makePaintballKey**(`colors`, `labels`, `opts?`): `SVGElement`

Defined in: [ColorBar.ts:316](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/ColorBar.ts#L316)

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
