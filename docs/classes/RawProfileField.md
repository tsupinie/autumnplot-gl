[autumnplot-gl](../README.md) / [Exports](../modules.md) / RawProfileField

# Class: RawProfileField

A class grid of wind profiles

## Table of contents

### Constructors

- [constructor](RawProfileField.md#constructor)

### Properties

- [grid](RawProfileField.md#grid)
- [profiles](RawProfileField.md#profiles)

### Methods

- [getStormMotionGrid](RawProfileField.md#getstormmotiongrid)

## Constructors

### constructor

• **new RawProfileField**(`grid`, `profiles`)

Create a grid of wind profiles

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `grid` | [`Grid`](Grid.md) | The grid on which the profiles are defined |
| `profiles` | [`WindProfile`](../interfaces/WindProfile.md)[] | The wind profiles themselves, which should be given as a 1D array in row-major order, with the first profile being at the lower-left corner of the grid |

#### Defined in

[RawField.ts:573](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L573)

## Properties

### grid

• `Readonly` **grid**: [`Grid`](Grid.md)

#### Defined in

[RawField.ts:566](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L566)

___

### profiles

• `Readonly` **profiles**: [`WindProfile`](../interfaces/WindProfile.md)[]

#### Defined in

[RawField.ts:565](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L565)

## Methods

### getStormMotionGrid

▸ **getStormMotionGrid**(): [`RawVectorField`](RawVectorField.md)<`Float16Array`\>

Get the gridded storm motion vector field (internal method)

#### Returns

[`RawVectorField`](RawVectorField.md)<`Float16Array`\>

#### Defined in

[RawField.ts:579](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L579)
