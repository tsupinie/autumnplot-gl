[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / BarbsOptions

# Interface: BarbsOptions

## Properties

### barb\_size\_multiplier?

> `optional` **barb\_size\_multiplier**: `number`

A multiplier for the barb size

#### Default

```ts
1
```

#### Source

[Barbs.ts:151](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Barbs.ts#L151)

***

### cmap?

> `optional` **cmap**: `null` \| [`ColorMap`](../classes/ColorMap.md)

A color map to use to color the barbs by magnitude. Specifying cmap overrides the color argument.

#### Source

[Barbs.ts:139](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Barbs.ts#L139)

***

### color?

> `optional` **color**: `string`

The color to use for the barbs as a hex color string;.

#### Default

```ts
'#000000'
```

#### Source

[Barbs.ts:134](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Barbs.ts#L134)

***

### line\_width?

> `optional` **line\_width**: `number`

The width of the lines to use for the barbs

#### Default

```ts
2
```

#### Source

[Barbs.ts:145](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Barbs.ts#L145)

***

### thin\_fac?

> `optional` **thin\_fac**: `number`

How much to thin the barbs at zoom level 1 on the map. This effectively means to plot every `n`th barb in the i and j directions, where `n` = 
`thin_fac`. `thin_fac` should be a power of 2.

#### Default

```ts
1
```

#### Source

[Barbs.ts:158](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Barbs.ts#L158)
