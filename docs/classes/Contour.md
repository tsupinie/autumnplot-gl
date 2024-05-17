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

[Contour.ts:59](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Contour.ts#L59)

## Properties

### color

> `readonly` **color**: `string`

#### Source

[Contour.ts:47](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Contour.ts#L47)

***

### interval

> `readonly` **interval**: `number`

#### Source

[Contour.ts:48](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Contour.ts#L48)

***

### levels

> `readonly` **levels**: `number`[]

#### Source

[Contour.ts:49](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Contour.ts#L49)

## Methods

### getContours()

> **getContours**(): `Promise`\<[`ContourData`](../type-aliases/ContourData.md)\>

#### Returns

`Promise`\<[`ContourData`](../type-aliases/ContourData.md)\>

#### Source

[Contour.ts:92](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Contour.ts#L92)

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

[Contour.ts:77](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Contour.ts#L77)
