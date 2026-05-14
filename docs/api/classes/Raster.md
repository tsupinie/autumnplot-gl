---
title: Raster
---

# Class: Raster\<ArrayType, GridType, MapType\>

Defined in: [Fill.ts:236](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Fill.ts#L236)

A raster (i.e. pixel) plot 

## Grid Compatibility
- :white_check_mark: `PlateCarreeGrid`
- :white_check_mark: `PlateCarreeRotatedGrid`
- :white_check_mark: `LambertGrid`
- :x:                `UnstructuredGrid`
- :white_check_mark: `RadarSweepGrid`
- :white_check_mark: `Geostationary`

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
| `GridType` *extends* `DomainBufferGrid` |
| `MapType` *extends* [`MapLikeType`](../type-aliases/MapLikeType.md) |

## Constructors

### Constructor

> **new Raster**\<`ArrayType`, `GridType`, `MapType`\>(`field`, `opts`): `Raster`\<`ArrayType`, `GridType`, `MapType`\>

Defined in: [Fill.ts:243](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Fill.ts#L243)

Create a raster plot

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\> | The field to create the raster plot from |
| `opts` | [`RasterOptions`](../interfaces/RasterOptions.md) | Options for creating the raster plot |

#### Returns

`Raster`\<`ArrayType`, `GridType`, `MapType`\>

#### Overrides

`PlotComponentFill<ArrayType, GridType, MapType>.constructor`

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cmap_mag_filter"></a> `cmap_mag_filter` | `protected` | `null` \| `number` | `PlotComponentFill.cmap_mag_filter` | [Fill.ts:84](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Fill.ts#L84) |
| <a id="image_mag_filter"></a> `image_mag_filter` | `protected` | `null` \| `number` | `PlotComponentFill.image_mag_filter` | [Fill.ts:83](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Fill.ts#L83) |
| <a id="opts"></a> `opts` | `readonly` | `Required`\<[`ContourFillOptions`](../interfaces/ContourFillOptions.md)\> | `PlotComponentFill.opts` | [Fill.ts:76](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Fill.ts#L76) |

## Methods

### updateField()

> **updateField**(`field`, `mask?`): `Promise`\<`void`\>

Defined in: [Fill.ts:251](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Fill.ts#L251)

Update the data displayed as a raster plot

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\> | The new field to display as a raster plot |
| `mask?` | `Uint8Array` | - |

#### Returns

`Promise`\<`void`\>

#### Overrides

`PlotComponentFill.updateField`
