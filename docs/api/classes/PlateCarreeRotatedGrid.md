---
title: PlateCarreeRotatedGrid
---

# Class: PlateCarreeRotatedGrid

Defined in: [grids/PlateCarreeRotatedGrid.ts:18](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/PlateCarreeRotatedGrid.ts#L18)

A rotated lat-lon (plate carree) grid with uniform grid spacing 

## Plot Component Compatibility
- :white_check_mark: `Fill`
- :white_check_mark: `Raster`
- :white_check_mark: `Contour`
- :white_check_mark: `Paintball`
- :white_check_mark: `Barbs`
- :white_check_mark: `Hodographs`
- :white_check_mark: `StationPlot`

## Extends

- `AutoZoomGridIntf` & `GridCoordinateIntf` & [`StructuredGrid`](StructuredGrid.md)\<`this`\>

## Constructors

### Constructor

> **new PlateCarreeRotatedGrid**(`ni`, `nj`, `np_lon`, `np_lat`, `lon_shift`, `ll_lon`, `ll_lat`, `ur_lon`, `ur_lat`, `thin_x?`, `thin_y?`): `PlateCarreeRotatedGrid`

Defined in: [grids/PlateCarreeRotatedGrid.ts:41](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/PlateCarreeRotatedGrid.ts#L41)

Create a Lambert conformal conic grid

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ni` | `number` | The number of grid points in the i (longitude) direction |
| `nj` | `number` | The number of grid points in the j (latitude) direction |
| `np_lon` | `number` | The longitude of the north pole for the rotated grid |
| `np_lat` | `number` | The latitude of the north pole for the rotated grid |
| `lon_shift` | `number` | The angle around the rotated north pole to shift the central meridian |
| `ll_lon` | `number` | The longitude of the lower left corner of the grid (on the rotated earth) |
| `ll_lat` | `number` | The latitude of the lower left corner of the grid (on the rotated earth) |
| `ur_lon` | `number` | The longitude of the upper right corner of the grid (on the rotated earth) |
| `ur_lat` | `number` | The latitude of the upper right corner of the grid (on the rotated earth) |
| `thin_x?` | `number` | - |
| `thin_y?` | `number` | - |

#### Returns

`PlateCarreeRotatedGrid`

#### Overrides

`autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).constructor`

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="is_conformal"></a> `is_conformal` | `readonly` | `boolean` | `autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).is_conformal` | [grids/Grid.ts:23](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L23) |
| <a id="ll_lat"></a> `ll_lat` | `readonly` | `number` | - | [grids/PlateCarreeRotatedGrid.ts:23](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/PlateCarreeRotatedGrid.ts#L23) |
| <a id="ll_lon"></a> `ll_lon` | `readonly` | `number` | - | [grids/PlateCarreeRotatedGrid.ts:22](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/PlateCarreeRotatedGrid.ts#L22) |
| <a id="lon_shift"></a> `lon_shift` | `readonly` | `number` | - | [grids/PlateCarreeRotatedGrid.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/PlateCarreeRotatedGrid.ts#L21) |
| <a id="ni"></a> `ni` | `readonly` | `number` | `autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).ni` | [grids/Grid.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L21) |
| <a id="nj"></a> `nj` | `readonly` | `number` | `autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).nj` | [grids/Grid.ts:22](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L22) |
| <a id="np_lat"></a> `np_lat` | `readonly` | `number` | - | [grids/PlateCarreeRotatedGrid.ts:20](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/PlateCarreeRotatedGrid.ts#L20) |
| <a id="np_lon"></a> `np_lon` | `readonly` | `number` | - | [grids/PlateCarreeRotatedGrid.ts:19](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/PlateCarreeRotatedGrid.ts#L19) |
| <a id="thin_x"></a> `thin_x` | `readonly` | `number` | `autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).thin_x` | [grids/StructuredGrid.ts:34](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/StructuredGrid.ts#L34) |
| <a id="thin_y"></a> `thin_y` | `readonly` | `number` | `autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).thin_y` | [grids/StructuredGrid.ts:35](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/StructuredGrid.ts#L35) |
| <a id="type"></a> `type` | `readonly` | [`GridType`](../type-aliases/GridType.md) | `autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).type` | [grids/Grid.ts:20](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L20) |
| <a id="ur_lat"></a> `ur_lat` | `readonly` | `number` | - | [grids/PlateCarreeRotatedGrid.ts:25](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/PlateCarreeRotatedGrid.ts#L25) |
| <a id="ur_lon"></a> `ur_lon` | `readonly` | `number` | - | [grids/PlateCarreeRotatedGrid.ts:24](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/PlateCarreeRotatedGrid.ts#L24) |

## Methods

### getDomainBuffers()

> **getDomainBuffers**(`gl`): `Promise`\<`DomainBuffers`\>

Defined in: [grids/DomainBuffer.ts:9](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/DomainBuffer.ts#L9)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `gl` | [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md) |

#### Returns

`Promise`\<`DomainBuffers`\>

#### Inherited from

`autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).getDomainBuffers`

***

### getEarthCoords()

> **getEarthCoords**(`ni?`, `nj?`, `which_i?`, `which_j?`): `EarthCoords`

Defined in: [grids/GridCoordinates.ts:8](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/GridCoordinates.ts#L8)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ni?` | `number` |
| `nj?` | `number` |
| `which_i?` | `GridElement` |
| `which_j?` | `GridElement` |

