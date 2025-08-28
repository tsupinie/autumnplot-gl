---
title: Raster
---

# Class: Raster\<ArrayType, GridType, MapType\>

Defined in: [Fill.ts:219](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Fill.ts#L219)

A raster (i.e. pixel) plot

## Example

```ts
// Create a raster plot with the provided color map
const raster = new Raster(wind_speed_field, {cmap: color_map});
```

## Extends

- `PlotComponentFill`\<`ArrayType`, `GridType`, `MapType`\>

## Type Parameters

| Type Parameter |
| ------ |
| `ArrayType` *extends* [`TypedArray`](../type-aliases/TypedArray.md) |
| `GridType` *extends* [`StructuredGrid`](StructuredGrid.md) |
| `MapType` *extends* [`MapLikeType`](../type-aliases/MapLikeType.md) |

## Constructors

### Constructor

> **new Raster**\<`ArrayType`, `GridType`, `MapType`\>(`field`, `opts`): `Raster`\<`ArrayType`, `GridType`, `MapType`\>

Defined in: [Fill.ts:226](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Fill.ts#L226)

Create a raster plot

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`RawScalarField`](RawScalarField.md)\<`ArrayType`, `GridType`\> | The field to create the raster plot from |
| `opts` | [`RasterOptions`](../interfaces/RasterOptions.md) | Options for creating the raster plot |

#### Returns

`Raster`\<`ArrayType`, `GridType`, `MapType`\>

#### Overrides

`PlotComponentFill<ArrayType, GridType, MapType>.constructor`

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cmap_mag_filter"></a> `cmap_mag_filter` | `protected` | `null` \| `number` | `PlotComponentFill.cmap_mag_filter` | [Fill.ts:84](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Fill.ts#L84) |
| <a id="image_mag_filter"></a> `image_mag_filter` | `protected` | `null` \| `number` | `PlotComponentFill.image_mag_filter` | [Fill.ts:83](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Fill.ts#L83) |
| <a id="opts"></a> `opts` | `readonly` | `Required`\<[`ContourFillOptions`](../interfaces/ContourFillOptions.md)\> | `PlotComponentFill.opts` | [Fill.ts:76](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Fill.ts#L76) |

## Methods

### updateField()

> **updateField**(`field`, `mask?`): `Promise`\<`void`\>

Defined in: [Fill.ts:234](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Fill.ts#L234)

Update the data displayed as a raster plot

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`RawScalarField`](RawScalarField.md)\<`ArrayType`, `GridType`\> | The new field to display as a raster plot |
| `mask?` | `Uint8Array` | - |

#### Returns

`Promise`\<`void`\>

#### Overrides

`PlotComponentFill.updateField`
