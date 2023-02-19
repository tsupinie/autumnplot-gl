[autumnplot-gl](../README.md) / [Exports](../modules.md) / Hodographs

# Class: Hodographs

A class representing a a field of hodograph plots

## Hierarchy

- [`PlotComponent`](PlotComponent.md)

  ↳ **`Hodographs`**

## Table of contents

### Constructors

- [constructor](Hodographs.md#constructor)

### Properties

- [bg\_billboard](Hodographs.md#bg_billboard)
- [bgcolor](Hodographs.md#bgcolor)
- [hodo\_line](Hodographs.md#hodo_line)
- [map](Hodographs.md#map)
- [profiles](Hodographs.md#profiles)
- [sm\_line](Hodographs.md#sm_line)
- [thin\_fac](Hodographs.md#thin_fac)

### Methods

- [\_getHodoBackgroundElements](Hodographs.md#_gethodobackgroundelements)
- [onAdd](Hodographs.md#onadd)
- [render](Hodographs.md#render)

## Constructors

### constructor

• **new Hodographs**(`profiles`, `opts`)

Create a field of hodographs

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profiles` | [`WindProfile`](../interfaces/WindProfile.md)[] | A list of profiles to use |
| `opts` | `Object` | Various options to use when creating the hodographs |
| `opts.bgcolor` | `string` | - |
| `opts.thin_fac` | `number` | - |

#### Overrides

[PlotComponent](PlotComponent.md).[constructor](PlotComponent.md#constructor)

#### Defined in

[Hodographs.ts:98](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Hodographs.ts#L98)

## Properties

### bg\_billboard

• `Private` **bg\_billboard**: `BillboardCollection`

#### Defined in

[Hodographs.ts:87](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Hodographs.ts#L87)

___

### bgcolor

• `Readonly` **bgcolor**: [`number`, `number`, `number`]

#### Defined in

[Hodographs.ts:81](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Hodographs.ts#L81)

___

### hodo\_line

• `Private` **hodo\_line**: `PolylineCollection`

#### Defined in

[Hodographs.ts:89](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Hodographs.ts#L89)

___

### map

• `Private` **map**: `Map`

#### Defined in

[Hodographs.ts:85](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Hodographs.ts#L85)

___

### profiles

• `Readonly` **profiles**: [`WindProfile`](../interfaces/WindProfile.md)[]

#### Defined in

[Hodographs.ts:80](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Hodographs.ts#L80)

___

### sm\_line

• `Private` **sm\_line**: `PolylineCollection`

#### Defined in

[Hodographs.ts:91](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Hodographs.ts#L91)

___

### thin\_fac

• `Readonly` **thin\_fac**: `number`

#### Defined in

[Hodographs.ts:82](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Hodographs.ts#L82)

## Methods

### \_getHodoBackgroundElements

▸ **_getHodoBackgroundElements**(): `BillboardSpec`

#### Returns

`BillboardSpec`

#### Defined in

[Hodographs.ts:182](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Hodographs.ts#L182)

___

### onAdd

▸ **onAdd**(`map`, `gl`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map` |
| `gl` | `WebGLRenderingContext` |

#### Returns

`Promise`<`void`\>

#### Overrides

[PlotComponent](PlotComponent.md).[onAdd](PlotComponent.md#onadd)

#### Defined in

[Hodographs.ts:113](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Hodographs.ts#L113)

___

### render

▸ **render**(`gl`, `matrix`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `matrix` | `number`[] |

#### Returns

`void`

#### Overrides

[PlotComponent](PlotComponent.md).[render](PlotComponent.md#render)

#### Defined in

[Hodographs.ts:168](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Hodographs.ts#L168)
