---
title: RawVectorField
---

# Class: RawVectorField\<ArrayType, GridType\>

Defined in: [RawField.ts:605](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L605)

A class representing a 2D gridded field of vectors

## Extends

- [`ExpressionVectorField`](ExpressionVectorField.md)\<`ArrayType`, `GridType`\>

## Type Parameters

| Type Parameter |
| ------ |
| `ArrayType` *extends* [`TypedArray`](../type-aliases/TypedArray.md) |
| `GridType` *extends* [`AutoZoomGrid`](../type-aliases/AutoZoomGrid.md) |

## Constructors

### Constructor

> **new RawVectorField**\<`ArrayType`, `GridType`\>(`grid`, `u_ary`, `v_ary`, `opts?`): `RawVectorField`\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:616](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L616)

Create a vector field.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `grid` | `GridType` | The grid on which the vector components are defined |
| `u_ary` | `ArrayType` | The u (east/west) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid |
| `v_ary` | `ArrayType` | The v (north/south) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid |
| `opts?` | [`RawVectorFieldOptions`](../interfaces/RawVectorFieldOptions.md) | Options for creating the vector field. |

#### Returns

`RawVectorField`\<`ArrayType`, `GridType`\>

#### Overrides

[`ExpressionVectorField`](ExpressionVectorField.md).[`constructor`](ExpressionVectorField.md#constructor)

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="relative_to"></a> `relative_to` | `readonly` | [`VectorRelativeTo`](../type-aliases/VectorRelativeTo.md) | [`ExpressionVectorField`](ExpressionVectorField.md).[`relative_to`](ExpressionVectorField.md#relative_to) | [RawField.ts:442](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L442) |
| <a id="u"></a> `u` | `readonly` | [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\> | [`ExpressionVectorField`](ExpressionVectorField.md).[`u`](ExpressionVectorField.md#u) | [RawField.ts:440](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L440) |
| <a id="v"></a> `v` | `readonly` | [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\> | [`ExpressionVectorField`](ExpressionVectorField.md).[`v`](ExpressionVectorField.md#v) | [RawField.ts:441](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L441) |

## Methods

### add()

> **add**(`other`): [`ComputedVectorField`](ComputedVectorField.md)\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:503](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L503)

Add this vector field to another vector field. The addition occurs on the GPU if the resulting field is used in a plot component.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | [`ExpressionVectorField`](ExpressionVectorField.md)\<`ArrayType`, `GridType`\> | Vector field to add. |

#### Returns

[`ComputedVectorField`](ComputedVectorField.md)\<`ArrayType`, `GridType`\>

A `ComputedVectorField` representing the added vector field

#### Inherited from

[`ExpressionVectorField`](ExpressionVectorField.md).[`add`](ExpressionVectorField.md#add)

***

### divide()

> **divide**(`other`): [`ComputedVectorField`](ComputedVectorField.md)\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:494](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L494)

Divide this vector field by a scalar. The division occurs on the GPU if the resulting field is used in a plot component.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `number` \| [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\> | Scalar to divide by. Can be either a number or a scalar field. |

#### Returns

[`ComputedVectorField`](ComputedVectorField.md)\<`ArrayType`, `GridType`\>

A `ComputedVectorField` representing the divided vector field

#### Inherited from

[`ExpressionVectorField`](ExpressionVectorField.md).[`divide`](ExpressionVectorField.md#divide)

***

### magnitude()

> **magnitude**(): [`ComputedScalarField`](ComputedScalarField.md)\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:540](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L540)

Get the magnitude of the vector field as a scalar field. The magnitude calculation occurs on the GPU if this field is used in a plot component.

#### Returns

[`ComputedScalarField`](ComputedScalarField.md)\<`ArrayType`, `GridType`\>

A `ComputedScalarField` representing the subtracted vector field

#### Inherited from

[`ExpressionVectorField`](ExpressionVectorField.md).[`magnitude`](ExpressionVectorField.md#magnitude)

***

### multiply()

> **multiply**(`other`): [`ComputedVectorField`](ComputedVectorField.md)\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:485](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L485)

Multiply this vector field by a scalar. The multiplication occurs on the GPU if the resulting field is used in a plot component.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `number` \| [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\> | Scalar to multiply by. Can be either a number or a scalar field. |

#### Returns

[`ComputedVectorField`](ComputedVectorField.md)\<`ArrayType`, `GridType`\>

A `ComputedVectorField` representing the multiplied vector field

#### Inherited from

[`ExpressionVectorField`](ExpressionVectorField.md).[`multiply`](ExpressionVectorField.md#multiply)

***

### sampleField()

> **sampleField**(`lon`, `lat`): \[`number`, `number`\]

Defined in: [RawField.ts:564](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L564)

Sample this field at a given latitude and longitude.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `lon` | `number` | Longitude of the sample in degrees east |
| `lat` | `number` | Latitude of the sample in degrees north |

#### Returns

\[`number`, `number`\]

A tuple containing the [`bearing`, `magnitude`] of the vector field at the nearest grid point. The bearing is given as degrees from north, increasing clockwise. 
 If the point is outside the grid, it returns [NaN, NaN] instead.

#### Inherited from

[`ExpressionVectorField`](ExpressionVectorField.md).[`sampleField`](ExpressionVectorField.md#samplefield)

***

### subtract()

> **subtract**(`other`): [`ComputedVectorField`](ComputedVectorField.md)\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:512](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L512)

Subtract another vector field from this vector field. The subtraction occurs on the GPU if the resulting field is used in a plot component.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | [`ExpressionVectorField`](ExpressionVectorField.md)\<`ArrayType`, `GridType`\> | Vector field to subtract. |

#### Returns

[`ComputedVectorField`](ComputedVectorField.md)\<`ArrayType`, `GridType`\>

A `ComputedVectorField` representing the subtracted vector field

#### Inherited from

[`ExpressionVectorField`](ExpressionVectorField.md).[`subtract`](ExpressionVectorField.md#subtract)
