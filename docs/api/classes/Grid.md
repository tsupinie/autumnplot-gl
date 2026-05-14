---
title: Grid
---

# Abstract Class: Grid

Defined in: [grids/Grid.ts:19](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L19)

The base class for grid types

## Constructors

### Constructor

> **new Grid**(`type`, `is_conformal`, `ni`, `nj`): `Grid`

Defined in: [grids/Grid.ts:25](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L25)

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
| <a id="is_conformal"></a> `is_conformal` | `readonly` | `boolean` | [grids/Grid.ts:23](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L23) |
| <a id="ni"></a> `ni` | `readonly` | `number` | [grids/Grid.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L21) |
| <a id="nj"></a> `nj` | `readonly` | `number` | [grids/Grid.ts:22](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L22) |
| <a id="type"></a> `type` | `readonly` | [`GridType`](../type-aliases/GridType.md) | [grids/Grid.ts:20](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L20) |

## Methods

### copy()

> `abstract` **copy**(): `Grid`

Defined in: [grids/Grid.ts:40](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L40)

#### Returns

`Grid`

***

### getEarthCoords()

> `abstract` **getEarthCoords**(): `EarthCoords`

Defined in: [grids/Grid.ts:32](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L32)

#### Returns

`EarthCoords`

***

### getGridCoords()

> `abstract` **getGridCoords**(): `GridCoords`

Defined in: [grids/Grid.ts:33](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L33)

#### Returns

`GridCoords`

***

### getThinnedGrid()

> `abstract` **getThinnedGrid**(`thin_fac`, `map_max_zoom`): `this`

Defined in: [grids/Grid.ts:37](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L37)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `thin_fac` | `number` |
| `map_max_zoom` | `number` |

#### Returns

`this`

***

### sampleNearestGridPoint()

> `abstract` **sampleNearestGridPoint**(`lon`, `lat`, `ary`): `object`

Defined in: [grids/Grid.ts:35](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L35)

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

Defined in: [grids/Grid.ts:38](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L38)

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

Defined in: [grids/Grid.ts:34](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/grids/Grid.ts#L34)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `opts?` | \{ `inverse?`: `boolean`; \} |
| `opts.inverse?` | `boolean` |

#### Returns

\[`number`, `number`\]
