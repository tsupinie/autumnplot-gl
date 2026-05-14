---
title: RadarSweepGrid
---

# Class: RadarSweepGrid

Defined in: [grids/RadarSweepGrid.ts:18](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/RadarSweepGrid.ts#L18)

A grid for a radar sweep centered at a certain latitude and longitude.

## Plot Component Compatibility
- :white_check_mark: `Fill`
- :white_check_mark: `Raster`
- :white_check_mark: `Contour`
- :white_check_mark: `Paintball`
- :x:                `Barbs`
- :x:                `Hodographs`
- :x:                `StationPlot`

## Extends

- `GridCoordinateIntf` & [`StructuredGrid`](StructuredGrid.md)\<`this`\>

## Constructors

### Constructor

> **new RadarSweepGrid**(`nr`, `nt`, `start_rn`, `end_rn`, `start_az`, `end_az`, `longitude`, `latitude`, `thin_x?`, `thin_y?`): `RadarSweepGrid`

Defined in: [grids/RadarSweepGrid.ts:27](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/RadarSweepGrid.ts#L27)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `nr` | `number` |
| `nt` | `number` |
| `start_rn` | `number` |
| `end_rn` | `number` |
| `start_az` | `number` |
| `end_az` | `number` |
| `longitude` | `number` |
| `latitude` | `number` |
| `thin_x?` | `number` |
| `thin_y?` | `number` |

#### Returns

`RadarSweepGrid`

#### Overrides

`gridCoordinateMixin(StructuredGrid).constructor`

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="end_az"></a> `end_az` | `readonly` | `number` | - | [grids/RadarSweepGrid.ts:24](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/RadarSweepGrid.ts#L24) |
| <a id="end_rn"></a> `end_rn` | `readonly` | `number` | - | [grids/RadarSweepGrid.ts:22](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/RadarSweepGrid.ts#L22) |
| <a id="geod"></a> `geod` | `readonly` | `GeodesicClass` | - | [grids/RadarSweepGrid.ts:25](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/RadarSweepGrid.ts#L25) |
| <a id="is_conformal"></a> `is_conformal` | `readonly` | `boolean` | `gridCoordinateMixin(StructuredGrid).is_conformal` | [grids/Grid.ts:23](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L23) |
| <a id="latitude"></a> `latitude` | `readonly` | `number` | - | [grids/RadarSweepGrid.ts:20](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/RadarSweepGrid.ts#L20) |
| <a id="longitude"></a> `longitude` | `readonly` | `number` | - | [grids/RadarSweepGrid.ts:19](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/RadarSweepGrid.ts#L19) |
| <a id="ni"></a> `ni` | `readonly` | `number` | `gridCoordinateMixin(StructuredGrid).ni` | [grids/Grid.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L21) |
| <a id="nj"></a> `nj` | `readonly` | `number` | `gridCoordinateMixin(StructuredGrid).nj` | [grids/Grid.ts:22](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L22) |
| <a id="start_az"></a> `start_az` | `readonly` | `number` | - | [grids/RadarSweepGrid.ts:23](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/RadarSweepGrid.ts#L23) |
| <a id="start_rn"></a> `start_rn` | `readonly` | `number` | - | [grids/RadarSweepGrid.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/RadarSweepGrid.ts#L21) |
| <a id="thin_x"></a> `thin_x` | `readonly` | `number` | `gridCoordinateMixin(StructuredGrid).thin_x` | [grids/StructuredGrid.ts:34](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/StructuredGrid.ts#L34) |
| <a id="thin_y"></a> `thin_y` | `readonly` | `number` | `gridCoordinateMixin(StructuredGrid).thin_y` | [grids/StructuredGrid.ts:35](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/StructuredGrid.ts#L35) |
| <a id="type"></a> `type` | `readonly` | [`GridType`](../type-aliases/GridType.md) | `gridCoordinateMixin(StructuredGrid).type` | [grids/Grid.ts:20](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L20) |

## Methods

### copy()

> **copy**(`opts?`): `RadarSweepGrid`

Defined in: [grids/RadarSweepGrid.ts:42](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/RadarSweepGrid.ts#L42)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts?` | \{ `end_az?`: `number`; `end_rn?`: `number`; `latitude?`: `number`; `longitude?`: `number`; `ni?`: `number`; `nj?`: `number`; `start_az?`: `number`; `start_rn?`: `number`; \} |
| `opts.end_az?` | `number` |
| `opts.end_rn?` | `number` |
| `opts.latitude?` | `number` |
| `opts.longitude?` | `number` |
| `opts.ni?` | `number` |
| `opts.nj?` | `number` |
| `opts.start_az?` | `number` |
| `opts.start_rn?` | `number` |

#### Returns

`RadarSweepGrid`

#### Overrides

`gridCoordinateMixin(StructuredGrid).copy`

***

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

`gridCoordinateMixin(StructuredGrid).getDomainBuffers`

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

`gridCoordinateMixin(StructuredGrid).getEarthCoords`

***

### getGridCoords()

> **getGridCoords**(): `GridCoords`

Defined in: [grids/GridCoordinates.ts:9](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/GridCoordinates.ts#L9)

#### Returns

`GridCoords`

#### Inherited from

`gridCoordinateMixin(StructuredGrid).getGridCoords`

***

### makeDomainBuffers()

> `protected` **makeDomainBuffers**(`gl`): `Promise`\<\{ `texcoords`: `WGLBuffer`; `vertices`: `WGLBuffer`; \}\>

Defined in: [grids/RadarSweepGrid.ts:57](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/RadarSweepGrid.ts#L57)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `gl` | [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md) |

#### Returns

`Promise`\<\{ `texcoords`: `WGLBuffer`; `vertices`: `WGLBuffer`; \}\>

#### Overrides

`gridCoordinateMixin(StructuredGrid).makeDomainBuffers`

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

`gridCoordinateMixin(StructuredGrid).sampleNearestGridPoint`

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

`gridCoordinateMixin(StructuredGrid).setupCoordinateCaches`

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

`gridCoordinateMixin(StructuredGrid).thinnedGridParameters`

***

### transform()

> **transform**(`a`, `b`, `opts?`): \[`number`, `number`\]

Defined in: [grids/RadarSweepGrid.ts:61](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/RadarSweepGrid.ts#L61)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | `number` |
| `b` | `number` |
| `opts?` | \{ `inverse?`: `boolean`; \} |
| `opts.inverse?` | `boolean` |

#### Returns

\[`number`, `number`\]

#### Overrides

`gridCoordinateMixin(StructuredGrid).transform`
