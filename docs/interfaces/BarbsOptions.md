[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / BarbsOptions

# Interface: BarbsOptions

## Properties

### color?

> `optional` **color**: `string`

The color to use for the barbs as a hex color string;.

#### Default

```ts
'#000000'
```

#### Source

[Barbs.ts:132](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Barbs.ts#L132)

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

[Barbs.ts:139](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Barbs.ts#L139)
