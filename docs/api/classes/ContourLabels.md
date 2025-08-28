---
title: ContourLabels
---

# Class: ContourLabels\<ArrayType, GridType, MapType\>

Defined in: [Contour.ts:280](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Contour.ts#L280)

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

Defined in: [Contour.ts:286](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Contour.ts#L286)

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

Defined in: [Contour.ts:299](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Contour.ts#L299)

Update contour labels when the field for the associated Contour object has been changed.

#### Returns

`Promise`\<`void`\>
