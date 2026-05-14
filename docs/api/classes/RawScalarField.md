---
title: RawScalarField
---

# Class: RawScalarField\<ArrayType, GridType\>

Defined in: [RawField.ts:112](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L112)

A class representing a raw 2D field of gridded data, such as height or u wind.

## Extends

- [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\>

## Type Parameters

| Type Parameter |
| ------ |
| `ArrayType` *extends* [`TypedArray`](../type-aliases/TypedArray.md) |
| `GridType` *extends* [`Grid`](Grid.md) |

## Constructors

### Constructor

> **new RawScalarField**\<`ArrayType`, `GridType`\>(`grid`, `data`): `RawScalarField`\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:123](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L123)

Create a data field.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `grid` | `GridType` | The grid on which the data are defined |
| `data` | `ArrayType` | The data, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid. |

#### Returns

`RawScalarField`\<`ArrayType`, `GridType`\>

#### Overrides

[`ExpressionScalarField`](ExpressionScalarField.md).[`constructor`](ExpressionScalarField.md#constructor)

## Properties

| Property | Modifier | Type | Overrides | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="data"></a> `data` | `readonly` | `ArrayType` | - | [RawField.ts:114](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L114) |
| <a id="grid"></a> `grid` | `readonly` | `GridType` | [`ExpressionScalarField`](ExpressionScalarField.md).[`grid`](ExpressionScalarField.md#grid) | [RawField.ts:113](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L113) |

## Methods

### add()

> **add**(`other`): [`ComputedScalarField`](ComputedScalarField.md)\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:91](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L91)

Add this field to another scalar. The computation occurs on the GPU if the resulting field is used in a plot component or on the CPU if 
 [renderCPU()](ComputedScalarField.md#rendercpu) is called on the resulting field.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `number` \| [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\> | Scalar to add to this field |

#### Returns

[`ComputedScalarField`](ComputedScalarField.md)\<`ArrayType`, `GridType`\>

A `ComputedScalarField` representing the added field

#### Inherited from

[`ExpressionScalarField`](ExpressionScalarField.md).[`add`](ExpressionScalarField.md#add)

***

### divide()

> **divide**(`other`): [`ComputedScalarField`](ComputedScalarField.md)\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:81](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L81)

Divide this field by another scalar. The computation occurs on the GPU if the resulting field is used in a plot component or on the CPU if
[renderCPU()](ComputedScalarField.md#rendercpu) is called on the resulting field.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `number` \| [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\> | Scalar to divide this field by |

#### Returns

[`ComputedScalarField`](ComputedScalarField.md)\<`ArrayType`, `GridType`\>

A `ComputedScalarField` representing the divided field

#### Inherited from

[`ExpressionScalarField`](ExpressionScalarField.md).[`divide`](ExpressionScalarField.md#divide)

***

### getContours()

> **getContours**(`opts`): `Promise`\<[`ContourData`](../type-aliases/ContourData.md)\>

Defined in: [RawField.ts:230](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L230)

Get contour data as an object with each contour level being a separate property.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | [`FieldContourOpts`](../interfaces/FieldContourOpts.md) | Options for doing the contouring |

#### Returns

`Promise`\<[`ContourData`](../type-aliases/ContourData.md)\>

contour data as an object

***

### multiply()

> **multiply**(`other`): [`ComputedScalarField`](ComputedScalarField.md)\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:71](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L71)

Multiply this field by another scalar. The computation occurs on the GPU if the resulting field is used in a plot component or on the CPU if 
 [renderCPU()](ComputedScalarField.md#rendercpu) is called on the resulting field.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `number` \| [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\> | Scalar to multiply this field by |

#### Returns

[`ComputedScalarField`](ComputedScalarField.md)\<`ArrayType`, `GridType`\>

A `ComputedScalarField` representing the multiplied field

#### Inherited from

[`ExpressionScalarField`](ExpressionScalarField.md).[`multiply`](ExpressionScalarField.md#multiply)

***

### renderCPU()

> **renderCPU**(): `RawScalarField`\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:251](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L251)

Run computations on a scalar field on the CPU (for a `RawScalarField`, this is a no-op). The function blocks the main thread, so avoid calling it if possible.

#### Returns

`RawScalarField`\<`ArrayType`, `GridType`\>

The computed grid in a `RawScalarField`

#### Overrides

[`ExpressionScalarField`](ExpressionScalarField.md).[`renderCPU`](ExpressionScalarField.md#rendercpu)

***

### sampleField()

> **sampleField**(`lon`, `lat`): `number`

Defined in: [RawField.ts:286](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L286)

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

Defined in: [RawField.ts:276](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L276)

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

> **subtract**(`other`): [`ComputedScalarField`](ComputedScalarField.md)\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:101](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L101)

Subtract another scalar from this field. The computation occurs on the GPU if the resulting field is used in a plot component or on the CPU if
 [renderCPU()](ComputedScalarField.md#rendercpu) is called on the resulting field.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `number` \| [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\> | Scalar to subtract from this field |

#### Returns

[`ComputedScalarField`](ComputedScalarField.md)\<`ArrayType`, `GridType`\>

A `ComputedScalarField` representing the subtracted field

#### Inherited from

[`ExpressionScalarField`](ExpressionScalarField.md).[`subtract`](ExpressionScalarField.md#subtract)

***

### updateTexImageData()

> **updateTexImageData**(`gl`, `image_mag_filter`, `fill_textures`): `Map`\<`string`, `WGLTexture`\>

Defined in: [RawField.ts:185](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L185)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `gl` | [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md) |
| `image_mag_filter` | `number` |
| `fill_textures` | `null` \| `Map`\<`string`, `WGLTexture`\> |

#### Returns

`Map`\<`string`, `WGLTexture`\>

#### Overrides

[`ExpressionScalarField`](ExpressionScalarField.md).[`updateTexImageData`](ExpressionScalarField.md#updateteximagedata)

***

### aggregateFields()

> `static` **aggregateFields**\<`ArrayType`, `GridType`\>(`func`, ...`args`): `RawScalarField`\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:243](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L243)

Create a new field by aggregating a number of fields using a specific function. This computation occurs on the CPU.

#### Type Parameters

| Type Parameter |
| ------ |
| `ArrayType` *extends* [`TypedArray`](../type-aliases/TypedArray.md) |
| `GridType` *extends* [`Grid`](Grid.md) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `func` | (...`args`) => `number` | A function that will be applied each element of the field. It should take the same number of arguments as fields you have and return a single number. |
| ...`args` | `RawScalarField`\<`ArrayType`, `GridType`\>[] | The RawScalarFields to aggregate |

#### Returns

`RawScalarField`\<`ArrayType`, `GridType`\>

a new gridded field

#### Example

```ts
// Compute wind speed from u and v
wind_speed_field = RawScalarField.aggreateFields(Math.hypot, u_field, v_field);
```
