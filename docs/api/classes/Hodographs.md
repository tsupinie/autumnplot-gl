---
title: Hodographs
---

# Class: Hodographs\<GridType, MapType\>

Defined in: [Hodographs.ts:133](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Hodographs.ts#L133)

A class representing a field of hodograph plots 

## Grid Compatibility
- :white_check_mark: `PlateCarreeGrid`
- :white_check_mark: `PlateCarreeRotatedGrid`
- :white_check_mark: `LambertGrid`
- :white_check_mark: `UnstructuredGrid`
- :x:                `RadarSweepGrid`
- :x:                `Geostationary`

## Extends

- [`PlotComponent`](PlotComponent.md)\<`MapType`\>

## Type Parameters

| Type Parameter |
| ------ |
| `GridType` *extends* [`AutoZoomGrid`](../type-aliases/AutoZoomGrid.md) |
| `MapType` *extends* [`MapLikeType`](../type-aliases/MapLikeType.md) |

## Constructors

### Constructor

> **new Hodographs**\<`GridType`, `MapType`\>(`profile_field`, `opts?`): `Hodographs`\<`GridType`, `MapType`\>

Defined in: [Hodographs.ts:148](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Hodographs.ts#L148)

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
| <a id="opts"></a> `opts` | `readonly` | `Required`\<[`HodographOptions`](../interfaces/HodographOptions.md)\> | [Hodographs.ts:135](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Hodographs.ts#L135) |

## Methods

### updateField()

> **updateField**(`field`): `Promise`\<`void`\>

Defined in: [Hodographs.ts:166](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Hodographs.ts#L166)

Update the profiles displayed

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`RawProfileField`](RawProfileField.md)\<`GridType`\> | The new profiles to display as hodographs |

#### Returns

`Promise`\<`void`\>
