---
title: ColorMap
---

# Class: ColorMap

Defined in: [Colormap.ts:27](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Colormap.ts#L27)

A mapping from values to colors

## Constructors

### Constructor

> **new ColorMap**(`levels`, `colors`, `opts?`): `ColorMap`

Defined in: [Colormap.ts:39](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Colormap.ts#L39)

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
| <a id="colors"></a> `colors` | `readonly` | [`Color`](Color.md)[] | [Colormap.ts:29](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Colormap.ts#L29) |
| <a id="levels"></a> `levels` | `readonly` | `number`[] | [Colormap.ts:28](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Colormap.ts#L28) |
| <a id="overflow_color"></a> `overflow_color` | `readonly` | `null` \| [`Color`](Color.md) | [Colormap.ts:30](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Colormap.ts#L30) |
| <a id="underflow_color"></a> `underflow_color` | `readonly` | `null` \| [`Color`](Color.md) | [Colormap.ts:31](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Colormap.ts#L31) |

## Methods

### getColors()

> **getColors**(): `string`[]

Defined in: [Colormap.ts:55](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Colormap.ts#L55)

#### Returns

`string`[]

an array of hex color strings

***

### getOpacities()

> **getOpacities**(): `number`[]

Defined in: [Colormap.ts:62](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Colormap.ts#L62)

#### Returns

`number`[]

an array of opacities, one for each color in the color map

***

### withOpacity()

> **withOpacity**(`func`): `ColorMap`

Defined in: [Colormap.ts:71](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Colormap.ts#L71)

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

Defined in: [Colormap.ts:117](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Colormap.ts#L117)

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
