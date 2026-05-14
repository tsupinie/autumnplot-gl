---
title: ContourLabels
---

# Class: ContourLabels\<ArrayType, GridType, MapType\>

Defined in: [Contour.ts:299](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Contour.ts#L299)

Label the contours on a plot

## Example

```ts
// Contour some data
const contours = new Contour(height_field, {color: '#000000', interval: 30});
// Label the contours
const labels = new ContourLabels(contours, {text_color: '#ffffff', halo: true});
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

> **new ContourLabels**\<`ArrayType`, `GridType`, `MapType`\>(`contours`, `opts?`): `ContourLabels`\<`ArrayType`, `GridType`, `MapType`\>

Defined in: [Contour.ts:305](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Contour.ts#L305)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `contours` | [`Contour`](Contour.md)\<`ArrayType`, `GridType`, `MapType`\> |
| `opts?` | [`ContourLabelOptions`](../interfaces/ContourLabelOptions.md) |

#### Returns

`ContourLabels`\<`ArrayType`, `GridType`, `MapType`\>

#### Overrides

[`PlotComponent`](PlotComponent.md).[`constructor`](PlotComponent.md#constructor)

## Methods

### updateField()

> **updateField**(): `Promise`\<`void`\>

Defined in: [Contour.ts:318](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Contour.ts#L318)

Update contour labels when the field for the associated Contour object has been changed.

#### Returns

`Promise`\<`void`\>
