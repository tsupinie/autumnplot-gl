[autumnplot-gl](../README.md) / [Exports](../modules.md) / ColorMap

# Class: ColorMap

A mapping from values to colors

## Table of contents

### Constructors

- [constructor](ColorMap.md#constructor)

### Properties

- [colors](ColorMap.md#colors)
- [levels](ColorMap.md#levels)

### Methods

- [getColors](ColorMap.md#getcolors)
- [getOpacities](ColorMap.md#getopacities)
- [bluered](ColorMap.md#bluered)
- [diverging](ColorMap.md#diverging)
- [redblue](ColorMap.md#redblue)

## Constructors

### constructor

• **new ColorMap**(`levels`, `colors`)

Create a color map

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `levels` | `number`[] | The list of levels. The number of levels should always be one more than the number of colors. |
| `colors` | [`Color`](../interfaces/Color.md)[] | A list of colors |

#### Defined in

[Colormap.ts:23](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Colormap.ts#L23)

## Properties

### colors

• `Readonly` **colors**: [`Color`](../interfaces/Color.md)[]

#### Defined in

[Colormap.ts:16](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Colormap.ts#L16)

___

### levels

• `Readonly` **levels**: `number`[]

#### Defined in

[Colormap.ts:15](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Colormap.ts#L15)

## Methods

### getColors

▸ **getColors**(): `string`[]

#### Returns

`string`[]

an array of hex color strings

#### Defined in

[Colormap.ts:35](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Colormap.ts#L35)

___

### getOpacities

▸ **getOpacities**(): `number`[]

#### Returns

`number`[]

an array of opacities, one for each color in the color map

#### Defined in

[Colormap.ts:42](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Colormap.ts#L42)

___

### bluered

▸ `Static` **bluered**(`level_min`, `level_max`, `n_colors`): [`ColorMap`](ColorMap.md)

Create a diverging blue/red colormap, where blue corresponds to the lowest value and red corresponds to the highest value

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `level_min` | `number` | The lowest value in the color map |
| `level_max` | `number` | The highest value in the color map |
| `n_colors` | `number` | The number of colors |

#### Returns

[`ColorMap`](ColorMap.md)

a Colormap object

#### Defined in

[Colormap.ts:116](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Colormap.ts#L116)

___

### diverging

▸ `Static` **diverging**(`color1`, `color2`, `level_min`, `level_max`, `n_colors`): [`ColorMap`](ColorMap.md)

Create a diverging color map using two input colors

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color1` | `string` | The color corresponding to the lowest value in the color map |
| `color2` | `string` | The color corresponding to the highest value in the color map |
| `level_min` | `number` | The lowest value in the color map |
| `level_max` | `number` | The highest value in the color map |
| `n_colors` | `number` | The number of colors to use |

#### Returns

[`ColorMap`](ColorMap.md)

a Colormap object

#### Defined in

[Colormap.ts:55](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Colormap.ts#L55)

___

### redblue

▸ `Static` **redblue**(`level_min`, `level_max`, `n_colors`): [`ColorMap`](ColorMap.md)

Create a diverging red/blue colormap, where red corresponds to the lowest value and blue corresponds to the highest value

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `level_min` | `number` | The lowest value in the color map |
| `level_max` | `number` | The highest value in the color map |
| `n_colors` | `number` | The number of colors |

#### Returns

[`ColorMap`](ColorMap.md)

a Colormap object

#### Defined in

[Colormap.ts:105](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Colormap.ts#L105)
