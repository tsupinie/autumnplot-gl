---
title: Hodographs
---

# Class: Hodographs\<GridType, MapType\>

Defined in: [Hodographs.ts:122](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Hodographs.ts#L122)

A class representing a field of hodograph plots

## Extends

- [`PlotComponent`](PlotComponent.md)\<`MapType`\>

## Type Parameters

| Type Parameter |
| ------ |
| `GridType` *extends* [`Grid`](Grid.md) |
| `MapType` *extends* [`MapLikeType`](../type-aliases/MapLikeType.md) |

## Constructors

### Constructor

> **new Hodographs**\<`GridType`, `MapType`\>(`profile_field`, `opts?`): `Hodographs`\<`GridType`, `MapType`\>

Defined in: [Hodographs.ts:137](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Hodographs.ts#L137)

Create a field of hodographs

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `profile_field` | [`RawProfileField`](RawProfileField.md)\<`GridType`\> | The grid of profiles to plot |
| `opts?` | [`HodographOptions`](../interfaces/HodographOptions.md) | Various options to use when creating the hodographs |

#### Returns

`Hodographs`\<`GridType`, `MapType`\>

#### Overrides

[`PlotComponent`](PlotComponent.md).[`constructor`](PlotComponent.md#constructor)

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="opts"></a> `opts` | `readonly` | `Required`\<[`HodographOptions`](../interfaces/HodographOptions.md)\> | [Hodographs.ts:124](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Hodographs.ts#L124) |

## Methods

### updateField()

> **updateField**(`field`): `Promise`\<`void`\>

Defined in: [Hodographs.ts:155](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Hodographs.ts#L155)

Update the profiles displayed

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`RawProfileField`](RawProfileField.md)\<`GridType`\> | The new profiles to display as hodographs |

#### Returns

`Promise`\<`void`\>
