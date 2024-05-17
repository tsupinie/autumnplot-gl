[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / ColorBarOptions

# Interface: ColorBarOptions

## Properties

### fontface?

> `optional` **fontface**: `string`

A font face to use for the label and tick values.

#### Default

```ts
'sans-serif'
```

#### Source

[ColorBar.ts:33](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/ColorBar.ts#L33)

***

### label?

> `optional` **label**: `string`

The label to place along the color bar

#### Source

[ColorBar.ts:8](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/ColorBar.ts#L8)

***

### orientation?

> `optional` **orientation**: [`ColorbarOrientation`](../type-aliases/ColorbarOrientation.md)

The orientation for the color bar. Valid values are 'horizontal' and 'vertical'.

#### Default

```ts
'vertical'
```

#### Source

[ColorBar.ts:27](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/ColorBar.ts#L27)

***

### tick\_direction?

> `optional` **tick\_direction**: [`ColorbarTickDirection`](../type-aliases/ColorbarTickDirection.md)

The direction the ticks should face. Valid values are 'left' and 'right' if orientation is 'vertical' and 'top' and 
'bottom' if orientation is 'horizontal'.

#### Default

```ts
'left' if orientation is 'vertical' and 'bottom' if orientation is 'horizontal'
```

#### Source

[ColorBar.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/ColorBar.ts#L21)

***

### ticklabelsize?

> `optional` **ticklabelsize**: `number`

The font size (in points) to use for the tick labels

#### Default

```ts
12
```

#### Source

[ColorBar.ts:39](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/ColorBar.ts#L39)

***

### ticks?

> `optional` **ticks**: `number`[]

An array of numbers to use as the tick locations.

#### Default

```ts
Use all the levels in the color map provided to {@link makeColorBar}.
```

#### Source

[ColorBar.ts:14](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/ColorBar.ts#L14)
