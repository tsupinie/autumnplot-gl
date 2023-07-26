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
- [profile\_field](Hodographs.md#profile_field)
- [sm\_line](Hodographs.md#sm_line)
- [thin\_fac](Hodographs.md#thin_fac)

### Methods

- [onAdd](Hodographs.md#onadd)
- [render](Hodographs.md#render)

## Constructors

### constructor

• **new Hodographs**(`profile_field`, `opts`)

Create a field of hodographs

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profile_field` | [`RawProfileField`](RawProfileField.md) | - |
| `opts` | `Object` | Various options to use when creating the hodographs |
| `opts.bgcolor` | `string` | - |
| `opts.thin_fac` | `number` | - |

#### Overrides

[PlotComponent](PlotComponent.md).[constructor](PlotComponent.md#constructor)

#### Defined in

[Hodographs.ts:106](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Hodographs.ts#L106)

## Properties

### bg\_billboard

• `Private` **bg\_billboard**: `BillboardCollection`

#### Defined in

[Hodographs.ts:95](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Hodographs.ts#L95)

___

### bgcolor

• `Readonly` **bgcolor**: [`number`, `number`, `number`]

#### Defined in

[Hodographs.ts:89](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Hodographs.ts#L89)

___

### hodo\_line

• `Private` **hodo\_line**: `PolylineCollection`

#### Defined in

[Hodographs.ts:97](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Hodographs.ts#L97)

___

### map

• `Private` **map**: `Map`

#### Defined in

[Hodographs.ts:93](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Hodographs.ts#L93)

___

### profile\_field

• `Readonly` **profile\_field**: [`RawProfileField`](RawProfileField.md)

#### Defined in

[Hodographs.ts:88](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Hodographs.ts#L88)

___

### sm\_line

• `Private` **sm\_line**: `PolylineCollection`

#### Defined in

[Hodographs.ts:99](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Hodographs.ts#L99)

___

### thin\_fac

• `Readonly` **thin\_fac**: `number`

#### Defined in

[Hodographs.ts:90](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Hodographs.ts#L90)

## Methods

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

[Hodographs.ts:121](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Hodographs.ts#L121)

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

[Hodographs.ts:177](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Hodographs.ts#L177)
