---
title: PlateCarreeGrid
---

# Class: PlateCarreeGrid

Defined in: [Grid.ts:242](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L242)

A plate carree (a.k.a. lat/lon) grid with uniform grid spacing

## Extends

- [`StructuredGrid`](StructuredGrid.md)

## Constructors

### Constructor

> **new PlateCarreeGrid**(`ni`, `nj`, `ll_lon`, `ll_lat`, `ur_lon`, `ur_lat`, `thin_x?`, `thin_y?`): `PlateCarreeGrid`

Defined in: [Grid.ts:260](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L260)

Create a plate carree grid

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ni` | `number` | The number of grid points in the i (longitude) direction |
| `nj` | `number` | The number of grid points in the j (latitude) direction |
| `ll_lon` | `number` | The longitude of the lower left corner of the grid |
| `ll_lat` | `number` | The latitude of the lower left corner of the grid |
| `ur_lon` | `number` | The longitude of the upper right corner of the grid |
| `ur_lat` | `number` | The latitude of the upper right corner of the grid |
| `thin_x?` | `number` | - |
| `thin_y?` | `number` | - |

#### Returns

`PlateCarreeGrid`

#### Overrides

[`StructuredGrid`](StructuredGrid.md).[`constructor`](StructuredGrid.md#constructor)

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="is_conformal"></a> `is_conformal` | `readonly` | `boolean` | [`StructuredGrid`](StructuredGrid.md).[`is_conformal`](StructuredGrid.md#is_conformal) | [Grid.ts:104](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L104) |
| <a id="ll_lat"></a> `ll_lat` | `readonly` | `number` | - | [Grid.ts:244](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L244) |
| <a id="ll_lon"></a> `ll_lon` | `readonly` | `number` | - | [Grid.ts:243](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L243) |
| <a id="ni"></a> `ni` | `readonly` | `number` | [`StructuredGrid`](StructuredGrid.md).[`ni`](StructuredGrid.md#ni) | [Grid.ts:102](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L102) |
| <a id="nj"></a> `nj` | `readonly` | `number` | [`StructuredGrid`](StructuredGrid.md).[`nj`](StructuredGrid.md#nj) | [Grid.ts:103](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L103) |
| <a id="thin_x"></a> `thin_x` | `readonly` | `number` | [`StructuredGrid`](StructuredGrid.md).[`thin_x`](StructuredGrid.md#thin_x) | [Grid.ts:152](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L152) |
| <a id="thin_y"></a> `thin_y` | `readonly` | `number` | [`StructuredGrid`](StructuredGrid.md).[`thin_y`](StructuredGrid.md#thin_y) | [Grid.ts:153](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L153) |
| <a id="type"></a> `type` | `readonly` | [`GridType`](../type-aliases/GridType.md) | [`StructuredGrid`](StructuredGrid.md).[`type`](StructuredGrid.md#type) | [Grid.ts:101](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L101) |
| <a id="ur_lat"></a> `ur_lat` | `readonly` | `number` | - | [Grid.ts:246](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L246) |
| <a id="ur_lon"></a> `ur_lon` | `readonly` | `number` | - | [Grid.ts:245](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L245) |

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

[`StructuredGrid`](StructuredGrid.md).[`getVectorRotationAtPoint`](StructuredGrid.md#getvectorrotationatpoint)

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

[`StructuredGrid`](StructuredGrid.md).[`getVectorRotationTexture`](StructuredGrid.md#getvectorrotationtexture)

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

[`StructuredGrid`](StructuredGrid.md).[`getWGLBillboardBuffers`](StructuredGrid.md#getwglbillboardbuffers)

***

### getWGLBuffers()

> **getWGLBuffers**(`gl`): `Promise`\<\{ `texcoords`: `WGLBuffer`; `vertices`: `WGLBuffer`; \}\>

Defined in: [Grid.ts:212](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L212)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `gl` | [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md) |

#### Returns

`Promise`\<\{ `texcoords`: `WGLBuffer`; `vertices`: `WGLBuffer`; \}\>

#### Inherited from

[`StructuredGrid`](StructuredGrid.md).[`getWGLBuffers`](StructuredGrid.md#getwglbuffers)

***

### sampleNearestGridPoint()

> **sampleNearestGridPoint**(`lon`, `lat`, `ary`): `object`

Defined in: [Grid.ts:216](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L216)

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

#### Inherited from

[`StructuredGrid`](StructuredGrid.md).[`sampleNearestGridPoint`](StructuredGrid.md#samplenearestgridpoint)
