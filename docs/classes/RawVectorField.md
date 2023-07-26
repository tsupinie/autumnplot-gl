[autumnplot-gl](../README.md) / [Exports](../modules.md) / RawVectorField

# Class: RawVectorField

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

• **new RawVectorField**(`grid`, `u`, `v`, `relative_to?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `grid` | [`Grid`](Grid.md) |
| `u` | `Float32Array` |
| `v` | `Float32Array` |
| `relative_to?` | [`VectorRelativeTo`](../modules.md#vectorrelativeto) |

#### Defined in

[RawField.ts:346](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/RawField.ts#L346)

## Properties

### \_rotate\_cache

• `Readonly` **\_rotate\_cache**: `Cache`<[], { `u`: [`RawScalarField`](RawScalarField.md) ; `v`: [`RawScalarField`](RawScalarField.md)  }\>

#### Defined in

[RawField.ts:344](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/RawField.ts#L344)

___

### relative\_to

• `Readonly` **relative\_to**: [`VectorRelativeTo`](../modules.md#vectorrelativeto)

#### Defined in

[RawField.ts:342](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/RawField.ts#L342)

___

### u

• `Readonly` **u**: [`RawScalarField`](RawScalarField.md)

#### Defined in

[RawField.ts:340](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/RawField.ts#L340)

___

### v

• `Readonly` **v**: [`RawScalarField`](RawScalarField.md)

#### Defined in

[RawField.ts:341](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/RawField.ts#L341)

## Accessors

### grid

• `get` **grid**(): [`Grid`](Grid.md)

#### Returns

[`Grid`](Grid.md)

#### Defined in

[RawField.ts:401](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/RawField.ts#L401)

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

[RawField.ts:394](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/RawField.ts#L394)

___

### toEarthRelative

▸ **toEarthRelative**(): [`RawVectorField`](RawVectorField.md)

#### Returns

[`RawVectorField`](RawVectorField.md)

#### Defined in

[RawField.ts:405](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/RawField.ts#L405)
