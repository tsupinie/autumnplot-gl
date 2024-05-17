[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / HodographOptions

# Interface: HodographOptions

## Properties

### bgcolor?

> `optional` **bgcolor**: `string`

The color of the hodograph plot background as a hex string

#### Source

[Hodographs.ts:65](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Hodographs.ts#L65)

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

[Hodographs.ts:72](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Hodographs.ts#L72)
