---
title: UnstructuredGrid
---

# Class: UnstructuredGrid

Defined in: [grids/UnstructuredGrid.ts:20](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/UnstructuredGrid.ts#L20)

An unstructured grid defined by a list of latitudes and longitudes 

## Plot Component Compatibility
- :x:                `Fill`
- :x:                `Raster`
- :x:                `Contour`
- :x:                `Paintball`
- :white_check_mark: `Barbs`
- :white_check_mark: `Hodographs`
- :white_check_mark: `StationPlot`

## Extends

- `AutoZoomGridIntf` & [`Grid`](Grid.md)\<`this`\>

## Constructors

### Constructor

> **new UnstructuredGrid**(`coords`, `zoom?`): `UnstructuredGrid`

Defined in: [grids/UnstructuredGrid.ts:29](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/UnstructuredGrid.ts#L29)

Create an unstructured grid

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `coords` | `object`[] | The lat/lon coordinates of the grid points |
| `zoom?` | `Uint8Array` | - |

#### Returns

`UnstructuredGrid`

#### Overrides

`autoZoomGridMixin(Grid).constructor`

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="coords"></a> `coords` | `readonly` | `object`[] | - | [grids/UnstructuredGrid.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/UnstructuredGrid.ts#L21) |
| <a id="is_conformal"></a> `is_conformal` | `readonly` | `boolean` | `autoZoomGridMixin(Grid).is_conformal` | [grids/Grid.ts:23](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/Grid.ts#L23) |
| <a id="ni"></a> `ni` | `readonly` | `number` | `autoZoomGridMixin(Grid).ni` | [grids/Grid.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/Grid.ts#L21) |
| <a id="nj"></a> `nj` | `readonly` | `number` | `autoZoomGridMixin(Grid).nj` | [grids/Grid.ts:22](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/Grid.ts#L22) |
| <a id="type"></a> `type` | `readonly` | [`GridType`](../type-aliases/GridType.md) | `autoZoomGridMixin(Grid).type` | [grids/Grid.ts:20](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/Grid.ts#L20) |

## Methods

### getVectorRotationAtPoint()

> **getVectorRotationAtPoint**(`lon`, `lat`): `number`

Defined in: [grids/AutoZoom.ts:55](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/AutoZoom.ts#L55)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `lon` | `number` |
| `lat` | `number` |

#### Returns

`number`

#### Inherited from

`autoZoomGridMixin(Grid).getVectorRotationAtPoint`

***

### getVectorRotationTexture()

> **getVectorRotationTexture**(`gl`, `data_are_earth_relative`): `object`

Defined in: [grids/AutoZoom.ts:54](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/AutoZoom.ts#L54)

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

`autoZoomGridMixin(Grid).getVectorRotationTexture`

***

### getWGLBillboardBuffers()

> **getWGLBillboardBuffers**(`gl`, `thin_fac`, `max_zoom`): `Promise`\<\{ `texcoords`: `WGLBuffer`; `vertices`: `WGLBuffer`; \}\>

Defined in: [grids/AutoZoom.ts:53](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/AutoZoom.ts#L53)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `gl` | [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md) |
| `thin_fac` | `number` |
| `max_zoom` | `number` |

#### Returns

`Promise`\<\{ `texcoords`: `WGLBuffer`; `vertices`: `WGLBuffer`; \}\>

#### Inherited from

`autoZoomGridMixin(Grid).getWGLBillboardBuffers`

***

### sampleNearestGridPoint()

> **sampleNearestGridPoint**(`lon`, `lat`, `ary`): `object`

Defined in: [grids/UnstructuredGrid.ts:126](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/UnstructuredGrid.ts#L126)

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

`autoZoomGridMixin(Grid).sampleNearestGridPoint`
