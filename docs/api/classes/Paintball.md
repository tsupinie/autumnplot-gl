---
title: Paintball
---

# Class: Paintball\<ArrayType, GridType, MapType\>

Defined in: [Paintball.ts:48](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Paintball.ts#L48)

A class representing a paintball plot, which is a plot of objects in every member of an ensemble. Objects are usually defined by a single threshold on
a field (such as simulated reflectivity greater than 40 dBZ), but could in theory be defined by any arbitrarily complicated method. In autumnplot-gl,
the data for the paintball plot is given as a single field with the objects from each member encoded as "bits" in the field. Because the field is made up
of single-precision floats, this works for up to 24 members. (Technically speaking, I don't need the quotes around "bits", as they're bits of the 
significand of an IEEE 754 float.)

## Extends

- [`PlotComponent`](PlotComponent.md)\<`MapType`\>

## Type Parameters

| Type Parameter |
| ------ |
| `ArrayType` *extends* [`TypedArray`](../type-aliases/TypedArray.md) |
| `GridType` *extends* [`StructuredGrid`](StructuredGrid.md) |
| `MapType` *extends* [`MapLikeType`](../type-aliases/MapLikeType.md) |

## Constructors

### Constructor

> **new Paintball**\<`ArrayType`, `GridType`, `MapType`\>(`field`, `opts?`): `Paintball`\<`ArrayType`, `GridType`, `MapType`\>

Defined in: [Paintball.ts:63](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Paintball.ts#L63)

Create a paintball plot

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`RawScalarField`](RawScalarField.md)\<`ArrayType`, `GridType`\> | A scalar field containing the member objects encoded as "bits." The numerical value of each grid point can be constructed like `1.0 * M1 + 2.0 * M2 + 4.0 * M3 + 8.0 * M4 ...`, where `M1` is 1 if that grid point is in an object in member 1 and 0 otherwise, `M2` is the same thing for member 2, and `M3` and `M4` and up to `Mn` are the same thing for the rest of the members. |
| `opts?` | [`PaintballOptions`](../interfaces/PaintballOptions.md) | Options for creating the paintball plot |

#### Returns

`Paintball`\<`ArrayType`, `GridType`, `MapType`\>

#### Overrides

[`PlotComponent`](PlotComponent.md).[`constructor`](PlotComponent.md#constructor)

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="opts"></a> `opts` | `readonly` | `Required`\<[`PaintballOptions`](../interfaces/PaintballOptions.md)\> | [Paintball.ts:50](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Paintball.ts#L50) |

## Methods

### updateField()

> **updateField**(`field`): `Promise`\<`void`\>

Defined in: [Paintball.ts:79](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Paintball.ts#L79)

Update the field displayed as a paintball plot

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`RawScalarField`](RawScalarField.md)\<`ArrayType`, `GridType`\> | The new field to display as a paintball plot |

#### Returns

`Promise`\<`void`\>
