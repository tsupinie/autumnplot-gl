---
title: RawVectorField
---

# Class: RawVectorField\<ArrayType, GridType\>

Defined in: [RawField.ts:116](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/RawField.ts#L116)

A class representing a 2D gridded field of vectors

## Type Parameters

| Type Parameter |
| ------ |
| `ArrayType` *extends* [`TypedArray`](../type-aliases/TypedArray.md) |
| `GridType` *extends* [`Grid`](Grid.md) |

## Constructors

### Constructor

> **new RawVectorField**\<`ArrayType`, `GridType`\>(`grid`, `u`, `v`, `opts?`): `RawVectorField`\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:128](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/RawField.ts#L128)

Create a vector field.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `grid` | `GridType` | The grid on which the vector components are defined |
| `u` | `ArrayType` | The u (east/west) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid |
| `v` | `ArrayType` | The v (north/south) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid |
| `opts?` | [`RawVectorFieldOptions`](../interfaces/RawVectorFieldOptions.md) | Options for creating the vector field. |

#### Returns

`RawVectorField`\<`ArrayType`, `GridType`\>

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="relative_to"></a> `relative_to` | `readonly` | [`VectorRelativeTo`](../type-aliases/VectorRelativeTo.md) | [RawField.ts:119](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/RawField.ts#L119) |
| <a id="u"></a> `u` | `readonly` | [`RawScalarField`](RawScalarField.md)\<`ArrayType`, `GridType`\> | [RawField.ts:117](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/RawField.ts#L117) |
| <a id="v"></a> `v` | `readonly` | [`RawScalarField`](RawScalarField.md)\<`ArrayType`, `GridType`\> | [RawField.ts:118](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/RawField.ts#L118) |

## Methods

### getWGLTextureSpecs()

> **getWGLTextureSpecs**(`gl`, `mag_filter`): `object`

Defined in: [RawField.ts:151](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/RawField.ts#L151)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `gl` | [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md) |
| `mag_filter` | `number` |

#### Returns

`object`

##### u

> **u**: `WGLTextureSpec`

##### v

> **v**: `WGLTextureSpec`

***

### sampleField()

> **sampleField**(`lon`, `lat`): \[`number`, `number`\]

Defined in: [RawField.ts:184](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/RawField.ts#L184)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `lon` | `number` |
| `lat` | `number` |

#### Returns

\[`number`, `number`\]
