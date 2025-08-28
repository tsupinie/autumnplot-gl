---
title: StructuredGrid
---

# Abstract Class: StructuredGrid

Defined in: [Grid.ts:150](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L150)

A structured grid (in this case meaning a cartesian grid with i and j coordinates)

## Extends

- [`Grid`](Grid.md)

## Extended by

- [`PlateCarreeGrid`](PlateCarreeGrid.md)
- [`PlateCarreeRotatedGrid`](PlateCarreeRotatedGrid.md)
- [`LambertGrid`](LambertGrid.md)

## Constructors

### Constructor

> **new StructuredGrid**(`type`, `is_conformal`, `ni`, `nj`, `thin_x?`, `thin_y?`): `StructuredGrid`

Defined in: [Grid.ts:155](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L155)

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

[`Grid`](Grid.md).[`constructor`](Grid.md#constructor)

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="is_conformal"></a> `is_conformal` | `readonly` | `boolean` | [`Grid`](Grid.md).[`is_conformal`](Grid.md#is_conformal) | [Grid.ts:104](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L104) |
| <a id="ni"></a> `ni` | `readonly` | `number` | [`Grid`](Grid.md).[`ni`](Grid.md#ni) | [Grid.ts:102](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L102) |
| <a id="nj"></a> `nj` | `readonly` | `number` | [`Grid`](Grid.md).[`nj`](Grid.md#nj) | [Grid.ts:103](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L103) |
| <a id="thin_x"></a> `thin_x` | `readonly` | `number` | - | [Grid.ts:152](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L152) |
| <a id="thin_y"></a> `thin_y` | `readonly` | `number` | - | [Grid.ts:153](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L153) |
| <a id="type"></a> `type` | `readonly` | [`GridType`](../type-aliases/GridType.md) | [`Grid`](Grid.md).[`type`](Grid.md#type) | [Grid.ts:101](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L101) |

## Methods

### copy()

> `abstract` **copy**(`opts?`): [`Grid`](Grid.md)

Defined in: [Grid.ts:210](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L210)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts?` | \{ `ni?`: `number`; `nj?`: `number`; \} |
| `opts.ni?` | `number` |
| `opts.nj?` | `number` |

#### Returns

[`Grid`](Grid.md)

#### Overrides

[`Grid`](Grid.md).[`copy`](Grid.md#copy)

***

### getEarthCoords()

> `abstract` **getEarthCoords**(`ni?`, `nj?`): `EarthCoords`

Defined in: [Grid.ts:168](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L168)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ni?` | `number` |
| `nj?` | `number` |

#### Returns

`EarthCoords`

#### Overrides

[`Grid`](Grid.md).[`getEarthCoords`](Grid.md#getearthcoords)

***

### getGridCoords()

> `abstract` **getGridCoords**(): `GridCoords`

Defined in: [Grid.ts:125](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L125)

#### Returns

`GridCoords`

#### Inherited from

[`Grid`](Grid.md).[`getGridCoords`](Grid.md#getgridcoords)

***

### getThinnedGrid()

> `abstract` **getThinnedGrid**(`thin_fac`, `map_max_zoom`): [`Grid`](Grid.md)

Defined in: [Grid.ts:128](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L128)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `thin_fac` | `number` |
| `map_max_zoom` | `number` |

#### Returns

[`Grid`](Grid.md)

#### Inherited from

[`Grid`](Grid.md).[`getThinnedGrid`](Grid.md#getthinnedgrid)

***

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

[`Grid`](Grid.md).[`getVectorRotationAtPoint`](Grid.md#getvectorrotationatpoint)

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

[`Grid`](Grid.md).[`getVectorRotationTexture`](Grid.md#getvectorrotationtexture)

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

[`Grid`](Grid.md).[`getWGLBillboardBuffers`](Grid.md#getwglbillboardbuffers)

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

#### Overrides

[`Grid`](Grid.md).[`sampleNearestGridPoint`](Grid.md#samplenearestgridpoint)

***

### transform()

> `abstract` **transform**(`x`, `y`, `opts?`): \[`number`, `number`\]

Defined in: [Grid.ts:126](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Grid.ts#L126)

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

[`Grid`](Grid.md).[`transform`](Grid.md#transform)
