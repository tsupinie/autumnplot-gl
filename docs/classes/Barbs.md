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

[Barbs.ts:168](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Barbs.ts#L168)

## Properties

### color

> `readonly` **color**: [`number`, `number`, `number`]

#### Source

[Barbs.ts:158](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Barbs.ts#L158)

***

### thin\_fac

> `readonly` **thin\_fac**: `number`

#### Source

[Barbs.ts:159](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Barbs.ts#L159)

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

[Barbs.ts:184](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Barbs.ts#L184)
