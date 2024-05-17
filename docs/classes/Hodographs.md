[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / Hodographs

# Class: Hodographs\<MapType\>

A class representing a a field of hodograph plots

## Extends

- [`PlotComponent`](PlotComponent.md)\<`MapType`\>

## Type parameters

• **MapType** *extends* [`MapLikeType`](../type-aliases/MapLikeType.md)

## Constructors

### new Hodographs()

> **new Hodographs**\<`MapType`\>(`profile_field`, `opts`?): [`Hodographs`](Hodographs.md)\<`MapType`\>

Create a field of hodographs

#### Parameters

• **profile\_field**: [`RawProfileField`](RawProfileField.md)

The grid of profiles to plot

• **opts?**: [`HodographOptions`](../interfaces/HodographOptions.md)

Various options to use when creating the hodographs

#### Returns

[`Hodographs`](Hodographs.md)\<`MapType`\>

#### Overrides

[`PlotComponent`](PlotComponent.md).[`constructor`](PlotComponent.md#constructors)

#### Source

[Hodographs.ts:97](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Hodographs.ts#L97)

## Properties

### bgcolor

> `readonly` **bgcolor**: `string`

#### Source

[Hodographs.ts:84](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Hodographs.ts#L84)

***

### thin\_fac

> `readonly` **thin\_fac**: `number`

#### Source

[Hodographs.ts:85](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Hodographs.ts#L85)

## Methods

### updateField()

> **updateField**(`field`): `Promise`\<`void`\>

Update the profiles displayed

#### Parameters

• **field**: [`RawProfileField`](RawProfileField.md)

The new profiles to display as hodographs

#### Returns

`Promise`\<`void`\>

#### Source

[Hodographs.ts:118](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Hodographs.ts#L118)
