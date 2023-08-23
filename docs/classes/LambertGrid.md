[autumnplot-gl](../README.md) / [Exports](../modules.md) / LambertGrid

# Class: LambertGrid

A Lambert conformal conic grid with uniform grid spacing

## Hierarchy

- [`Grid`](Grid.md)

  ↳ **`LambertGrid`**

## Table of contents

### Constructors

- [constructor](LambertGrid.md#constructor)

### Properties

- [\_billboard\_buffer\_cache](LambertGrid.md#_billboard_buffer_cache)
- [\_buffer\_cache](LambertGrid.md#_buffer_cache)
- [\_ll\_cache](LambertGrid.md#_ll_cache)
- [is\_conformal](LambertGrid.md#is_conformal)
- [lat\_0](LambertGrid.md#lat_0)
- [lat\_std](LambertGrid.md#lat_std)
- [lcc](LambertGrid.md#lcc)
- [ll\_x](LambertGrid.md#ll_x)
- [ll\_y](LambertGrid.md#ll_y)
- [lon\_0](LambertGrid.md#lon_0)
- [ni](LambertGrid.md#ni)
- [nj](LambertGrid.md#nj)
- [type](LambertGrid.md#type)
- [ur\_x](LambertGrid.md#ur_x)
- [ur\_y](LambertGrid.md#ur_y)

### Methods

- [copy](LambertGrid.md#copy)
- [getCoords](LambertGrid.md#getcoords)
- [getThinnedGrid](LambertGrid.md#getthinnedgrid)
- [getWGLBillboardBuffers](LambertGrid.md#getwglbillboardbuffers)
- [getWGLBuffers](LambertGrid.md#getwglbuffers)
- [transform](LambertGrid.md#transform)

## Constructors

### constructor

• **new LambertGrid**(`ni`, `nj`, `lon_0`, `lat_0`, `lat_std`, `ll_x`, `ll_y`, `ur_x`, `ur_y`)

Create a Lambert conformal conic grid

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ni` | `number` | The number of grid points in the i (longitude) direction |
| `nj` | `number` | The number of grid points in the j (latitude) direction |
| `lon_0` | `number` | The standard longitude for the projection; this is also the center longitude for the projection |
| `lat_0` | `number` | The center latitude for the projection |
| `lat_std` | [`number`, `number`] | The standard latitudes for the projection |
| `ll_x` | `number` | The x coordinate in projection space of the lower-left corner of the grid |
| `ll_y` | `number` | The y coordinate in projection space of the lower-left corner of the grid |
| `ur_x` | `number` | The x coordinate in projection space of the upper-right corner of the grid |
| `ur_y` | `number` | The y coordinate in projection space of the upper-right corner of the grid |

#### Overrides

[Grid](Grid.md).[constructor](Grid.md#constructor)

#### Defined in

[RawField.ts:221](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L221)

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

[RawField.ts:207](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L207)

___

### is\_conformal

• `Readonly` **is\_conformal**: `boolean`

#### Inherited from

[Grid](Grid.md).[is_conformal](Grid.md#is_conformal)

#### Defined in

[RawField.ts:69](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L69)

___

### lat\_0

• `Readonly` **lat\_0**: `number`

#### Defined in

[RawField.ts:196](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L196)

___

### lat\_std

• `Readonly` **lat\_std**: [`number`, `number`]

#### Defined in

[RawField.ts:197](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L197)

___

### lcc

• `Readonly` `Private` **lcc**: (`a`: `number`, `b`: `number`, `opts?`: { `inverse`: `boolean`  }) => [`number`, `number`]

#### Type declaration

▸ (`a`, `b`, `opts?`): [`number`, `number`]

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `number` |
| `b` | `number` |
| `opts?` | `Object` |
| `opts.inverse` | `boolean` |

##### Returns

[`number`, `number`]

#### Defined in

[RawField.ts:204](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L204)

___

### ll\_x

• `Readonly` **ll\_x**: `number`

#### Defined in

[RawField.ts:198](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L198)

___

### ll\_y

• `Readonly` **ll\_y**: `number`

#### Defined in

[RawField.ts:199](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L199)

___

### lon\_0

• `Readonly` **lon\_0**: `number`

#### Defined in

[RawField.ts:195](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L195)

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

### ur\_x

• `Readonly` **ur\_x**: `number`

#### Defined in

[RawField.ts:200](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L200)

___

### ur\_y

• `Readonly` **ur\_y**: `number`

#### Defined in

[RawField.ts:201](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L201)

## Methods

### copy

▸ **copy**(`opts?`): [`LambertGrid`](LambertGrid.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | `Object` |
| `opts.ll_x?` | `number` |
| `opts.ll_y?` | `number` |
| `opts.ni?` | `number` |
| `opts.nj?` | `number` |
| `opts.ur_x?` | `number` |
| `opts.ur_y?` | `number` |

#### Returns

[`LambertGrid`](LambertGrid.md)

#### Overrides

[Grid](Grid.md).[copy](Grid.md#copy)

#### Defined in

[RawField.ts:254](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L254)

___

### getCoords

▸ **getCoords**(): `Coords`

Get a list of longitudes and latitudes on the grid (internal method)

#### Returns

`Coords`

#### Overrides

[Grid](Grid.md).[getCoords](Grid.md#getcoords)

#### Defined in

[RawField.ts:269](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L269)

___

### getThinnedGrid

▸ **getThinnedGrid**(`thin_x`, `thin_y`): [`LambertGrid`](LambertGrid.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `thin_x` | `number` |
| `thin_y` | `number` |

#### Returns

[`LambertGrid`](LambertGrid.md)

#### Overrides

[Grid](Grid.md).[getThinnedGrid](Grid.md#getthinnedgrid)

#### Defined in

[RawField.ts:280](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L280)

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

[RawField.ts:273](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L273)
