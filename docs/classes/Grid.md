[autumnplot-gl](../README.md) / [Exports](../modules.md) / Grid

# Class: Grid

## Hierarchy

- **`Grid`**

  ↳ [`PlateCarreeGrid`](PlateCarreeGrid.md)

  ↳ [`PlateCarreeRotatedGrid`](PlateCarreeRotatedGrid.md)

  ↳ [`LambertGrid`](LambertGrid.md)

## Table of contents

### Constructors

- [constructor](Grid.md#constructor)

### Properties

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

[RawField.ts:57](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L57)

## Properties

### is\_conformal

• `Readonly` **is\_conformal**: `boolean`

#### Defined in

[RawField.ts:52](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L52)

___

### ni

• `Readonly` **ni**: `number`

#### Defined in

[RawField.ts:50](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L50)

___

### nj

• `Readonly` **nj**: `number`

#### Defined in

[RawField.ts:51](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L51)

___

### type

• `Readonly` **type**: [`GridType`](../modules.md#gridtype)

#### Defined in

[RawField.ts:49](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L49)

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

[RawField.ts:74](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L74)

___

### getCoords

▸ `Abstract` **getCoords**(): `Coords`

#### Returns

`Coords`

#### Defined in

[RawField.ts:76](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L76)

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

[RawField.ts:78](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L78)

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

#### Defined in

[RawField.ts:80](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L80)

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

[RawField.ts:77](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L77)
