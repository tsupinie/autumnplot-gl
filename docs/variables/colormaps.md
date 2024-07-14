[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / colormaps

# Variable: colormaps

> `const` **colormaps**: `object`

## Type declaration

### bluered()

> **bluered**: (`level_min`, `level_max`, `n_colors`) => [`ColorMap`](../classes/ColorMap.md)

Create a diverging blue/red colormap, where blue corresponds to the lowest value and red corresponds to the highest value

#### Parameters

• **level\_min**: `number`

The lowest value in the color map

• **level\_max**: `number`

The highest value in the color map

• **n\_colors**: `number`

The number of colors

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

• **level\_min**: `number`

The lowest value in the color map

• **level\_max**: `number`

The highest value in the color map

• **n\_colors**: `number`

The number of colors

#### Returns

[`ColorMap`](../classes/ColorMap.md)

a Colormap object

## Source

[index.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/index.ts#L21)
