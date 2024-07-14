[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / HodographOptions

# Interface: HodographOptions

## Properties

### bgcolor?

> `optional` **bgcolor**: `string`

The color of the hodograph plot background as a hex string

#### Default

```ts
'#000000'
```

#### Source

[Hodographs.ts:67](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Hodographs.ts#L67)

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

[Hodographs.ts:74](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Hodographs.ts#L74)
