[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / ContourLabels

# Class: ContourLabels\<ArrayType, MapType\>

## Extends

- [`PlotComponent`](PlotComponent.md)\<`MapType`\>

## Type parameters

• **ArrayType** *extends* [`TypedArray`](../type-aliases/TypedArray.md)

• **MapType** *extends* [`MapLikeType`](../type-aliases/MapLikeType.md)

## Constructors

### new ContourLabels()

> **new ContourLabels**\<`ArrayType`, `MapType`\>(`contours`, `opts`?): [`ContourLabels`](ContourLabels.md)\<`ArrayType`, `MapType`\>

#### Parameters

• **contours**: [`Contour`](Contour.md)\<`ArrayType`, `MapType`\>

• **opts?**: [`ContourLabelOptions`](../interfaces/ContourLabelOptions.md)

#### Returns

[`ContourLabels`](ContourLabels.md)\<`ArrayType`, `MapType`\>

#### Overrides

[`PlotComponent`](PlotComponent.md).[`constructor`](PlotComponent.md#constructors)

#### Source

[Contour.ts:265](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Contour.ts#L265)

## Methods

### updateField()

> **updateField**(): `Promise`\<`void`\>

Update contour labels when the field for the associated Contour object has been changed.

#### Returns

`Promise`\<`void`\>

#### Source

[Contour.ts:278](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/Contour.ts#L278)
