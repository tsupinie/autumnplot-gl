[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / Paintball

# Class: Paintball\<ArrayType, MapType\>

A class representing a paintball plot, which is a plot of objects in every member of an ensemble. Objects are usually defined by a single threshold on
a field (such as simulated reflectivity greater than 40 dBZ), but could in theory be defined by any arbitrarily complicated method. In autumnplot-gl,
the data for the paintball plot is given as a single field with the objects from each member encoded as "bits" in the field. Because the field is made up
of single-precision floats, this works for up to 24 members. (Technically speaking, I don't need the quotes around "bits", as they're bits of the 
significand of an IEEE 754 float.)

## Extends

- [`PlotComponent`](PlotComponent.md)\<`MapType`\>

## Type parameters

• **ArrayType** *extends* [`TypedArray`](../type-aliases/TypedArray.md)

• **MapType** *extends* [`MapLikeType`](../type-aliases/MapLikeType.md)

## Constructors

### new Paintball()

> **new Paintball**\<`ArrayType`, `MapType`\>(`field`, `opts`?): [`Paintball`](Paintball.md)\<`ArrayType`, `MapType`\>

Create a paintball plot

#### Parameters

• **field**: [`RawScalarField`](RawScalarField.md)\<`ArrayType`\>

A scalar field containing the member objects encoded as "bits." The numerical value of each grid point can be constructed like 
              `1.0 * M1 + 2.0 * M2 + 4.0 * M3 + 8.0 * M4 ...`, where `M1` is 1 if that grid point is in an object in member 1 and 0 otherwise,
              `M2` is the same thing for member 2, and `M3` and `M4` and up to `Mn` are the same thing for the rest of the members.

• **opts?**: [`PaintballOptions`](../interfaces/PaintballOptions.md)

Options for creating the paintball plot

#### Returns

[`Paintball`](Paintball.md)\<`ArrayType`, `MapType`\>

#### Overrides

[`PlotComponent`](PlotComponent.md).[`constructor`](PlotComponent.md#constructors)

#### Source

[Paintball.ts:60](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Paintball.ts#L60)

## Properties

### opts

> `readonly` **opts**: `Required`\<[`PaintballOptions`](../interfaces/PaintballOptions.md)\>

#### Source

[Paintball.ts:47](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Paintball.ts#L47)

## Methods

### updateField()

> **updateField**(`field`): `Promise`\<`void`\>

Update the field displayed as a paintball plot

#### Parameters

• **field**: [`RawScalarField`](RawScalarField.md)\<`ArrayType`\>

The new field to display as a paintball plot

#### Returns

`Promise`\<`void`\>

#### Source

[Paintball.ts:76](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Paintball.ts#L76)
