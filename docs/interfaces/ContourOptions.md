[autumnplot-gl](../README.md) / [Exports](../modules.md) / ContourOptions

# Interface: ContourOptions

## Table of contents

### Properties

- [color](ContourOptions.md#color)
- [interval](ContourOptions.md#interval)
- [levels](ContourOptions.md#levels)
- [thinner](ContourOptions.md#thinner)

## Properties

### color

• `Optional` **color**: `string`

The color of the contours as a hex color string

**`Default`**

'#000000'

#### Defined in

[Contour.ts:16](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Contour.ts#L16)

___

### interval

• `Optional` **interval**: `number`

The contour interval for drawing contours at regular intervals

**`Default`**

1

#### Defined in

[Contour.ts:22](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Contour.ts#L22)

___

### levels

• `Optional` **levels**: `number`[]

A list of arbitrary levels (up to 40) to contour. This overrides the `interval` option.

**`Default`**

Draw contours at regular intervals given by the `interval` option.

#### Defined in

[Contour.ts:28](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Contour.ts#L28)

___

### thinner

• `Optional` **thinner**: (`zoom`: `number`) => `number`

#### Type declaration

▸ (`zoom`): `number`

A function to thin the contours based on zoom level. The function should take a zoom level and return a number `n` that means to only show every 
`n`th contour.

**`Default`**

Don't thin the contours on any zoom level

##### Parameters

| Name | Type |
| :------ | :------ |
| `zoom` | `number` |

##### Returns

`number`

#### Defined in

[Contour.ts:35](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Contour.ts#L35)
