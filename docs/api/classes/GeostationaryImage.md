---
title: GeostationaryImage
---

# Class: GeostationaryImage

Defined in: [grids/Geostationary.ts:18](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Geostationary.ts#L18)

Grid for geostationary satellite images

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

> **new GeostationaryImage**(`ni`, `nj`, `ll_x`, `ll_y`, `ur_x`, `ur_y`, `satellite_lon`, `thin_x?`, `thin_y?`): `GeostationaryImage`

Defined in: [grids/Geostationary.ts:27](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Geostationary.ts#L27)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ni` | `number` |
| `nj` | `number` |
| `ll_x` | `number` |
| `ll_y` | `number` |
| `ur_x` | `number` |
| `ur_y` | `number` |
| `satellite_lon` | `number` |
| `thin_x?` | `number` |
| `thin_y?` | `number` |

#### Returns

`GeostationaryImage`

#### Overrides

`gridCoordinateMixin(StructuredGrid).constructor`

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="is_conformal"></a> `is_conformal` | `readonly` | `boolean` | `gridCoordinateMixin(StructuredGrid).is_conformal` | [grids/Grid.ts:23](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L23) |
| <a id="ll_x"></a> `ll_x` | `readonly` | `number` | - | [grids/Geostationary.ts:20](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Geostationary.ts#L20) |
| <a id="ll_y"></a> `ll_y` | `readonly` | `number` | - | [grids/Geostationary.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Geostationary.ts#L21) |
| <a id="ni"></a> `ni` | `readonly` | `number` | `gridCoordinateMixin(StructuredGrid).ni` | [grids/Grid.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L21) |
| <a id="nj"></a> `nj` | `readonly` | `number` | `gridCoordinateMixin(StructuredGrid).nj` | [grids/Grid.ts:22](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L22) |
| <a id="satellite_lon"></a> `satellite_lon` | `readonly` | `number` | - | [grids/Geostationary.ts:19](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Geostationary.ts#L19) |
| <a id="thin_x"></a> `thin_x` | `readonly` | `number` | `gridCoordinateMixin(StructuredGrid).thin_x` | [grids/StructuredGrid.ts:34](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/StructuredGrid.ts#L34) |
| <a id="thin_y"></a> `thin_y` | `readonly` | `number` | `gridCoordinateMixin(StructuredGrid).thin_y` | [grids/StructuredGrid.ts:35](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/StructuredGrid.ts#L35) |
| <a id="type"></a> `type` | `readonly` | [`GridType`](../type-aliases/GridType.md) | `gridCoordinateMixin(StructuredGrid).type` | [grids/Grid.ts:20](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L20) |
| <a id="ur_x"></a> `ur_x` | `readonly` | `number` | - | [grids/Geostationary.ts:22](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Geostationary.ts#L22) |
| <a id="ur_y"></a> `ur_y` | `readonly` | `number` | - | [grids/Geostationary.ts:23](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Geostationary.ts#L23) |

## Methods

### copy()

> **copy**(): `GeostationaryImage`

Defined in: [grids/Geostationary.ts:55](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Geostationary.ts#L55)

#### Returns

`GeostationaryImage`

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

Defined in: [grids/Geostationary.ts:42](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Geostationary.ts#L42)

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

> **transform**(`x`, `y`, `opts?`): \[`number`, `number`\]

Defined in: [grids/Geostationary.ts:48](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Geostationary.ts#L48)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `opts?` | \{ `inverse?`: `boolean`; \} |
| `opts.inverse?` | `boolean` |

#### Returns

\[`number`, `number`\]

#### Overrides

`gridCoordinateMixin(StructuredGrid).transform`
