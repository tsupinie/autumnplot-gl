---
title: Barbs
---

# Class: Barbs\<ArrayType, GridType, MapType\>

Defined in: [Barbs.ts:193](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Barbs.ts#L193)

A class representing a field of wind barbs. The barbs are automatically thinned based on the zoom level on the map; the user only has to provide a
thinning factor at zoom level 1.

## Grid Compatibility
- :white_check_mark: `PlateCarreeGrid`
- :white_check_mark: `PlateCarreeRotatedGrid`
- :white_check_mark: `LambertGrid`
- :white_check_mark: `UnstructuredGrid`
- :x:                `RadarSweepGrid`
- :x:                `Geostationary`

## Example

```ts
// Create a barb field with black barbs and plotting every 16th wind barb in both i and j at zoom level 1
const vector_field = new RawVectorField(grid, u_data, v_data);
const barbs = new Barbs(vector_field, {color: '#000000', thin_fac: 16});
```

## Extends

- [`PlotComponent`](PlotComponent.md)\<`MapType`\>

## Type Parameters

| Type Parameter |
| ------ |
| `ArrayType` *extends* [`TypedArray`](../type-aliases/TypedArray.md) |
| `GridType` *extends* [`AutoZoomGrid`](../type-aliases/AutoZoomGrid.md) |
| `MapType` *extends* [`MapLikeType`](../type-aliases/MapLikeType.md) |

## Constructors

### Constructor

> **new Barbs**\<`ArrayType`, `GridType`, `MapType`\>(`fields`, `opts`): `Barbs`\<`ArrayType`, `GridType`, `MapType`\>

Defined in: [Barbs.ts:207](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Barbs.ts#L207)

Create a field of wind barbs

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fields` | [`RawVectorField`](RawVectorField.md)\<`ArrayType`, `GridType`\> | The vector field to plot as barbs |
| `opts` | [`BarbsOptions`](../interfaces/BarbsOptions.md) | Options for creating the wind barbs |

#### Returns

`Barbs`\<`ArrayType`, `GridType`, `MapType`\>

#### Overrides

[`PlotComponent`](PlotComponent.md).[`constructor`](PlotComponent.md#constructor)

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="opts"></a> `opts` | `readonly` | `Required`\<[`BarbsOptions`](../interfaces/BarbsOptions.md)\> | [Barbs.ts:196](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Barbs.ts#L196) |

## Methods

### updateField()

> **updateField**(`fields`): `Promise`\<`void`\>

Defined in: [Barbs.ts:223](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Barbs.ts#L223)

Update the field displayed as barbs

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fields` | [`RawVectorField`](RawVectorField.md)\<`ArrayType`, `GridType`\> | The new field to display as barbs |

#### Returns

`Promise`\<`void`\>
