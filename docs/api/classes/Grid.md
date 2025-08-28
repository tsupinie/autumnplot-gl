---
title: Grid
---

# Abstract Class: Grid

Defined in: [Grid.ts:100](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L100)

The base class for grid types

## Extended by

- [`StructuredGrid`](StructuredGrid.md)
- [`UnstructuredGrid`](UnstructuredGrid.md)

## Constructors

### Constructor

> **new Grid**(`type`, `is_conformal`, `ni`, `nj`): `Grid`

Defined in: [Grid.ts:109](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L109)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | [`GridType`](../type-aliases/GridType.md) |
| `is_conformal` | `boolean` |
| `ni` | `number` |
| `nj` | `number` |

#### Returns

`Grid`

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="is_conformal"></a> `is_conformal` | `readonly` | `boolean` | [Grid.ts:104](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L104) |
| <a id="ni"></a> `ni` | `readonly` | `number` | [Grid.ts:102](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L102) |
| <a id="nj"></a> `nj` | `readonly` | `number` | [Grid.ts:103](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L103) |
| <a id="type"></a> `type` | `readonly` | [`GridType`](../type-aliases/GridType.md) | [Grid.ts:101](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L101) |

## Methods

### copy()

> `abstract` **copy**(): `Grid`

Defined in: [Grid.ts:136](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L136)

#### Returns

`Grid`

***

### getEarthCoords()

> `abstract` **getEarthCoords**(): `EarthCoords`

Defined in: [Grid.ts:124](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L124)

#### Returns

`EarthCoords`

***

### getGridCoords()

> `abstract` **getGridCoords**(): `GridCoords`

Defined in: [Grid.ts:125](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L125)

#### Returns

`GridCoords`

***

### getMinVisibleZoom()

> `abstract` **getMinVisibleZoom**(`thin_fac`): `Uint8Array`

Defined in: [Grid.ts:130](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L130)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `thin_fac` | `number` |

#### Returns

`Uint8Array`

***

### getThinnedGrid()

> `abstract` **getThinnedGrid**(`thin_fac`, `map_max_zoom`): `Grid`

Defined in: [Grid.ts:128](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L128)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `thin_fac` | `number` |
| `map_max_zoom` | `number` |

#### Returns

`Grid`

***

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

***

### sampleNearestGridPoint()

> `abstract` **sampleNearestGridPoint**(`lon`, `lat`, `ary`): `object`

Defined in: [Grid.ts:127](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L127)

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

***

### thinDataArray()

> `abstract` **thinDataArray**\<`ArrayType`\>(`original_grid`, `ary`): `ArrayType`

Defined in: [Grid.ts:129](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L129)

#### Type Parameters

| Type Parameter |
| ------ |
| `ArrayType` *extends* [`TypedArray`](../type-aliases/TypedArray.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `original_grid` | `Grid` |
| `ary` | `ArrayType` |

#### Returns

`ArrayType`

***

### transform()

> `abstract` **transform**(`x`, `y`, `opts?`): \[`number`, `number`\]

Defined in: [Grid.ts:126](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Grid.ts#L126)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `opts?` | \{ `inverse?`: `boolean`; \} |
| `opts.inverse?` | `boolean` |

#### Returns

\[`number`, `number`\]
