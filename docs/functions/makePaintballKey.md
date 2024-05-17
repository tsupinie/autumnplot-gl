[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / makePaintballKey

# Function: makePaintballKey()

> **makePaintballKey**(`colors`, `labels`, `opts`?): `SVGElement`

Make an SVG containing a color key for a paintball plot. The key can be split over any number of columns.

## Parameters

• **colors**: (`string` \| [`Color`](../interfaces/Color.md))[]

A list of colors

• **labels**: `string`[]

The labels corresponding to each color

• **opts?**: [`PaintballKeyOptions`](../interfaces/PaintballKeyOptions.md)

The options for creating the color key

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

## Source

[ColorBar.ts:288](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/ColorBar.ts#L288)