#### Returns

`EarthCoords`

#### Inherited from

`autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).getEarthCoords`

***

### getGridCoords()

> **getGridCoords**(): `GridCoords`

Defined in: [grids/GridCoordinates.ts:9](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/GridCoordinates.ts#L9)

#### Returns

`GridCoords`

#### Inherited from

`autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).getGridCoords`

***

### getMinVisibleZoom()

> **getMinVisibleZoom**(`thin_fac`): `Uint8Array`

Defined in: [grids/AutoZoom.ts:56](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/AutoZoom.ts#L56)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `thin_fac` | `number` |

#### Returns

`Uint8Array`

#### Inherited from

`autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).getMinVisibleZoom`

***

### getVectorRotationAtPoint()

> **getVectorRotationAtPoint**(`lon`, `lat`): `number`

Defined in: [grids/AutoZoom.ts:55](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/AutoZoom.ts#L55)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `lon` | `number` |
| `lat` | `number` |

#### Returns

`number`

#### Inherited from

`autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).getVectorRotationAtPoint`

***

### getVectorRotationTexture()

> **getVectorRotationTexture**(`gl`, `data_are_earth_relative`): `object`

Defined in: [grids/AutoZoom.ts:54](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/AutoZoom.ts#L54)

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

`autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).getVectorRotationTexture`

***

### getWGLBillboardBuffers()

> **getWGLBillboardBuffers**(`gl`, `thin_fac`, `max_zoom`): `Promise`\<\{ `texcoords`: `WGLBuffer`; `vertices`: `WGLBuffer`; \}\>

Defined in: [grids/AutoZoom.ts:53](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/AutoZoom.ts#L53)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `gl` | [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md) |
| `thin_fac` | `number` |
| `max_zoom` | `number` |

#### Returns

`Promise`\<\{ `texcoords`: `WGLBuffer`; `vertices`: `WGLBuffer`; \}\>

#### Inherited from

`autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).getWGLBillboardBuffers`

***

### makeDomainBuffers()

> `protected` **makeDomainBuffers**(`gl`): `Promise`\<\{ `texcoords`: `WGLBuffer`; `vertices`: `WGLBuffer`; \}\>

Defined in: [grids/StructuredGrid.ts:105](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/StructuredGrid.ts#L105)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `gl` | [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md) |

#### Returns

`Promise`\<\{ `texcoords`: `WGLBuffer`; `vertices`: `WGLBuffer`; \}\>

#### Inherited from

`autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).makeDomainBuffers`

***

### sampleNearestGridPoint()

> **sampleNearestGridPoint**(`lon`, `lat`, `ary`): `object`

Defined in: [grids/StructuredGrid.ts:111](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/StructuredGrid.ts#L111)

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

`autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).sampleNearestGridPoint`

***

### setupCoordinateCaches()

> **setupCoordinateCaches**(`start_i`, `end_i`, `start_j`, `end_j`): `void`

Defined in: [grids/GridCoordinates.ts:7](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/GridCoordinates.ts#L7)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `start_i` | `number` |
| `end_i` | `number` |
| `start_j` | `number` |
| `end_j` | `number` |

#### Returns

`void`

#### Inherited from

`autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).setupCoordinateCaches`

***

### thinnedGridParameters()

> `protected` **thinnedGridParameters**(`thin_fac`, `map_max_zoom`, `ll_x`, `ll_y`, `ur_x`, `ur_y`): `object`

Defined in: [grids/StructuredGrid.ts:55](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/StructuredGrid.ts#L55)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `thin_fac` | `number` |
| `map_max_zoom` | `number` |
| `ll_x` | `number` |
| `ll_y` | `number` |
| `ur_x` | `number` |
| `ur_y` | `number` |

#### Returns

`object`

##### ll\_x

> **ll\_x**: `number` = `new_ll_x`

##### ll\_y

> **ll\_y**: `number` = `new_ll_y`

##### ni

> **ni**: `number`

##### nj

> **nj**: `number`

##### thin\_x

> **thin\_x**: `number`

##### thin\_y

> **thin\_y**: `number`

##### ur\_x

> **ur\_x**: `number` = `new_ur_x`

##### ur\_y

> **ur\_y**: `number` = `new_ur_y`

#### Inherited from

`autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).thinnedGridParameters`
