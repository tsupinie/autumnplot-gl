---
title: ColorMap
---

# Class: ColorMap

Defined in: [Colormap.ts:28](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Colormap.ts#L28)

A mapping from values to colors

## Constructors

### Constructor

> **new ColorMap**(`levels`, `colors`, `opts?`): `ColorMap`

Defined in: [Colormap.ts:40](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Colormap.ts#L40)

Create a color map

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `levels` | `number`[] | The list of levels. The number of levels should always be one more than the number of colors. |
| `colors` | `string`[] \| [`Color`](Color.md)[] | A list of colors |
| `opts?` | [`ColorMapOptions`](../interfaces/ColorMapOptions.md) | Options for the color map |

#### Returns

`ColorMap`

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="colors"></a> `colors` | `readonly` | [`Color`](Color.md)[] | [Colormap.ts:30](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Colormap.ts#L30) |
| <a id="levels"></a> `levels` | `readonly` | `number`[] | [Colormap.ts:29](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Colormap.ts#L29) |
| <a id="overflow_color"></a> `overflow_color` | `readonly` | `null` \| [`Color`](Color.md) | [Colormap.ts:31](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Colormap.ts#L31) |
| <a id="underflow_color"></a> `underflow_color` | `readonly` | `null` \| [`Color`](Color.md) | [Colormap.ts:32](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Colormap.ts#L32) |

## Methods

### getColors()

> **getColors**(): `string`[]

Defined in: [Colormap.ts:56](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Colormap.ts#L56)

#### Returns

`string`[]

an array of hex color strings

***

### getOpacities()

> **getOpacities**(): `number`[]

Defined in: [Colormap.ts:63](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Colormap.ts#L63)

#### Returns

`number`[]

an array of opacities, one for each color in the color map

***

### withOpacity()

> **withOpacity**(`func`): `ColorMap`

Defined in: [Colormap.ts:72](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Colormap.ts#L72)

Make a new color map with different opacities. The opacities are set by func.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `func` | (`level_lower`, `level_upper`) => `number` | A function which takes the two levels associated with a color (an upper and lower bound) and returns an opacity in the range from 0 to 1. |

#### Returns

`ColorMap`

A new color map

***

### diverging()

> `static` **diverging**(`color1`, `color2`, `level_min`, `level_max`, `n_colors`): `ColorMap`

Defined in: [Colormap.ts:118](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Colormap.ts#L118)

Create a diverging color map using two input colors

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color1` | `string` | The color corresponding to the lowest value in the color map |
| `color2` | `string` | The color corresponding to the highest value in the color map |
| `level_min` | `number` | The lowest value in the color map |
| `level_max` | `number` | The highest value in the color map |
| `n_colors` | `number` | The number of colors to use |

#### Returns

`ColorMap`

a Colormap object
