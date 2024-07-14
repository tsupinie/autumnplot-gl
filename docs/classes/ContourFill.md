[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / ContourFill

# Class: ContourFill\<ArrayType, MapType\>

A filled contoured field

## Example

```ts
// Create a field of filled contours with the provided color map
const fill = new ContourFill(wind_speed_field, {cmap: color_map});
```

## Extends

- `PlotComponentFill`\<`ArrayType`, `MapType`\>

## Type parameters

• **ArrayType** *extends* [`TypedArray`](../type-aliases/TypedArray.md)

• **MapType** *extends* [`MapLikeType`](../type-aliases/MapLikeType.md)

## Constructors

### new ContourFill()

> **new ContourFill**\<`ArrayType`, `MapType`\>(`field`, `opts`): [`ContourFill`](ContourFill.md)\<`ArrayType`, `MapType`\>

Create a filled contoured field

#### Parameters

• **field**: [`RawScalarField`](RawScalarField.md)\<`ArrayType`\>

The field to create filled contours from

• **opts**: [`ContourFillOptions`](../interfaces/ContourFillOptions.md)

Options for creating the filled contours

#### Returns

[`ContourFill`](ContourFill.md)\<`ArrayType`, `MapType`\>

#### Overrides

`PlotComponentFill<ArrayType, MapType>.constructor`

#### Source

[Fill.ts:219](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Fill.ts#L219)

## Properties

### cmap\_mag\_filter

> `protected` **cmap\_mag\_filter**: `null` \| `number`

#### Inherited from

`PlotComponentFill.cmap_mag_filter`

#### Source

[Fill.ts:65](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Fill.ts#L65)

***

### image\_mag\_filter

> `protected` **image\_mag\_filter**: `null` \| `number`

#### Inherited from

`PlotComponentFill.image_mag_filter`

#### Source

[Fill.ts:64](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Fill.ts#L64)

***

### opts

> `readonly` **opts**: `Required`\<[`ContourFillOptions`](../interfaces/ContourFillOptions.md)\>

#### Inherited from

`PlotComponentFill.opts`

#### Source

[Fill.ts:58](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Fill.ts#L58)

## Methods

### updateField()

> **updateField**(`field`): `Promise`\<`void`\>

Update the data displayed as filled contours

#### Parameters

• **field**: [`RawScalarField`](RawScalarField.md)\<`ArrayType`\>

The new field to display as filled contours

#### Returns

`Promise`\<`void`\>

#### Overrides

`PlotComponentFill.updateField`

#### Source

[Fill.ts:227](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Fill.ts#L227)
