[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / Contour

# Class: Contour\<ArrayType, MapType\>

A field of contoured data.

## Example

```ts
// Create a contoured height field, with black contours every 30 m (assuming the height field is in 
// meters).
const contours = new Contour(height_field, {color: '#000000', interval: 30});
```

## Extends

- [`PlotComponent`](PlotComponent.md)\<`MapType`\>

## Type parameters

• **ArrayType** *extends* [`TypedArray`](../type-aliases/TypedArray.md)

• **MapType** *extends* [`MapLikeType`](../type-aliases/MapLikeType.md)

## Constructors

### new Contour()

> **new Contour**\<`ArrayType`, `MapType`\>(`field`, `opts`): [`Contour`](Contour.md)\<`ArrayType`, `MapType`\>

Create a contoured field

#### Parameters

• **field**: [`RawScalarField`](RawScalarField.md)\<`ArrayType`\>

The field to contour

• **opts**: [`ContourOptions`](../interfaces/ContourOptions.md)

Options for creating the contours

#### Returns

[`Contour`](Contour.md)\<`ArrayType`, `MapType`\>

#### Overrides

[`PlotComponent`](PlotComponent.md).[`constructor`](PlotComponent.md#constructors)

#### Source

[Contour.ts:89](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Contour.ts#L89)

## Properties

### opts

> `readonly` **opts**: `Required`\<[`ContourOptions`](../interfaces/ContourOptions.md)\>

#### Source

[Contour.ts:79](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Contour.ts#L79)

## Methods

### getContours()

> **getContours**(): `Promise`\<[`ContourData`](../type-aliases/ContourData.md)\>

#### Returns

`Promise`\<[`ContourData`](../type-aliases/ContourData.md)\>

#### Source

[Contour.ts:162](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Contour.ts#L162)

***

### updateField()

> **updateField**(`field`): `Promise`\<`void`\>

Update the data displayed as contours

#### Parameters

• **field**: [`RawScalarField`](RawScalarField.md)\<`ArrayType`\>

The new field to contour

#### Returns

`Promise`\<`void`\>

#### Source

[Contour.ts:103](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Contour.ts#L103)
