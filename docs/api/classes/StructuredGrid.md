---
title: StructuredGrid
---

# Abstract Class: StructuredGrid

Defined in: [grids/StructuredGrid.ts:33](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/StructuredGrid.ts#L33)

A structured grid (in this case meaning a cartesian grid with i and j coordinates)

## Extends

- `DomainBufferIntf` & [`Grid`](Grid.md)\<`this`\>

## Constructors

### Constructor

> **new StructuredGrid**(`type`, `is_conformal`, `ni`, `nj`, `thin_x?`, `thin_y?`): `StructuredGrid`

Defined in: [grids/StructuredGrid.ts:37](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/StructuredGrid.ts#L37)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | [`GridType`](../type-aliases/GridType.md) |
| `is_conformal` | `boolean` |
| `ni` | `number` |
| `nj` | `number` |
| `thin_x?` | `number` |
| `thin_y?` | `number` |

#### Returns

`StructuredGrid`

#### Overrides

`domainBufferMixin(Grid).constructor`

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="is_conformal"></a> `is_conformal` | `readonly` | `boolean` | `domainBufferMixin(Grid).is_conformal` | [grids/Grid.ts:23](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/Grid.ts#L23) |
| <a id="ni"></a> `ni` | `readonly` | `number` | `domainBufferMixin(Grid).ni` | [grids/Grid.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/Grid.ts#L21) |
| <a id="nj"></a> `nj` | `readonly` | `number` | `domainBufferMixin(Grid).nj` | [grids/Grid.ts:22](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/Grid.ts#L22) |
| <a id="thin_x"></a> `thin_x` | `readonly` | `number` | - | [grids/StructuredGrid.ts:34](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/StructuredGrid.ts#L34) |
| <a id="thin_y"></a> `thin_y` | `readonly` | `number` | - | [grids/StructuredGrid.ts:35](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/StructuredGrid.ts#L35) |
| <a id="type"></a> `type` | `readonly` | [`GridType`](../type-aliases/GridType.md) | `domainBufferMixin(Grid).type` | [grids/Grid.ts:20](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/Grid.ts#L20) |

## Methods

### copy()

> `abstract` **copy**(`opts?`): [`Grid`](Grid.md)

Defined in: [grids/StructuredGrid.ts:103](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/StructuredGrid.ts#L103)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts?` | \{ `ni?`: `number`; `nj?`: `number`; \} |
| `opts.ni?` | `number` |
| `opts.nj?` | `number` |

#### Returns

[`Grid`](Grid.md)

#### Overrides

`domainBufferMixin(Grid).copy`

***

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

`domainBufferMixin(Grid).getDomainBuffers`

***

### getEarthCoords()

> `abstract` **getEarthCoords**(`ni?`, `nj?`, `which_i?`, `which_j?`): `EarthCoords`

Defined in: [grids/StructuredGrid.ts:44](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/StructuredGrid.ts#L44)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ni?` | `number` |
| `nj?` | `number` |
| `which_i?` | `GridElement` |
| `which_j?` | `GridElement` |

#### Returns

`EarthCoords`

#### Overrides

`domainBufferMixin(Grid).getEarthCoords`

***

### getGridCoords()

> `abstract` **getGridCoords**(): `GridCoords`

Defined in: [grids/Grid.ts:33](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/Grid.ts#L33)

#### Returns

`GridCoords`

#### Inherited from

`domainBufferMixin(Grid).getGridCoords`

***

### getThinnedGrid()

> `abstract` **getThinnedGrid**(`thin_fac`, `map_max_zoom`): `this`

Defined in: [grids/Grid.ts:37](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/Grid.ts#L37)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `thin_fac` | `number` |
| `map_max_zoom` | `number` |

#### Returns

`this`

#### Inherited from

`domainBufferMixin(Grid).getThinnedGrid`

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

#### Overrides

`domainBufferMixin(Grid).sampleNearestGridPoint`

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

***

### transform()

> `abstract` **transform**(`x`, `y`, `opts?`): \[`number`, `number`\]

Defined in: [grids/Grid.ts:34](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/grids/Grid.ts#L34)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `opts?` | \{ `inverse?`: `boolean`; \} |
| `opts.inverse?` | `boolean` |

#### Returns

\[`number`, `number`\]

#### Inherited from

`domainBufferMixin(Grid).transform`
