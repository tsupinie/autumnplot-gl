[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / Raster

# Class: Raster\<ArrayType, MapType\>

A raster (i.e. pixel) plot

## Example

```ts
// Create a raster plot with the provided color map
const raster = new Raster(wind_speed_field, {cmap: color_map});
```

## Extends

- `PlotComponentFill`\<`ArrayType`, `MapType`\>

## Type parameters

• **ArrayType** *extends* [`TypedArray`](../type-aliases/TypedArray.md)

• **MapType** *extends* [`MapLikeType`](../type-aliases/MapLikeType.md)

## Constructors

### new Raster()

> **new Raster**\<`ArrayType`, `MapType`\>(`field`, `opts`): [`Raster`](Raster.md)\<`ArrayType`, `MapType`\>

Create a raster plot

#### Parameters

• **field**: [`RawScalarField`](RawScalarField.md)\<`ArrayType`\>

The field to create the raster plot from

• **opts**: [`RasterOptions`](../interfaces/RasterOptions.md)

Options for creating the raster plot

#### Returns

[`Raster`](Raster.md)\<`ArrayType`, `MapType`\>

#### Overrides

`PlotComponentFill<ArrayType, MapType>.constructor`

#### Source

[Fill.ts:175](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Fill.ts#L175)

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

Update the data displayed as a raster plot

#### Parameters

• **field**: [`RawScalarField`](RawScalarField.md)\<`ArrayType`\>

The new field to display as a raster plot

#### Returns

`Promise`\<`void`\>

#### Overrides

`PlotComponentFill.updateField`

#### Source

[Fill.ts:183](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Fill.ts#L183)
