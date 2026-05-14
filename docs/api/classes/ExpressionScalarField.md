---
title: ExpressionScalarField
---

# Abstract Class: ExpressionScalarField\<ArrayType, GridType\>

Defined in: [RawField.ts:39](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L39)

## Extended by

- [`RawScalarField`](RawScalarField.md)
- [`ComputedScalarField`](ComputedScalarField.md)

## Type Parameters

| Type Parameter |
| ------ |
| `ArrayType` *extends* [`TypedArray`](../type-aliases/TypedArray.md) |
| `GridType` *extends* [`Grid`](Grid.md) |

## Constructors

### Constructor

> **new ExpressionScalarField**\<`ArrayType`, `GridType`\>(): `ExpressionScalarField`\<`ArrayType`, `GridType`\>

#### Returns

`ExpressionScalarField`\<`ArrayType`, `GridType`\>

## Accessors

### aryConstructor

#### Get Signature

> **get** `abstract` **aryConstructor**(): (...`args`) => `ArrayType`

Defined in: [RawField.ts:47](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L47)

##### Returns

> **new aryConstructor**(...`args`): `ArrayType`

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

`ArrayType`

***

### dtypes

#### Get Signature

> **get** `abstract` **dtypes**(): `TypedArrayStr`[]

Defined in: [RawField.ts:48](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L48)

##### Returns

`TypedArrayStr`[]

***

### grid

#### Get Signature

> **get** `abstract` **grid**(): `GridType`

Defined in: [RawField.ts:46](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L46)

##### Returns

`GridType`

## Methods

### add()

> **add**(`other`): [`ComputedScalarField`](ComputedScalarField.md)\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:91](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L91)

Add this field to another scalar. The computation occurs on the GPU if the resulting field is used in a plot component or on the CPU if 
 [renderCPU()](ComputedScalarField.md#rendercpu) is called on the resulting field.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `number` \| `ExpressionScalarField`\<`ArrayType`, `GridType`\> | Scalar to add to this field |

#### Returns

[`ComputedScalarField`](ComputedScalarField.md)\<`ArrayType`, `GridType`\>

A `ComputedScalarField` representing the added field

***

### divide()

> **divide**(`other`): [`ComputedScalarField`](ComputedScalarField.md)\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:81](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L81)

Divide this field by another scalar. The computation occurs on the GPU if the resulting field is used in a plot component or on the CPU if
[renderCPU()](ComputedScalarField.md#rendercpu) is called on the resulting field.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `number` \| `ExpressionScalarField`\<`ArrayType`, `GridType`\> | Scalar to divide this field by |

#### Returns

[`ComputedScalarField`](ComputedScalarField.md)\<`ArrayType`, `GridType`\>

A `ComputedScalarField` representing the divided field

***

### getExpression()

> `abstract` **getExpression**(): `string`

Defined in: [RawField.ts:42](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L42)

#### Returns

`string`

***

### getSamplerIds()

> `abstract` **getSamplerIds**(): `string`[]

Defined in: [RawField.ts:41](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L41)

#### Returns

`string`[]

***

### getThinnedField()

> `abstract` **getThinnedField**(`thin_fac`, `map_max_zoom`): `this`

Defined in: [RawField.ts:105](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L105)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `thin_fac` | `number` |
| `map_max_zoom` | `number` |

#### Returns

`this`

***

### iterateCPU()

> `abstract` **iterateCPU**(): `Generator`\<`number`, `void`, `unknown`\>

Defined in: [RawField.ts:44](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L44)

#### Returns

`Generator`\<`number`, `void`, `unknown`\>

***

### multiply()

> **multiply**(`other`): [`ComputedScalarField`](ComputedScalarField.md)\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:71](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L71)

Multiply this field by another scalar. The computation occurs on the GPU if the resulting field is used in a plot component or on the CPU if 
 [renderCPU()](ComputedScalarField.md#rendercpu) is called on the resulting field.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `number` \| `ExpressionScalarField`\<`ArrayType`, `GridType`\> | Scalar to multiply this field by |

#### Returns

[`ComputedScalarField`](ComputedScalarField.md)\<`ArrayType`, `GridType`\>

A `ComputedScalarField` representing the multiplied field

***

### renderCPU()

> `abstract` **renderCPU**(): [`RawScalarField`](RawScalarField.md)\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:43](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L43)

#### Returns

[`RawScalarField`](RawScalarField.md)\<`ArrayType`, `GridType`\>

***

### sampleField()

> `abstract` **sampleField**(`lon`, `lat`): `number`

Defined in: [RawField.ts:107](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L107)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `lon` | `number` |
| `lat` | `number` |

#### Returns

`number`

***

### sampleFieldWithCoord()

> `abstract` **sampleFieldWithCoord**(`lon`, `lat`): `object`

Defined in: [RawField.ts:108](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L108)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `lon` | `number` |
| `lat` | `number` |

#### Returns

`object`

##### sample

> **sample**: `number`

##### sample\_lat

> **sample\_lat**: `number`

##### sample\_lon

> **sample\_lon**: `number`

***

### subtract()

> **subtract**(`other`): [`ComputedScalarField`](ComputedScalarField.md)\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:101](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L101)

Subtract another scalar from this field. The computation occurs on the GPU if the resulting field is used in a plot component or on the CPU if
 [renderCPU()](ComputedScalarField.md#rendercpu) is called on the resulting field.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `number` \| `ExpressionScalarField`\<`ArrayType`, `GridType`\> | Scalar to subtract from this field |

#### Returns

[`ComputedScalarField`](ComputedScalarField.md)\<`ArrayType`, `GridType`\>

A `ComputedScalarField` representing the subtracted field

***

### updateTexImageData()

> `abstract` **updateTexImageData**(`gl`, `image_mag_filter`, `fill_textures`): `Map`\<`string`, `WGLTexture`\>

Defined in: [RawField.ts:40](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L40)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `gl` | [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md) |
| `image_mag_filter` | `number` |
| `fill_textures` | `null` \| `Map`\<`string`, `WGLTexture`\> |

#### Returns

`Map`\<`string`, `WGLTexture`\>
