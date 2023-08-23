[autumnplot-gl](../README.md) / [Exports](../modules.md) / RawVectorField

# Class: RawVectorField

A class representing a 2D gridded field of vectors

## Table of contents

### Constructors

- [constructor](RawVectorField.md#constructor)

### Properties

- [\_rotate\_cache](RawVectorField.md#_rotate_cache)
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

• **new RawVectorField**(`grid`, `u`, `v`, `opts?`)

Create a vector field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `grid` | [`Grid`](Grid.md) | The grid on which the vector components are defined |
| `u` | `Float32Array` | The u (east/west) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid |
| `v` | `Float32Array` | The v (north/south) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid |
| `opts?` | [`RawVectorFieldOptions`](../interfaces/RawVectorFieldOptions.md) | Options for creating the vector field. |

#### Defined in

[RawField.ts:381](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L381)

## Properties

### \_rotate\_cache

• `Readonly` `Private` **\_rotate\_cache**: `Cache`<[], { `u`: [`RawScalarField`](RawScalarField.md) ; `v`: [`RawScalarField`](RawScalarField.md)  }\>

#### Defined in

[RawField.ts:372](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L372)

___

### relative\_to

• `Readonly` **relative\_to**: [`VectorRelativeTo`](../modules.md#vectorrelativeto)

#### Defined in

[RawField.ts:369](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L369)

___

### u

• `Readonly` **u**: [`RawScalarField`](RawScalarField.md)

#### Defined in

[RawField.ts:367](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L367)

___

### v

• `Readonly` **v**: [`RawScalarField`](RawScalarField.md)

#### Defined in

[RawField.ts:368](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L368)

## Accessors

### grid

• `get` **grid**(): [`Grid`](Grid.md)

#### Returns

[`Grid`](Grid.md)

#### Defined in

[RawField.ts:438](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L438)

## Methods

### getThinnedField

▸ **getThinnedField**(`thin_x`, `thin_y`): [`RawVectorField`](RawVectorField.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `thin_x` | `number` |
| `thin_y` | `number` |

#### Returns

[`RawVectorField`](RawVectorField.md)

#### Defined in

[RawField.ts:431](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L431)

___

### toEarthRelative

▸ **toEarthRelative**(): [`RawVectorField`](RawVectorField.md)

#### Returns

[`RawVectorField`](RawVectorField.md)

#### Defined in

[RawField.ts:442](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L442)
