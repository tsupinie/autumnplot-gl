---
title: Barbs
---

# Class: Barbs\<ArrayType, GridType, MapType\>

Defined in: [Barbs.ts:184](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Barbs.ts#L184)

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

## Type Parameters

| Type Parameter |
| ------ |
| `ArrayType` *extends* [`TypedArray`](../type-aliases/TypedArray.md) |
| `GridType` *extends* [`Grid`](Grid.md) |
| `MapType` *extends* [`MapLikeType`](../type-aliases/MapLikeType.md) |

## Constructors

### Constructor

> **new Barbs**\<`ArrayType`, `GridType`, `MapType`\>(`fields`, `opts`): `Barbs`\<`ArrayType`, `GridType`, `MapType`\>

Defined in: [Barbs.ts:198](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Barbs.ts#L198)

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
| <a id="opts"></a> `opts` | `readonly` | `Required`\<[`BarbsOptions`](../interfaces/BarbsOptions.md)\> | [Barbs.ts:187](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Barbs.ts#L187) |

## Methods

### updateField()

> **updateField**(`fields`): `Promise`\<`void`\>

Defined in: [Barbs.ts:214](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Barbs.ts#L214)

Update the field displayed as barbs

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fields` | [`RawVectorField`](RawVectorField.md)\<`ArrayType`, `GridType`\> | The new field to display as barbs |

#### Returns

`Promise`\<`void`\>
