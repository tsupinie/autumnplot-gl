[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / Hodographs

# Class: Hodographs\<MapType\>

A class representing a field of hodograph plots

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

[Hodographs.ts:103](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Hodographs.ts#L103)

## Properties

### opts

> `readonly` **opts**: `Required`\<[`HodographOptions`](../interfaces/HodographOptions.md)\>

#### Source

[Hodographs.ts:91](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Hodographs.ts#L91)

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

[Hodographs.ts:120](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Hodographs.ts#L120)
