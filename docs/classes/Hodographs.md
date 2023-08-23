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

- [bgcolor](Hodographs.md#bgcolor)
- [gl\_elems](Hodographs.md#gl_elems)
- [profile\_field](Hodographs.md#profile_field)
- [thin\_fac](Hodographs.md#thin_fac)

### Methods

- [onAdd](Hodographs.md#onadd)
- [render](Hodographs.md#render)

## Constructors

### constructor

• **new Hodographs**(`profile_field`, `opts?`)

Create a field of hodographs

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profile_field` | [`RawProfileField`](RawProfileField.md) | The grid of profiles to plot |
| `opts?` | [`HodographOptions`](../interfaces/HodographOptions.md) | Various options to use when creating the hodographs |

#### Overrides

[PlotComponent](PlotComponent.md).[constructor](PlotComponent.md#constructor)

#### Defined in

[Hodographs.ts:122](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Hodographs.ts#L122)

## Properties

### bgcolor

• `Readonly` **bgcolor**: [`number`, `number`, `number`]

#### Defined in

[Hodographs.ts:111](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Hodographs.ts#L111)

___

### gl\_elems

• `Private` **gl\_elems**: `HodographGLElems`

#### Defined in

[Hodographs.ts:115](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Hodographs.ts#L115)

___

### profile\_field

• `Readonly` **profile\_field**: [`RawProfileField`](RawProfileField.md)

#### Defined in

[Hodographs.ts:110](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Hodographs.ts#L110)

___

### thin\_fac

• `Readonly` **thin\_fac**: `number`

#### Defined in

[Hodographs.ts:112](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Hodographs.ts#L112)

## Methods

### onAdd

▸ **onAdd**(`map`, `gl`): `Promise`<`void`\>

Add the hodographs to a map

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map` |
| `gl` | `WebGLAnyRenderingContext` |

#### Returns

`Promise`<`void`\>

#### Overrides

[PlotComponent](PlotComponent.md).[onAdd](PlotComponent.md#onadd)

#### Defined in

[Hodographs.ts:140](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Hodographs.ts#L140)

___

### render

▸ **render**(`gl`, `matrix`): `void`

Render the hodographs

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLAnyRenderingContext` |
| `matrix` | `number`[] |

#### Returns

`void`

#### Overrides

[PlotComponent](PlotComponent.md).[render](PlotComponent.md#render)

#### Defined in

[Hodographs.ts:210](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Hodographs.ts#L210)
