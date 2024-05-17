[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / RawProfileField

# Class: RawProfileField

A class grid of wind profiles

## Constructors

### new RawProfileField()

> **new RawProfileField**(`grid`, `profiles`): [`RawProfileField`](RawProfileField.md)

Create a grid of wind profiles

#### Parameters

• **grid**: [`Grid`](Grid.md)

The grid on which the profiles are defined

• **profiles**: [`WindProfile`](../interfaces/WindProfile.md)[]

The wind profiles themselves, which should be given as a 1D array in row-major order, with the first profile being at the lower-left corner of the grid

#### Returns

[`RawProfileField`](RawProfileField.md)

#### Source

[RawField.ts:164](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/RawField.ts#L164)

## Properties

### grid

> `readonly` **grid**: [`Grid`](Grid.md)

#### Source

[RawField.ts:157](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/RawField.ts#L157)

***

### profiles

> `readonly` **profiles**: [`WindProfile`](../interfaces/WindProfile.md)[]

#### Source

[RawField.ts:156](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/RawField.ts#L156)

## Methods

### getStormMotionGrid()

> **getStormMotionGrid**(): [`RawVectorField`](RawVectorField.md)\<`Float16Array`\>

Get the gridded storm motion vector field (internal method)

#### Returns

[`RawVectorField`](RawVectorField.md)\<`Float16Array`\>

#### Source

[RawField.ts:170](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/RawField.ts#L170)
