[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / ContourOptions

# Interface: ContourOptions

## Properties

### color?

> `optional` **color**: `string`

The color of the contours as a hex color string

#### Default

```ts
'#000000'
```

#### Source

[Contour.ts:18](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Contour.ts#L18)

***

### interval?

> `optional` **interval**: `number`

The contour interval for drawing contours at regular intervals

#### Default

```ts
1
```

#### Source

[Contour.ts:24](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Contour.ts#L24)

***

### levels?

> `optional` **levels**: `number`[]

A list of arbitrary levels (up to 40) to contour. This overrides the `interval` option.

#### Default

Draw contours at regular intervals given by the `interval` option.

#### Source

[Contour.ts:30](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Contour.ts#L30)
