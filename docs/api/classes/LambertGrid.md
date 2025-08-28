---
title: LambertGrid
---

# Class: LambertGrid

Defined in: [Grid.ts:497](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L497)

A Lambert conformal conic grid with uniform grid spacing

## Extends

- [`StructuredGrid`](StructuredGrid.md)

## Constructors

### Constructor

> **new LambertGrid**(`ni`, `nj`, `lon_0`, `lat_0`, `lat_std`, `ll_x`, `ll_y`, `ur_x`, `ur_y`, `a?`, `b?`, `thin_x?`, `thin_y?`): `LambertGrid`

Defined in: [Grid.ts:526](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L526)

Create a Lambert conformal conic grid from the lower-left and upper-right corner x/y values.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ni` | `number` | The number of grid points in the i (longitude) direction |
| `nj` | `number` | The number of grid points in the j (latitude) direction |
| `lon_0` | `number` | The standard longitude for the projection; this is also the center longitude for the projection |
| `lat_0` | `number` | The center latitude for the projection |
| `lat_std` | \[`number`, `number`\] | The standard latitudes for the projection |
| `ll_x` | `number` | The x coordinate in projection space of the lower-left corner of the grid |
| `ll_y` | `number` | The y coordinate in projection space of the lower-left corner of the grid |
| `ur_x` | `number` | The x coordinate in projection space of the upper-right corner of the grid |
| `ur_y` | `number` | The y coordinate in projection space of the upper-right corner of the grid |
| `a?` | `number` | The semimajor axis of the assumed shape of Earth in meters |
| `b?` | `number` | The semiminor axis of the assumed shape of Earth in meters |
| `thin_x?` | `number` | - |
| `thin_y?` | `number` | - |

#### Returns

`LambertGrid`

#### Overrides

[`StructuredGrid`](StructuredGrid.md).[`constructor`](StructuredGrid.md#constructor)

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="a"></a> `a` | `readonly` | `number` | - | [Grid.ts:505](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L505) |
| <a id="b"></a> `b` | `readonly` | `number` | - | [Grid.ts:506](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L506) |
| <a id="is_conformal"></a> `is_conformal` | `readonly` | `boolean` | [`StructuredGrid`](StructuredGrid.md).[`is_conformal`](StructuredGrid.md#is_conformal) | [Grid.ts:104](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L104) |
| <a id="lat_0"></a> `lat_0` | `readonly` | `number` | - | [Grid.ts:499](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L499) |
| <a id="lat_std"></a> `lat_std` | `readonly` | \[`number`, `number`\] | - | [Grid.ts:500](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L500) |
| <a id="ll_x"></a> `ll_x` | `readonly` | `number` | - | [Grid.ts:501](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L501) |
| <a id="ll_y"></a> `ll_y` | `readonly` | `number` | - | [Grid.ts:502](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L502) |
| <a id="lon_0"></a> `lon_0` | `readonly` | `number` | - | [Grid.ts:498](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L498) |
| <a id="ni"></a> `ni` | `readonly` | `number` | [`StructuredGrid`](StructuredGrid.md).[`ni`](StructuredGrid.md#ni) | [Grid.ts:102](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L102) |
| <a id="nj"></a> `nj` | `readonly` | `number` | [`StructuredGrid`](StructuredGrid.md).[`nj`](StructuredGrid.md#nj) | [Grid.ts:103](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L103) |
| <a id="thin_x"></a> `thin_x` | `readonly` | `number` | [`StructuredGrid`](StructuredGrid.md).[`thin_x`](StructuredGrid.md#thin_x) | [Grid.ts:152](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L152) |
| <a id="thin_y"></a> `thin_y` | `readonly` | `number` | [`StructuredGrid`](StructuredGrid.md).[`thin_y`](StructuredGrid.md#thin_y) | [Grid.ts:153](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L153) |
| <a id="type"></a> `type` | `readonly` | [`GridType`](../type-aliases/GridType.md) | [`StructuredGrid`](StructuredGrid.md).[`type`](StructuredGrid.md#type) | [Grid.ts:101](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L101) |
| <a id="ur_x"></a> `ur_x` | `readonly` | `number` | - | [Grid.ts:503](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L503) |
| <a id="ur_y"></a> `ur_y` | `readonly` | `number` | - | [Grid.ts:504](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L504) |

## Methods

### getVectorRotationAtPoint()

> **getVectorRotationAtPoint**(`lon`, `lat`): `number`

Defined in: [Grid.ts:138](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L138)

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

Defined in: [Grid.ts:144](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L144)

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

Defined in: [Grid.ts:132](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L132)

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

Defined in: [Grid.ts:212](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L212)

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

Defined in: [Grid.ts:216](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L216)

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

***

### fromLLCornerLonLat()

> `static` **fromLLCornerLonLat**(`ni`, `nj`, `lon_0`, `lat_0`, `lat_std`, `ll_lon`, `ll_lat`, `dx`, `dy`, `a?`, `b?`): `LambertGrid`

Defined in: [Grid.ts:597](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L597)

Create a Lambert conformal conic grid from the lower-left grid point coordinate and a dx and dy.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ni` | `number` | The number of grid points in the i (longitude) direction |
| `nj` | `number` | The number of grid points in the j (latitude) direction |
| `lon_0` | `number` | The standard longitude for the projection; this is also the center longitude for the projection |
| `lat_0` | `number` | The center latitude for the projection |
| `lat_std` | \[`number`, `number`\] | The standard latitudes for the projection |
| `ll_lon` | `number` | The longitude of the lower-left corner of the grid |
| `ll_lat` | `number` | The latitude of the lower-left corner of the grid |
| `dx` | `number` | The grid dx in meters |
| `dy` | `number` | The grid dy in meters |
| `a?` | `number` | The semimajor axis of the assumed shape of Earth in meters |
| `b?` | `number` | The semiminor axis of the assumed shape of Earth in meters |

#### Returns

`LambertGrid`
