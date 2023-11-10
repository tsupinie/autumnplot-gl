[autumnplot-gl](../README.md) / [Exports](../modules.md) / PlateCarreeRotatedGrid

# Class: PlateCarreeRotatedGrid

A rotated lat-lon (plate carree) grid with uniform grid spacing

## Hierarchy

- [`Grid`](Grid.md)

  ↳ **`PlateCarreeRotatedGrid`**

## Table of contents

### Constructors

- [constructor](PlateCarreeRotatedGrid.md#constructor)

### Properties

- [is\_conformal](PlateCarreeRotatedGrid.md#is_conformal)
- [ll\_lat](PlateCarreeRotatedGrid.md#ll_lat)
- [ll\_lon](PlateCarreeRotatedGrid.md#ll_lon)
- [lon\_shift](PlateCarreeRotatedGrid.md#lon_shift)
- [ni](PlateCarreeRotatedGrid.md#ni)
- [nj](PlateCarreeRotatedGrid.md#nj)
- [np\_lat](PlateCarreeRotatedGrid.md#np_lat)
- [np\_lon](PlateCarreeRotatedGrid.md#np_lon)
- [type](PlateCarreeRotatedGrid.md#type)
- [ur\_lat](PlateCarreeRotatedGrid.md#ur_lat)
- [ur\_lon](PlateCarreeRotatedGrid.md#ur_lon)

### Methods

- [copy](PlateCarreeRotatedGrid.md#copy)
- [getCoords](PlateCarreeRotatedGrid.md#getcoords)
- [getThinnedGrid](PlateCarreeRotatedGrid.md#getthinnedgrid)
- [getWGLBillboardBuffers](PlateCarreeRotatedGrid.md#getwglbillboardbuffers)
- [getWGLBuffers](PlateCarreeRotatedGrid.md#getwglbuffers)
- [transform](PlateCarreeRotatedGrid.md#transform)

## Constructors

### constructor

• **new PlateCarreeRotatedGrid**(`ni`, `nj`, `np_lon`, `np_lat`, `lon_shift`, `ll_lon`, `ll_lat`, `ur_lon`, `ur_lat`)

Create a Lambert conformal conic grid

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ni` | `number` | The number of grid points in the i (longitude) direction |
| `nj` | `number` | The number of grid points in the j (latitude) direction |
| `np_lon` | `number` | The longitude of the north pole for the rotated grid |
| `np_lat` | `number` | The latitude of the north pole for the rotated grid |
| `lon_shift` | `number` | The angle around the rotated north pole to shift the central meridian |
| `ll_lon` | `number` | The longitude of the lower left corner of the grid (on the rotated earth) |
| `ll_lat` | `number` | The latitude of the lower left corner of the grid (on the rotated earth) |
| `ur_lon` | `number` | The longitude of the upper right corner of the grid (on the rotated earth) |
| `ur_lat` | `number` | The latitude of the upper right corner of the grid (on the rotated earth) |

#### Overrides

[Grid](Grid.md).[constructor](Grid.md#constructor)

#### Defined in

[RawField.ts:200](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L200)

## Properties

### is\_conformal

• `Readonly` **is\_conformal**: `boolean`

#### Inherited from

[Grid](Grid.md).[is_conformal](Grid.md#is_conformal)

#### Defined in

[RawField.ts:52](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L52)

___

### ll\_lat

• `Readonly` **ll\_lat**: `number`

#### Defined in

[RawField.ts:181](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L181)

___

### ll\_lon

• `Readonly` **ll\_lon**: `number`

#### Defined in

[RawField.ts:180](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L180)

___

### lon\_shift

• `Readonly` **lon\_shift**: `number`

#### Defined in

[RawField.ts:179](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L179)

___

### ni

• `Readonly` **ni**: `number`

#### Inherited from

[Grid](Grid.md).[ni](Grid.md#ni)

#### Defined in

[RawField.ts:50](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L50)

___

### nj

• `Readonly` **nj**: `number`

#### Inherited from

[Grid](Grid.md).[nj](Grid.md#nj)

#### Defined in

[RawField.ts:51](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L51)

___

### np\_lat

• `Readonly` **np\_lat**: `number`

#### Defined in

[RawField.ts:178](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L178)

___

### np\_lon

• `Readonly` **np\_lon**: `number`

#### Defined in

[RawField.ts:177](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L177)

___

### type

• `Readonly` **type**: [`GridType`](../modules.md#gridtype)

#### Inherited from

[Grid](Grid.md).[type](Grid.md#type)

#### Defined in

[RawField.ts:49](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L49)

___

### ur\_lat

• `Readonly` **ur\_lat**: `number`

#### Defined in

[RawField.ts:183](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L183)

___

### ur\_lon

• `Readonly` **ur\_lon**: `number`

#### Defined in

[RawField.ts:182](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L182)

## Methods

### copy

▸ **copy**(`opts?`): [`PlateCarreeRotatedGrid`](PlateCarreeRotatedGrid.md)

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

[`PlateCarreeRotatedGrid`](PlateCarreeRotatedGrid.md)

#### Overrides

[Grid](Grid.md).[copy](Grid.md#copy)

#### Defined in

[RawField.ts:232](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L232)

___

### getCoords

▸ **getCoords**(): `Coords`

Get a list of longitudes and latitudes on the grid (internal method)

#### Returns

`Coords`

#### Overrides

[Grid](Grid.md).[getCoords](Grid.md#getcoords)

#### Defined in

[RawField.ts:247](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L247)

___

### getThinnedGrid

▸ **getThinnedGrid**(`thin_x`, `thin_y`): [`PlateCarreeRotatedGrid`](PlateCarreeRotatedGrid.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `thin_x` | `number` |
| `thin_y` | `number` |

#### Returns

[`PlateCarreeRotatedGrid`](PlateCarreeRotatedGrid.md)

#### Overrides

[Grid](Grid.md).[getThinnedGrid](Grid.md#getthinnedgrid)

#### Defined in

[RawField.ts:258](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L258)

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

[RawField.ts:84](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L84)

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

[RawField.ts:80](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L80)

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

[RawField.ts:251](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L251)
