[autumnplot-gl](../README.md) / [Exports](../modules.md) / RawVectorField

# Class: RawVectorField<ArrayType\>

A class representing a 2D gridded field of vectors

## Type parameters

| Name | Type |
| :------ | :------ |
| `ArrayType` | extends [`TypedArray`](../modules.md#typedarray) |

## Table of contents

### Constructors

- [constructor](RawVectorField.md#constructor)

### Properties

- [relative\_to](RawVectorField.md#relative_to)
- [u](RawVectorField.md#u)
- [v](RawVectorField.md#v)

### Accessors

- [grid](RawVectorField.md#grid)

### Methods

- [getThinnedField](RawVectorField.md#getthinnedfield)
- [toEarthRelative](RawVectorField.md#toearthrelative)

## Constructors

### constructor

• **new RawVectorField**<`ArrayType`\>(`grid`, `u`, `v`, `opts?`)

Create a vector field.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ArrayType` | extends [`TypedArray`](../modules.md#typedarray) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `grid` | [`Grid`](Grid.md) | The grid on which the vector components are defined |
| `u` | `ArrayType` | The u (east/west) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid |
| `v` | `ArrayType` | The v (north/south) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid |
| `opts?` | [`RawVectorFieldOptions`](../interfaces/RawVectorFieldOptions.md) | Options for creating the vector field. |

#### Defined in

[RawField.ts:486](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L486)

## Properties

### relative\_to

• `Readonly` **relative\_to**: [`VectorRelativeTo`](../modules.md#vectorrelativeto)

#### Defined in

[RawField.ts:475](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L475)

___

### u

• `Readonly` **u**: [`RawScalarField`](RawScalarField.md)<`ArrayType`\>

#### Defined in

[RawField.ts:473](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L473)

___

### v

• `Readonly` **v**: [`RawScalarField`](RawScalarField.md)<`ArrayType`\>

#### Defined in

[RawField.ts:474](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L474)

## Accessors

### grid

• `get` **grid**(): [`Grid`](Grid.md)

#### Returns

[`Grid`](Grid.md)

#### Defined in

[RawField.ts:545](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L545)

## Methods

### getThinnedField

▸ **getThinnedField**(`thin_x`, `thin_y`): [`RawVectorField`](RawVectorField.md)<`ArrayType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `thin_x` | `number` |
| `thin_y` | `number` |

#### Returns

[`RawVectorField`](RawVectorField.md)<`ArrayType`\>

#### Defined in

[RawField.ts:538](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L538)

___

### toEarthRelative

▸ **toEarthRelative**(): [`RawVectorField`](RawVectorField.md)<`ArrayType`\>

#### Returns

[`RawVectorField`](RawVectorField.md)<`ArrayType`\>

#### Defined in

[RawField.ts:549](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L549)
