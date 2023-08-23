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

[RawField.ts:466](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L466)

## Properties

### grid

• `Readonly` **grid**: [`Grid`](Grid.md)

#### Defined in

[RawField.ts:459](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L459)

___

### profiles

• `Readonly` **profiles**: [`WindProfile`](../interfaces/WindProfile.md)[]

#### Defined in

[RawField.ts:458](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L458)

## Methods

### getStormMotionGrid

▸ **getStormMotionGrid**(): [`RawVectorField`](RawVectorField.md)

Get the gridded storm motion vector field (internal method)

#### Returns

[`RawVectorField`](RawVectorField.md)

#### Defined in

[RawField.ts:472](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L472)
