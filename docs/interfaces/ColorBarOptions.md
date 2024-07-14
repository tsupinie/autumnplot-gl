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

[ColorBar.ts:34](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/ColorBar.ts#L34)

***

### label?

> `optional` **label**: `string`

The label to place along the color bar

#### Source

[ColorBar.ts:9](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/ColorBar.ts#L9)

***

### orientation?

> `optional` **orientation**: [`ColorbarOrientation`](../type-aliases/ColorbarOrientation.md)

The orientation for the color bar. Valid values are 'horizontal' and 'vertical'.

#### Default

```ts
'vertical'
```

#### Source

[ColorBar.ts:28](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/ColorBar.ts#L28)

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

[ColorBar.ts:22](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/ColorBar.ts#L22)

***

### ticklabelsize?

> `optional` **ticklabelsize**: `number`

The font size (in points) to use for the tick labels

#### Default

```ts
12
```

#### Source

[ColorBar.ts:40](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/ColorBar.ts#L40)

***

### ticks?

> `optional` **ticks**: `number`[]

An array of numbers to use as the tick locations.

#### Default

```ts
Use all the levels in the color map provided to {@link makeColorBar}.
```

#### Source

[ColorBar.ts:15](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/ColorBar.ts#L15)
