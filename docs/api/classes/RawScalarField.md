---
title: RawScalarField
---

# Class: RawScalarField\<ArrayType, GridType\>

Defined in: [RawField.ts:23](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/RawField.ts#L23)

A class representing a raw 2D field of gridded data, such as height or u wind.

## Type Parameters

| Type Parameter |
| ------ |
| `ArrayType` *extends* [`TypedArray`](../type-aliases/TypedArray.md) |
| `GridType` *extends* [`Grid`](Grid.md) |

## Constructors

### Constructor

> **new RawScalarField**\<`ArrayType`, `GridType`\>(`grid`, `data`): `RawScalarField`\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:34](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/RawField.ts#L34)

Create a data field.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `grid` | `GridType` | The grid on which the data are defined |
| `data` | `ArrayType` | The data, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid. |

#### Returns

`RawScalarField`\<`ArrayType`, `GridType`\>

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="data"></a> `data` | `readonly` | `ArrayType` | [RawField.ts:25](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/RawField.ts#L25) |
| <a id="grid"></a> `grid` | `readonly` | `GridType` | [RawField.ts:24](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/RawField.ts#L24) |

## Methods

### getContours()

> **getContours**(`opts`): `Promise`\<[`ContourData`](../type-aliases/ContourData.md)\>

Defined in: [RawField.ts:71](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/RawField.ts#L71)

Get contour data as an object with each contour level being a separate property.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | [`FieldContourOpts`](../interfaces/FieldContourOpts.md) | Options for doing the contouring |

#### Returns

`Promise`\<[`ContourData`](../type-aliases/ContourData.md)\>

contour data as an object

***

### getWGLTextureSpec()

> **getWGLTextureSpec**(`gl`, `image_mag_filter`): `WGLTextureSpec`

Defined in: [RawField.ts:56](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/RawField.ts#L56)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `gl` | [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md) |
| `image_mag_filter` | `number` |

#### Returns

`WGLTextureSpec`

***

### sampleField()

> **sampleField**(`lon`, `lat`): `number`

Defined in: [RawField.ts:98](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/RawField.ts#L98)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `lon` | `number` |
| `lat` | `number` |

#### Returns

`number`

***

### aggregateFields()

> `static` **aggregateFields**\<`ArrayType`, `GridType`\>(`func`, ...`args`): `RawScalarField`\<`ArrayType`, `GridType`\>

Defined in: [RawField.ts:84](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/RawField.ts#L84)

Create a new field by aggregating a number of fields using a specific function

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
