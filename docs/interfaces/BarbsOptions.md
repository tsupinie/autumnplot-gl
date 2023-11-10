[autumnplot-gl](../README.md) / [Exports](../modules.md) / BarbsOptions

# Interface: BarbsOptions

## Table of contents

### Properties

- [color](BarbsOptions.md#color)
- [thin\_fac](BarbsOptions.md#thin_fac)

## Properties

### color

• `Optional` **color**: `string`

The color to use for the barbs as a hex color string;.

**`Default`**

'#000000'

#### Defined in

[Barbs.ts:132](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Barbs.ts#L132)

___

### thin\_fac

• `Optional` **thin\_fac**: `number`

How much to thin the barbs at zoom level 1 on the map. This effectively means to plot every `n`th barb in the i and j directions, where `n` = 
`thin_fac`. `thin_fac` should be a power of 2.

**`Default`**

1

#### Defined in

[Barbs.ts:139](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Barbs.ts#L139)