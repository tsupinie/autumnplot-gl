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
- [withOpacity](ColorMap.md#withopacity)
- [diverging](ColorMap.md#diverging)

## Constructors

### constructor

• **new ColorMap**(`levels`, `colors`)

Create a color map

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `levels` | `number`[] | The list of levels. The number of levels should always be one more than the number of colors. |
| `colors` | `string`[] \| [`Color`](../interfaces/Color.md)[] | A list of colors |

#### Defined in

[Colormap.ts:32](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Colormap.ts#L32)

## Properties

### colors

• `Readonly` **colors**: [`Color`](../interfaces/Color.md)[]

#### Defined in

[Colormap.ts:25](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Colormap.ts#L25)

___

### levels

• `Readonly` **levels**: `number`[]

#### Defined in

[Colormap.ts:24](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Colormap.ts#L24)

## Methods

### getColors

▸ **getColors**(): `string`[]

#### Returns

`string`[]

an array of hex color strings

#### Defined in

[Colormap.ts:44](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Colormap.ts#L44)

___

### getOpacities

▸ **getOpacities**(): `number`[]

#### Returns

`number`[]

an array of opacities, one for each color in the color map

#### Defined in

[Colormap.ts:51](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Colormap.ts#L51)

___

### withOpacity

▸ **withOpacity**(`func`): [`ColorMap`](ColorMap.md)

Make a new color map with different opacities. The opacities are set by func.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `func` | (`level_lower`: `number`, `level_upper`: `number`) => `number` | A function which takes the two levels associated with a color (an upper and lower bound) and returns an opacity in the range from 0 to 1. |

#### Returns

[`ColorMap`](ColorMap.md)

A new color map

#### Defined in

[Colormap.ts:60](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Colormap.ts#L60)

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

[Colormap.ts:90](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Colormap.ts#L90)
