---
title: Contour
---

# Class: Contour\<ArrayType, GridType, MapType\>

Defined in: [Contour.ts:85](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Contour.ts#L85)

A field of contoured data.

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

Defined in: [Contour.ts:97](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Contour.ts#L97)

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
| <a id="opts"></a> `opts` | `readonly` | `Required`\<[`ContourOptions`](../interfaces/ContourOptions.md)\> | [Contour.ts:87](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Contour.ts#L87) |

## Methods

### getContours()

> **getContours**(): `Promise`\<[`ContourData`](../type-aliases/ContourData.md)\>

Defined in: [Contour.ts:170](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Contour.ts#L170)

#### Returns

`Promise`\<[`ContourData`](../type-aliases/ContourData.md)\>

***

### updateField()

> **updateField**(`field`): `Promise`\<`void`\>

Defined in: [Contour.ts:111](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Contour.ts#L111)

Update the data displayed as contours

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`RawScalarField`](RawScalarField.md)\<`ArrayType`, `GridType`\> | The new field to contour |

#### Returns

`Promise`\<`void`\>
