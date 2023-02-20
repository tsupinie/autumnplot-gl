[autumnplot-gl](../README.md) / [Exports](../modules.md) / ContourOptions

# Interface: ContourOptions

## Table of contents

### Properties

- [color](ContourOptions.md#color)
- [interval](ContourOptions.md#interval)
- [thinner](ContourOptions.md#thinner)

## Properties

### color

• `Optional` **color**: `string`

The color of the contours as a hex color string

**`Default`**

'#000000'

#### Defined in

[Contour.ts:16](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L16)

___

### interval

• `Optional` **interval**: `number`

The contour interval

**`Default`**

1

#### Defined in

[Contour.ts:22](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L22)

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

[Contour.ts:29](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L29)
