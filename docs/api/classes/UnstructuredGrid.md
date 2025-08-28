---
title: UnstructuredGrid
---

# Class: UnstructuredGrid

Defined in: [Grid.ts:667](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L667)

An unstructured grid defined by a list of latitudes and longitudes

## Extends

- [`Grid`](Grid.md)

## Constructors

### Constructor

> **new UnstructuredGrid**(`coords`, `zoom?`): `UnstructuredGrid`

Defined in: [Grid.ts:676](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L676)

Create an unstructured grid

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `coords` | `object`[] | The lat/lon coordinates of the grid points |
| `zoom?` | `Uint8Array` | - |

#### Returns

`UnstructuredGrid`

#### Overrides

[`Grid`](Grid.md).[`constructor`](Grid.md#constructor)

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="coords"></a> `coords` | `readonly` | `object`[] | - | [Grid.ts:668](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L668) |
| <a id="is_conformal"></a> `is_conformal` | `readonly` | `boolean` | [`Grid`](Grid.md).[`is_conformal`](Grid.md#is_conformal) | [Grid.ts:104](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L104) |
| <a id="ni"></a> `ni` | `readonly` | `number` | [`Grid`](Grid.md).[`ni`](Grid.md#ni) | [Grid.ts:102](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L102) |
| <a id="nj"></a> `nj` | `readonly` | `number` | [`Grid`](Grid.md).[`nj`](Grid.md#nj) | [Grid.ts:103](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L103) |
| <a id="type"></a> `type` | `readonly` | [`GridType`](../type-aliases/GridType.md) | [`Grid`](Grid.md).[`type`](Grid.md#type) | [Grid.ts:101](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L101) |

## Methods

### getVectorRotationAtPoint()

> **getVectorRotationAtPoint**(`lon`, `lat`): `number`

Defined in: [Grid.ts:138](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L138)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `lon` | `number` |
| `lat` | `number` |

#### Returns

`number`

#### Inherited from

[`Grid`](Grid.md).[`getVectorRotationAtPoint`](Grid.md#getvectorrotationatpoint)

***

### getVectorRotationTexture()

> **getVectorRotationTexture**(`gl`, `data_are_earth_relative`): `object`

Defined in: [Grid.ts:144](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L144)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `gl` | [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md) |
| `data_are_earth_relative` | `boolean` |

#### Returns

`object`

##### rotation

> **rotation**: `WGLTexture`

#### Inherited from

[`Grid`](Grid.md).[`getVectorRotationTexture`](Grid.md#getvectorrotationtexture)

***

### getWGLBillboardBuffers()

> **getWGLBillboardBuffers**(`gl`, `thin_fac`, `max_zoom`): `Promise`\<\{ `texcoords`: `WGLBuffer`; `vertices`: `WGLBuffer`; \}\>

Defined in: [Grid.ts:132](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L132)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `gl` | [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md) |
| `thin_fac` | `number` |
| `max_zoom` | `number` |

#### Returns

`Promise`\<\{ `texcoords`: `WGLBuffer`; `vertices`: `WGLBuffer`; \}\>

#### Inherited from

[`Grid`](Grid.md).[`getWGLBillboardBuffers`](Grid.md#getwglbillboardbuffers)

***

### sampleNearestGridPoint()

> **sampleNearestGridPoint**(`lon`, `lat`, `ary`): `object`

Defined in: [Grid.ts:772](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L772)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `lon` | `number` |
| `lat` | `number` |
| `ary` | [`TypedArray`](../type-aliases/TypedArray.md) |

#### Returns

`object`

##### sample

> **sample**: `number`

##### sample\_lat

> **sample\_lat**: `number`

##### sample\_lon

> **sample\_lon**: `number`

#### Overrides

[`Grid`](Grid.md).[`sampleNearestGridPoint`](Grid.md#samplenearestgridpoint)
