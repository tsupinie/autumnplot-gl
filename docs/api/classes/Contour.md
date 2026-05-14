---
title: Contour
---

# Class: Contour\<ArrayType, GridType, MapType\>

Defined in: [Contour.ts:95](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Contour.ts#L95)

A field of contoured data.

 ## Grid Compatibility
- :white_check_mark: `PlateCarreeGrid`
- :white_check_mark: `PlateCarreeRotatedGrid`
- :white_check_mark: `LambertGrid`
- :x:                `UnstructuredGrid`
- :white_check_mark: `RadarSweepGrid`
- :white_check_mark: `Geostationary`

## Example

```ts
// Create a contoured height field, with black contours every 30 m (assuming the height field is in 
// meters).
const contours = new Contour(height_field, {color: '#000000', interval: 30});
```

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

> **new Contour**\<`ArrayType`, `GridType`, `MapType`\>(`field`, `opts`): `Contour`\<`ArrayType`, `GridType`, `MapType`\>

Defined in: [Contour.ts:107](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Contour.ts#L107)

Create a contoured field

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`RawScalarField`](RawScalarField.md)\<`ArrayType`, `GridType`\> | The field to contour |
| `opts` | [`ContourOptions`](../interfaces/ContourOptions.md) | Options for creating the contours |

#### Returns

`Contour`\<`ArrayType`, `GridType`, `MapType`\>

#### Overrides

[`PlotComponent`](PlotComponent.md).[`constructor`](PlotComponent.md#constructor)

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="opts"></a> `opts` | `readonly` | `Required`\<[`ContourOptions`](../interfaces/ContourOptions.md)\> | [Contour.ts:97](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Contour.ts#L97) |

## Methods

### getContours()

> **getContours**(): `Promise`\<[`ContourData`](../type-aliases/ContourData.md)\>

Defined in: [Contour.ts:180](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Contour.ts#L180)

#### Returns

`Promise`\<[`ContourData`](../type-aliases/ContourData.md)\>

***

### updateField()

> **updateField**(`field`): `Promise`\<`void`\>

Defined in: [Contour.ts:121](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Contour.ts#L121)

Update the data displayed as contours

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`RawScalarField`](RawScalarField.md)\<`ArrayType`, `GridType`\> | The new field to contour |

#### Returns

`Promise`\<`void`\>
