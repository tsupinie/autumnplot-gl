[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / Barbs

# Class: Barbs\<ArrayType, MapType\>

A class representing a field of wind barbs. The barbs are automatically thinned based on the zoom level on the map; the user only has to provide a
thinning factor at zoom level 1.

## Example

```ts
// Create a barb field with black barbs and plotting every 16th wind barb in both i and j at zoom level 1
const vector_field = new RawVectorField(grid, u_data, v_data);
const barbs = new Barbs(vector_field, {color: '#000000', thin_fac: 16});
```

## Extends

- [`PlotComponent`](PlotComponent.md)\<`MapType`\>

## Type parameters

• **ArrayType** *extends* [`TypedArray`](../type-aliases/TypedArray.md)

• **MapType** *extends* [`MapLikeType`](../type-aliases/MapLikeType.md)

## Constructors

### new Barbs()

> **new Barbs**\<`ArrayType`, `MapType`\>(`fields`, `opts`): [`Barbs`](Barbs.md)\<`ArrayType`, `MapType`\>

Create a field of wind barbs

#### Parameters

• **fields**: [`RawVectorField`](RawVectorField.md)\<`ArrayType`\>

The vector field to plot as barbs

• **opts**: [`BarbsOptions`](../interfaces/BarbsOptions.md)

Options for creating the wind barbs

#### Returns

[`Barbs`](Barbs.md)\<`ArrayType`, `MapType`\>

#### Overrides

[`PlotComponent`](PlotComponent.md).[`constructor`](PlotComponent.md#constructors)

#### Source

[Barbs.ts:196](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Barbs.ts#L196)

## Properties

### opts

> `readonly` **opts**: `Required`\<[`BarbsOptions`](../interfaces/BarbsOptions.md)\>

#### Source

[Barbs.ts:185](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Barbs.ts#L185)

## Methods

### updateField()

> **updateField**(`fields`): `Promise`\<`void`\>

Update the field displayed as barbs

#### Parameters

• **fields**: [`RawVectorField`](RawVectorField.md)\<`ArrayType`\>

The new field to display as barbs

#### Returns

`Promise`\<`void`\>

#### Source

[Barbs.ts:212](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Barbs.ts#L212)
