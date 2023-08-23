[autumnplot-gl](../README.md) / [Exports](../modules.md) / Grid

# Class: Grid

## Hierarchy

- **`Grid`**

  ↳ [`PlateCarreeGrid`](PlateCarreeGrid.md)

  ↳ [`LambertGrid`](LambertGrid.md)

## Table of contents

### Constructors

- [constructor](Grid.md#constructor)

### Properties

- [\_billboard\_buffer\_cache](Grid.md#_billboard_buffer_cache)
- [\_buffer\_cache](Grid.md#_buffer_cache)
- [is\_conformal](Grid.md#is_conformal)
- [ni](Grid.md#ni)
- [nj](Grid.md#nj)
- [type](Grid.md#type)

### Methods

- [copy](Grid.md#copy)
- [getCoords](Grid.md#getcoords)
- [getThinnedGrid](Grid.md#getthinnedgrid)
- [getWGLBillboardBuffers](Grid.md#getwglbillboardbuffers)
- [getWGLBuffers](Grid.md#getwglbuffers)
- [transform](Grid.md#transform)

## Constructors

### constructor

• **new Grid**(`type`, `is_conformal`, `ni`, `nj`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`GridType`](../modules.md#gridtype) |
| `is_conformal` | `boolean` |
| `ni` | `number` |
| `nj` | `number` |

#### Defined in

[RawField.ts:74](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L74)

## Properties

### \_billboard\_buffer\_cache

• `Readonly` **\_billboard\_buffer\_cache**: `Cache`<[[`WebGLAnyRenderingContext`](../modules.md#webglanyrenderingcontext), `number`, `number`], `Promise`<{ `texcoords`: `WGLBuffer` ; `vertices`: `WGLBuffer`  }\>\>

#### Defined in

[RawField.ts:72](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L72)

___

### \_buffer\_cache

• `Readonly` **\_buffer\_cache**: `Cache`<[[`WebGLAnyRenderingContext`](../modules.md#webglanyrenderingcontext)], `Promise`<{ `cellsize`: `WGLBuffer` ; `texcoords`: `WGLBuffer` ; `vertices`: `WGLBuffer`  }\>\>

#### Defined in

[RawField.ts:71](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L71)

___

### is\_conformal

• `Readonly` **is\_conformal**: `boolean`

#### Defined in

[RawField.ts:69](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L69)

___

### ni

• `Readonly` **ni**: `number`

#### Defined in

[RawField.ts:67](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L67)

___

### nj

• `Readonly` **nj**: `number`

#### Defined in

[RawField.ts:68](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L68)

___

### type

• `Readonly` **type**: [`GridType`](../modules.md#gridtype)

#### Defined in

[RawField.ts:66](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L66)

## Methods

### copy

▸ `Abstract` **copy**(`opts?`): [`Grid`](Grid.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | `Object` |
| `opts.ni?` | `number` |
| `opts.nj?` | `number` |

#### Returns

[`Grid`](Grid.md)

#### Defined in

[RawField.ts:91](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L91)

___

### getCoords

▸ `Abstract` **getCoords**(): `Coords`

#### Returns

`Coords`

#### Defined in

[RawField.ts:93](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L93)

___

### getThinnedGrid

▸ `Abstract` **getThinnedGrid**(`thin_x`, `thin_y`): [`Grid`](Grid.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `thin_x` | `number` |
| `thin_y` | `number` |

#### Returns

[`Grid`](Grid.md)

#### Defined in

[RawField.ts:95](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L95)

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

#### Defined in

[RawField.ts:97](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L97)

___

### transform

▸ `Abstract` **transform**(`x`, `y`, `opts?`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |
| `opts?` | `Object` |
| `opts.inverse?` | `boolean` |

#### Returns

[`number`, `number`]

#### Defined in

[RawField.ts:94](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/RawField.ts#L94)
