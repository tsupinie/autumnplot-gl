---
title: colormaps
---

# Variable: colormaps

> `const` **colormaps**: `object`

Defined in: [index.ts:30](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/index.ts#L30)

All built-in colormaps

## Type declaration

### bluered()

> **bluered**: (`level_min`, `level_max`, `n_colors`) => [`ColorMap`](../classes/ColorMap.md)

Create a diverging blue/red colormap, where blue corresponds to the lowest value and red corresponds to the highest value

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `level_min` | `number` | The lowest value in the color map |
| `level_max` | `number` | The highest value in the color map |
| `n_colors` | `number` | The number of colors |

#### Returns

[`ColorMap`](../classes/ColorMap.md)

a Colormap object

### nws\_storm\_clear\_refl

> **nws\_storm\_clear\_refl**: [`ColorMap`](../classes/ColorMap.md)

### pw\_cape

> **pw\_cape**: [`ColorMap`](../classes/ColorMap.md)

### pw\_speed500mb

> **pw\_speed500mb**: [`ColorMap`](../classes/ColorMap.md)

### pw\_speed850mb

> **pw\_speed850mb**: [`ColorMap`](../classes/ColorMap.md)

### pw\_t2m

> **pw\_t2m**: [`ColorMap`](../classes/ColorMap.md)

### pw\_td2m

> **pw\_td2m**: [`ColorMap`](../classes/ColorMap.md)

### redblue()

> **redblue**: (`level_min`, `level_max`, `n_colors`) => [`ColorMap`](../classes/ColorMap.md)

Create a diverging red/blue colormap, where red corresponds to the lowest value and blue corresponds to the highest value

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `level_min` | `number` | The lowest value in the color map |
| `level_max` | `number` | The highest value in the color map |
| `n_colors` | `number` | The number of colors |

#### Returns

[`ColorMap`](../classes/ColorMap.md)

a Colormap object

### wv\_cimss

> **wv\_cimss**: [`ColorMap`](../classes/ColorMap.md)
