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

[RawField.ts:107](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L107)

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

[RawField.ts:92](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L92)

___

### ll\_lon

• `Readonly` **ll\_lon**: `number`

#### Defined in

[RawField.ts:91](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L91)

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

[RawField.ts:94](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L94)

___

### ur\_lon

• `Readonly` **ur\_lon**: `number`

#### Defined in

[RawField.ts:93](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L93)

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

[RawField.ts:135](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L135)

___

### getCoords

▸ **getCoords**(): `Coords`

Get a list of longitudes and latitudes on the grid (internal method)

#### Returns

`Coords`

#### Overrides

[Grid](Grid.md).[getCoords](Grid.md#getcoords)

#### Defined in

[RawField.ts:150](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L150)

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

[RawField.ts:158](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L158)

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

[RawField.ts:154](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L154)