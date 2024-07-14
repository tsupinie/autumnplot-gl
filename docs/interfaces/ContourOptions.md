[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / ContourOptions

# Interface: ContourOptions

## Properties

### cmap?

> `optional` **cmap**: `null` \| [`ColorMap`](../classes/ColorMap.md)

A color map to use to color the contours. Specifying a colormap overrides the color option.

#### Default

```ts
null
```

#### Source

[Contour.ts:25](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Contour.ts#L25)

***

### color?

> `optional` **color**: `string`

The color of the contours as a hex color string

#### Default

```ts
'#000000'
```

#### Source

[Contour.ts:19](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Contour.ts#L19)

***

### interval?

> `optional` **interval**: `number`

The contour interval for drawing contours at regular intervals

#### Default

```ts
1
```

#### Source

[Contour.ts:31](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Contour.ts#L31)

***

### levels?

> `optional` **levels**: `null` \| `number`[]

A list of arbitrary levels to contour. This overrides the `interval` option.

#### Default

```ts
null
```

#### Source

[Contour.ts:37](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Contour.ts#L37)

***

### line\_style?

> `optional` **line\_style**: [`LineStyle`](../type-aliases/LineStyle.md) \| (`level`) => [`LineStyle`](../type-aliases/LineStyle.md)

The style to use for the line. This can be either a LineStyle or a function that takes a contour level as a number and returns a LineStyle. This 
 can be used to vary the contours by value.

#### Example

```ts
level => level < 0 ? '--' : '-'
```

#### Default

```ts
'-'
```

#### Source

[Contour.ts:53](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Contour.ts#L53)

***

### line\_width?

> `optional` **line\_width**: `number` \| (`level`) => `number`

The width of the line in pixels. This could be either a number or a function that takes a contour level as a number and returns a line width. This
 can be used to vary the width of the contours by value.

#### Example

```ts
level => level >= 100 ? 3 : 1.5
```

#### Default

```ts
2
```

#### Source

[Contour.ts:45](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Contour.ts#L45)
