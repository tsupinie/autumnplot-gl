[autumnplot-gl](../README.md) / [Exports](../modules.md) / PlateCarreeGrid

# Class: PlateCarreeGrid

A plate carree (a.k.a. lat/lon) grid with uniform grid spacing

## Hierarchy

- [`Grid`](Grid.md)

  ↳ **`PlateCarreeGrid`**

## Table of contents

### Constructors

- [constructor](PlateCarreeGrid.md#constructor)

### Properties

- [\_billboard\_buffer\_cache](PlateCarreeGrid.md#_billboard_buffer_cache)
- [\_buffer\_cache](PlateCarreeGrid.md#_buffer_cache)
- [\_ll\_cache](PlateCarreeGrid.md#_ll_cache)
- [is\_conformal](PlateCarreeGrid.md#is_conformal)
- [ll\_lat](PlateCarreeGrid.md#ll_lat)
- [ll\_lon](PlateCarreeGrid.md#ll_lon)
- [ni](PlateCarreeGrid.md#ni)
- [nj](PlateCarreeGrid.md#nj)
- [type](PlateCarreeGrid.md#type)
- [ur\_lat](PlateCarreeGrid.md#ur_lat)
- [ur\_lon](PlateCarreeGrid.md#ur_lon)

### Methods

- [copy](PlateCarreeGrid.md#copy)
- [getCoords](PlateCarreeGrid.md#getcoords)
- [getThinnedGrid](PlateCarreeGrid.md#getthinnedgrid)
- [getWGLBillboardBuffers](PlateCarreeGrid.md#getwglbillboardbuffers)
- [getWGLBuffers](PlateCarreeGrid.md#getwglbuffers)
- [transform](PlateCarreeGrid.md#transform)

## Constructors

### constructor

• **new PlateCarreeGrid**(`ni`, `nj`, `ll_lon`, `ll_lat`, `ur_lon`, `ur_lat`)

Create a plate carree grid

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ni` | `number` | The number of grid points in the i (longitude) direction |
| `nj` | `number` | The number of grid points in the j (latitude) direction |
| `ll_lon` | `number` | The longitude of the lower left corner of the grid |
| `ll_lat` | `number` | The latitude of the lower left corner of the grid |
| `ur_lon` | `number` | The longitude of the upper right corner of the grid |
| `ur_lat` | `number` | The latitude of the upper right corner of the grid |

#### Overrides

[Grid](Grid.md).[constructor](Grid.md#constructor)

#### Defined in

[RawField.ts:125](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L125)

## Properties

### \_billboard\_buffer\_cache

• `Readonly` **\_billboard\_buffer\_cache**: `Cache`<[[`WebGLAnyRenderingContext`](../modules.md#webglanyrenderingcontext), `number`, `number`], `Promise`<{ `texcoords`: `WGLBuffer` ; `vertices`: `WGLBuffer`  }\>\>

#### Inherited from

[Grid](Grid.md).[_billboard_buffer_cache](Grid.md#_billboard_buffer_cache)

#### Defined in

[RawField.ts:72](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L72)

___

### \_buffer\_cache

• `Readonly` **\_buffer\_cache**: `Cache`<[[`WebGLAnyRenderingContext`](../modules.md#webglanyrenderingcontext)], `Promise`<{ `cellsize`: `WGLBuffer` ; `texcoords`: `WGLBuffer` ; `vertices`: `WGLBuffer`  }\>\>

#### Inherited from

[Grid](Grid.md).[_buffer_cache](Grid.md#_buffer_cache)

#### Defined in

[RawField.ts:71](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L71)

___

### \_ll\_cache

• `Readonly` `Private` **\_ll\_cache**: `Cache`<[], `Coords`\>

#### Defined in

[RawField.ts:114](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L114)

___

### is\_conformal

• `Readonly` **is\_conformal**: `boolean`

#### Inherited from

[Grid](Grid.md).[is_conformal](Grid.md#is_conformal)

#### Defined in

[RawField.ts:69](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L69)

___

### ll\_lat

• `Readonly` **ll\_lat**: `number`

#### Defined in

[RawField.ts:109](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L109)

___

### ll\_lon

• `Readonly` **ll\_lon**: `number`

#### Defined in

[RawField.ts:108](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L108)

___

### ni

• `Readonly` **ni**: `number`

#### Inherited from

[Grid](Grid.md).[ni](Grid.md#ni)

#### Defined in

[RawField.ts:67](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L67)

___

### nj

• `Readonly` **nj**: `number`

#### Inherited from

[Grid](Grid.md).[nj](Grid.md#nj)

#### Defined in

[RawField.ts:68](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L68)

___

### type

• `Readonly` **type**: [`GridType`](../modules.md#gridtype)

#### Inherited from

[Grid](Grid.md).[type](Grid.md#type)

#### Defined in

[RawField.ts:66](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L66)

___

### ur\_lat

• `Readonly` **ur\_lat**: `number`

#### Defined in

[RawField.ts:111](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L111)

___

### ur\_lon

• `Readonly` **ur\_lon**: `number`

#### Defined in

[RawField.ts:110](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L110)

## Methods

### copy

▸ **copy**(`opts?`): [`PlateCarreeGrid`](PlateCarreeGrid.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | `Object` |
| `opts.ll_lat?` | `number` |
| `opts.ll_lon?` | `number` |
| `opts.ni?` | `number` |
| `opts.nj?` | `number` |
| `opts.ur_lat?` | `number` |
| `opts.ur_lon?` | `number` |

#### Returns

[`PlateCarreeGrid`](PlateCarreeGrid.md)

#### Overrides

[Grid](Grid.md).[copy](Grid.md#copy)

#### Defined in

[RawField.ts:153](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L153)

___

### getCoords

▸ **getCoords**(): `Coords`

Get a list of longitudes and latitudes on the grid (internal method)

#### Returns

`Coords`

#### Overrides

[Grid](Grid.md).[getCoords](Grid.md#getcoords)

#### Defined in

[RawField.ts:168](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L168)

___

### getThinnedGrid

▸ **getThinnedGrid**(`thin_x`, `thin_y`): [`PlateCarreeGrid`](PlateCarreeGrid.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `thin_x` | `number` |
| `thin_y` | `number` |

#### Returns

[`PlateCarreeGrid`](PlateCarreeGrid.md)

#### Overrides

[Grid](Grid.md).[getThinnedGrid](Grid.md#getthinnedgrid)

#### Defined in

[RawField.ts:176](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L176)

___

### getWGLBillboardBuffers

▸ **getWGLBillboardBuffers**(`gl`, `thin_fac`, `max_zoom`): `Promise`<{ `texcoords`: `WGLBuffer` ; `vertices`: `WGLBuffer`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | [`WebGLAnyRenderingContext`](../modules.md#webglanyrenderingcontext) |
| `thin_fac` | `number` |
| `max_zoom` | `number` |

#### Returns

`Promise`<{ `texcoords`: `WGLBuffer` ; `vertices`: `WGLBuffer`  }\>

#### Inherited from

[Grid](Grid.md).[getWGLBillboardBuffers](Grid.md#getwglbillboardbuffers)

#### Defined in

[RawField.ts:101](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L101)

___

### getWGLBuffers

▸ **getWGLBuffers**(`gl`): `Promise`<{ `cellsize`: `WGLBuffer` ; `texcoords`: `WGLBuffer` ; `vertices`: `WGLBuffer`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | [`WebGLAnyRenderingContext`](../modules.md#webglanyrenderingcontext) |

#### Returns

`Promise`<{ `cellsize`: `WGLBuffer` ; `texcoords`: `WGLBuffer` ; `vertices`: `WGLBuffer`  }\>

#### Inherited from

[Grid](Grid.md).[getWGLBuffers](Grid.md#getwglbuffers)

#### Defined in

[RawField.ts:97](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L97)

___

### transform

▸ **transform**(`x`, `y`, `opts?`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |
| `opts?` | `Object` |
| `opts.inverse?` | `boolean` |

#### Returns

[`number`, `number`]

#### Overrides

[Grid](Grid.md).[transform](Grid.md#transform)

#### Defined in

[RawField.ts:172](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L172)
