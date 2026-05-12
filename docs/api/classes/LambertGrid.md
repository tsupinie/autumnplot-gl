---
title: LambertGrid
---

# Class: LambertGrid

Defined in: [grids/LambertGrid.ts:19](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/LambertGrid.ts#L19)

A Lambert conformal conic grid with uniform grid spacing 

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

> **new LambertGrid**(`ni`, `nj`, `lon_0`, `lat_0`, `lat_std`, `ll_x`, `ll_y`, `ur_x`, `ur_y`, `a?`, `b?`, `thin_x?`, `thin_y?`): `LambertGrid`

Defined in: [grids/LambertGrid.ts:46](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/LambertGrid.ts#L46)

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

`autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).constructor`

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="a"></a> `a` | `readonly` | `number` | - | [grids/LambertGrid.ts:27](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/LambertGrid.ts#L27) |
| <a id="b"></a> `b` | `readonly` | `number` | - | [grids/LambertGrid.ts:28](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/LambertGrid.ts#L28) |
| <a id="is_conformal"></a> `is_conformal` | `readonly` | `boolean` | `autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).is_conformal` | [grids/Grid.ts:23](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/Grid.ts#L23) |
| <a id="lat_0"></a> `lat_0` | `readonly` | `number` | - | [grids/LambertGrid.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/LambertGrid.ts#L21) |
| <a id="lat_std"></a> `lat_std` | `readonly` | \[`number`, `number`\] | - | [grids/LambertGrid.ts:22](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/LambertGrid.ts#L22) |
| <a id="ll_x"></a> `ll_x` | `readonly` | `number` | - | [grids/LambertGrid.ts:23](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/LambertGrid.ts#L23) |
| <a id="ll_y"></a> `ll_y` | `readonly` | `number` | - | [grids/LambertGrid.ts:24](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/LambertGrid.ts#L24) |
| <a id="lon_0"></a> `lon_0` | `readonly` | `number` | - | [grids/LambertGrid.ts:20](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/LambertGrid.ts#L20) |
| <a id="ni"></a> `ni` | `readonly` | `number` | `autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).ni` | [grids/Grid.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/Grid.ts#L21) |
| <a id="nj"></a> `nj` | `readonly` | `number` | `autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).nj` | [grids/Grid.ts:22](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/Grid.ts#L22) |
| <a id="thin_x"></a> `thin_x` | `readonly` | `number` | `autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).thin_x` | [grids/StructuredGrid.ts:34](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/StructuredGrid.ts#L34) |
| <a id="thin_y"></a> `thin_y` | `readonly` | `number` | `autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).thin_y` | [grids/StructuredGrid.ts:35](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/StructuredGrid.ts#L35) |
| <a id="type"></a> `type` | `readonly` | [`GridType`](../type-aliases/GridType.md) | `autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).type` | [grids/Grid.ts:20](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/Grid.ts#L20) |
| <a id="ur_x"></a> `ur_x` | `readonly` | `number` | - | [grids/LambertGrid.ts:25](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/LambertGrid.ts#L25) |
| <a id="ur_y"></a> `ur_y` | `readonly` | `number` | - | [grids/LambertGrid.ts:26](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/LambertGrid.ts#L26) |

## Methods

### getDomainBuffers()

> **getDomainBuffers**(`gl`): `Promise`\<`DomainBuffers`\>

Defined in: [grids/DomainBuffer.ts:9](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/DomainBuffer.ts#L9)

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

Defined in: [grids/GridCoordinates.ts:8](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/GridCoordinates.ts#L8)

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

Defined in: [grids/GridCoordinates.ts:9](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/GridCoordinates.ts#L9)

#### Returns

`GridCoords`

#### Inherited from

`autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).getGridCoords`

***

### getMinVisibleZoom()

> **getMinVisibleZoom**(`thin_fac`): `Uint8Array`

Defined in: [grids/AutoZoom.ts:56](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/AutoZoom.ts#L56)

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

Defined in: [grids/AutoZoom.ts:55](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/AutoZoom.ts#L55)

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

`autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).getVectorRotationTexture`

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

`autoZoomGridMixin(gridCoordinateMixin(StructuredGrid)).getWGLBillboardBuffers`

***

### makeDomainBuffers()

> `protected` **makeDomainBuffers**(`gl`): `Promise`\<\{ `texcoords`: `WGLBuffer`; `vertices`: `WGLBuffer`; \}\>

Defined in: [grids/StructuredGrid.ts:105](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/StructuredGrid.ts#L105)

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

Defined in: [grids/StructuredGrid.ts:111](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/StructuredGrid.ts#L111)

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

Defined in: [grids/GridCoordinates.ts:7](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/GridCoordinates.ts#L7)

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

Defined in: [grids/StructuredGrid.ts:55](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/StructuredGrid.ts#L55)

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

***

### fromLLCornerLonLat()

> `static` **fromLLCornerLonLat**(`ni`, `nj`, `lon_0`, `lat_0`, `lat_std`, `ll_lon`, `ll_lat`, `dx`, `dy`, `a?`, `b?`): `LambertGrid`

Defined in: [grids/LambertGrid.ts:79](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/LambertGrid.ts#L79)

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
