---
title: ComputedScalarField
---

# Class: ComputedScalarField\<ArrayType, GridType\>

Defined in: [RawField.ts:293](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L293)

## Extends

- [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\>

## Type Parameters

| Type Parameter |
| ------ |
| `ArrayType` *extends* [`TypedArray`](../type-aliases/TypedArray.md) |
| `GridType` *extends* [`Grid`](Grid.md) |

## Constructors

### Constructor

> **new ComputedScalarField**\<`ArrayType`, `GridType`\>(`raw_fields`, `expression`, `cpu_func`): `ComputedScalarField`\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:298](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L298)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `raw_fields` | [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\>[] |
| `expression` | `string` |
| `cpu_func` | (...`arg`) => `number` |

#### Returns

`ComputedScalarField`\<`ArrayType`, `GridType`\>

#### Overrides

[`ExpressionScalarField`](ExpressionScalarField.md).[`constructor`](ExpressionScalarField.md#constructor)

## Methods

### add()

> **add**(`other`): `ComputedScalarField`\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:91](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L91)

Add this field to another scalar. The computation occurs on the GPU if the resulting field is used in a plot component or on the CPU if 
 [renderCPU()](#rendercpu) is called on the resulting field.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `number` \| [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\> | Scalar to add to this field |

#### Returns

`ComputedScalarField`\<`ArrayType`, `GridType`\>

A `ComputedScalarField` representing the added field

#### Inherited from

[`ExpressionScalarField`](ExpressionScalarField.md).[`add`](ExpressionScalarField.md#add)

***

### divide()

> **divide**(`other`): `ComputedScalarField`\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:81](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L81)

Divide this field by another scalar. The computation occurs on the GPU if the resulting field is used in a plot component or on the CPU if
[renderCPU()](#rendercpu) is called on the resulting field.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `number` \| [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\> | Scalar to divide this field by |

#### Returns

`ComputedScalarField`\<`ArrayType`, `GridType`\>

A `ComputedScalarField` representing the divided field

#### Inherited from

[`ExpressionScalarField`](ExpressionScalarField.md).[`divide`](ExpressionScalarField.md#divide)

***

### multiply()

> **multiply**(`other`): `ComputedScalarField`\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:71](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L71)

Multiply this field by another scalar. The computation occurs on the GPU if the resulting field is used in a plot component or on the CPU if 
 [renderCPU()](#rendercpu) is called on the resulting field.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `number` \| [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\> | Scalar to multiply this field by |

#### Returns

`ComputedScalarField`\<`ArrayType`, `GridType`\>

A `ComputedScalarField` representing the multiplied field

#### Inherited from

[`ExpressionScalarField`](ExpressionScalarField.md).[`multiply`](ExpressionScalarField.md#multiply)

***

### renderCPU()

> **renderCPU**(): [`RawScalarField`](RawScalarField.md)\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:398](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L398)

Run computations on a scalar field on the CPU. The function blocks the main thread, so avoid calling it if possible.

#### Returns

[`RawScalarField`](RawScalarField.md)\<`ArrayType`, `GridType`\>

The computed grid in a `RawScalarField`

#### Overrides

[`ExpressionScalarField`](ExpressionScalarField.md).[`renderCPU`](ExpressionScalarField.md#rendercpu)

***

### sampleField()

> **sampleField**(`lon`, `lat`): `number`

Defined in: [RawField.ts:390](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L390)

Sample this field at a given latitude and longitude.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `lon` | `number` | Longitude of the sample in degrees east |
| `lat` | `number` | Latitude of the sample in degrees north |

#### Returns

`number`

The value of the nearest grid point, or NaN if the point is outside the grid.

#### Overrides

[`ExpressionScalarField`](ExpressionScalarField.md).[`sampleField`](ExpressionScalarField.md#samplefield)

***

### sampleFieldWithCoord()

> **sampleFieldWithCoord**(`lon`, `lat`): `object`

Defined in: [RawField.ts:379](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L379)

Sample this field at a given latitude and longitude.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `lon` | `number` | Longitude of the sample in degrees east |
| `lat` | `number` | Latitude of the sample in degrees north |

#### Returns

`object`

The value of the nearest grid point along with the grid point latitude and longitude, or NaNs if the point is outside the grid.

##### sample

> **sample**: `number`

##### sample\_lat

> **sample\_lat**: `number`

##### sample\_lon

> **sample\_lon**: `number`

#### Overrides

[`ExpressionScalarField`](ExpressionScalarField.md).[`sampleFieldWithCoord`](ExpressionScalarField.md#samplefieldwithcoord)

***

### subtract()

> **subtract**(`other`): `ComputedScalarField`\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:101](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L101)

Subtract another scalar from this field. The computation occurs on the GPU if the resulting field is used in a plot component or on the CPU if
 [renderCPU()](#rendercpu) is called on the resulting field.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `number` \| [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\> | Scalar to subtract from this field |

#### Returns

`ComputedScalarField`\<`ArrayType`, `GridType`\>

A `ComputedScalarField` representing the subtracted field

#### Inherited from

[`ExpressionScalarField`](ExpressionScalarField.md).[`subtract`](ExpressionScalarField.md#subtract)
