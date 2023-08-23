[autumnplot-gl](../README.md) / [Exports](../modules.md) / HodographOptions

# Interface: HodographOptions

## Table of contents

### Properties

- [bgcolor](HodographOptions.md#bgcolor)
- [thin\_fac](HodographOptions.md#thin_fac)

## Properties

### bgcolor

• `Optional` **bgcolor**: `string`

The color of the hodograph plot background as a hex string

#### Defined in

[Hodographs.ts:91](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/Hodographs.ts#L91)

___

### thin\_fac

• `Optional` **thin\_fac**: `number`

How much to thin the hodographs at zoom level 1 on the map. This effectively means to plot every `n`th hodograph in the i and j directions, where `n` = 
`thin_fac`. `thin_fac` should be a power of 2.

**`Default`**

1

#### Defined in

[Hodographs.ts:98](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/Hodographs.ts#L98)
