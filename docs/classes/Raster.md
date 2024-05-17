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

[Fill.ts:181](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Fill.ts#L181)

## Properties

### cmap

> `readonly` **cmap**: [`ColorMap`](ColorMap.md)

#### Inherited from

`PlotComponentFill.cmap`

#### Source

[Fill.ts:49](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Fill.ts#L49)

***

### cmap\_mag\_filter

> `protected` **cmap\_mag\_filter**: `number`

#### Inherited from

`PlotComponentFill.cmap_mag_filter`

#### Source

[Fill.ts:58](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Fill.ts#L58)

***

### image\_mag\_filter

> `protected` **image\_mag\_filter**: `number`

#### Inherited from

`PlotComponentFill.image_mag_filter`

#### Source

[Fill.ts:57](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Fill.ts#L57)

***

### opacity

> `readonly` **opacity**: `number`

#### Inherited from

`PlotComponentFill.opacity`

#### Source

[Fill.ts:50](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Fill.ts#L50)

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

[Fill.ts:189](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Fill.ts#L189)
