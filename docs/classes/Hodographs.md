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
- [thin\_fac](Hodographs.md#thin_fac)

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

[Hodographs.ts:122](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Hodographs.ts#L122)

## Properties

### bgcolor

• `Readonly` **bgcolor**: [`number`, `number`, `number`]

#### Defined in

[Hodographs.ts:112](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Hodographs.ts#L112)

___

### thin\_fac

• `Readonly` **thin\_fac**: `number`

#### Defined in

[Hodographs.ts:113](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Hodographs.ts#L113)
