[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / HodographOptions

# Interface: HodographOptions

## Properties

### background\_line\_width

> **background\_line\_width**: `number`

The width of the lines on the background in pixels

#### Default

```ts
1.5
```

#### Source

[Hodographs.ts:84](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Hodographs.ts#L84)

***

### bgcolor?

> `optional` **bgcolor**: `string`

The color of the hodograph plot background as a hex string

#### Default

```ts
'#000000'
```

#### Source

[Hodographs.ts:65](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Hodographs.ts#L65)

***

### height\_cmap

> **height\_cmap**: [`ColorMap`](../classes/ColorMap.md)

The colormap to use for the heights on the hodograph. Default is a yellow-blue colormap.

#### Source

[Hodographs.ts:89](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Hodographs.ts#L89)

***

### hodo\_line\_width

> **hodo\_line\_width**: `number`

The width of the hodograph line in pixels

#### Default

```ts
2.5
```

#### Source

[Hodographs.ts:78](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Hodographs.ts#L78)

***

### thin\_fac?

> `optional` **thin\_fac**: `number`

How much to thin the hodographs at zoom level 1 on the map. This effectively means to plot every `n`th hodograph in the i and j directions, where `n` = 
`thin_fac`. `thin_fac` should be a power of 2.

#### Default

```ts
1
```

#### Source

[Hodographs.ts:72](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Hodographs.ts#L72)
