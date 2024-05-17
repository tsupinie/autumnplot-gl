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

[Fill.ts:225](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Fill.ts#L225)

## Properties

### cmap

> `readonly` **cmap**: [`ColorMap`](ColorMap.md)

#### Inherited from

`PlotComponentFill.cmap`

#### Source

[Fill.ts:49](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Fill.ts#L49)

***

### cmap\_mag\_filter

> `protected` **cmap\_mag\_filter**: `number`

#### Inherited from

`PlotComponentFill.cmap_mag_filter`

#### Source

[Fill.ts:58](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Fill.ts#L58)

***

### image\_mag\_filter

> `protected` **image\_mag\_filter**: `number`

#### Inherited from

`PlotComponentFill.image_mag_filter`

#### Source

[Fill.ts:57](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Fill.ts#L57)

***

### opacity

> `readonly` **opacity**: `number`

#### Inherited from

`PlotComponentFill.opacity`

#### Source

[Fill.ts:50](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Fill.ts#L50)

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

[Fill.ts:233](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Fill.ts#L233)
