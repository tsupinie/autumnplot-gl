[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / ColorMap

# Class: ColorMap

A mapping from values to colors

## Constructors

### new ColorMap()

> **new ColorMap**(`levels`, `colors`, `opts`?): [`ColorMap`](ColorMap.md)

Create a color map

#### Parameters

• **levels**: `number`[]

The list of levels. The number of levels should always be one more than the number of colors.

• **colors**: `string`[] \| [`Color`](../interfaces/Color.md)[]

A list of colors

• **opts?**: [`ColorMapOptions`](../interfaces/ColorMapOptions.md)

Options for the color map

#### Returns

[`ColorMap`](ColorMap.md)

#### Source

[Colormap.ts:44](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Colormap.ts#L44)

## Properties

### colors

> `readonly` **colors**: [`Color`](../interfaces/Color.md)[]

#### Source

[Colormap.ts:34](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Colormap.ts#L34)

***

### levels

> `readonly` **levels**: `number`[]

#### Source

[Colormap.ts:33](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Colormap.ts#L33)

***

### overflow\_color

> `readonly` **overflow\_color**: [`Color`](../interfaces/Color.md)

#### Source

[Colormap.ts:35](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Colormap.ts#L35)

***

### underflow\_color

> `readonly` **underflow\_color**: [`Color`](../interfaces/Color.md)

#### Source

[Colormap.ts:36](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Colormap.ts#L36)

## Methods

### getColors()

> **getColors**(): `string`[]

#### Returns

`string`[]

an array of hex color strings

#### Source

[Colormap.ts:62](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Colormap.ts#L62)

***

### getOpacities()

> **getOpacities**(): `number`[]

#### Returns

`number`[]

an array of opacities, one for each color in the color map

#### Source

[Colormap.ts:69](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Colormap.ts#L69)

***

### withOpacity()

> **withOpacity**(`func`): [`ColorMap`](ColorMap.md)

Make a new color map with different opacities. The opacities are set by func.

#### Parameters

• **func**

A function which takes the two levels associated with a color (an upper and lower bound) and returns an opacity in the range from 0 to 1.

#### Returns

[`ColorMap`](ColorMap.md)

A new color map

#### Source

[Colormap.ts:78](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Colormap.ts#L78)

***

### diverging()

> `static` **diverging**(`color1`, `color2`, `level_min`, `level_max`, `n_colors`): [`ColorMap`](ColorMap.md)

Create a diverging color map using two input colors

#### Parameters

• **color1**: `string`

The color corresponding to the lowest value in the color map

• **color2**: `string`

The color corresponding to the highest value in the color map

• **level\_min**: `number`

The lowest value in the color map

• **level\_max**: `number`

The highest value in the color map

• **n\_colors**: `number`

The number of colors to use

#### Returns

[`ColorMap`](ColorMap.md)

a Colormap object

#### Source

[Colormap.ts:124](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Colormap.ts#L124)
