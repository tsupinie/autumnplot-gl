---
title: ContourFill
---

# Class: ContourFill\<ArrayType, GridType, MapType\>

Defined in: [Fill.ts:289](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Fill.ts#L289)

A filled contoured field 

## Grid Compatibility
- :white_check_mark: `PlateCarreeGrid`
- :white_check_mark: `PlateCarreeRotatedGrid`
- :white_check_mark: `LambertGrid`
- :x:                `UnstructuredGrid`
- :white_check_mark: `RadarSweepGrid`
- :white_check_mark: `Geostationary`

## Example

```ts
// Create a field of filled contours with the provided color map
const fill = new ContourFill(wind_speed_field, {cmap: color_map});
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

> **new ContourFill**\<`ArrayType`, `GridType`, `MapType`\>(`field`, `opts`): `ContourFill`\<`ArrayType`, `GridType`, `MapType`\>

Defined in: [Fill.ts:296](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Fill.ts#L296)

Create a filled contoured field

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\> | The field to create filled contours from |
| `opts` | [`ContourFillOptions`](../interfaces/ContourFillOptions.md) | Options for creating the filled contours |

#### Returns

`ContourFill`\<`ArrayType`, `GridType`, `MapType`\>

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

Defined in: [Fill.ts:304](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Fill.ts#L304)

Update the data displayed as filled contours

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`ExpressionScalarField`](ExpressionScalarField.md)\<`ArrayType`, `GridType`\> | The new field to display as filled contours |
| `mask?` | `Uint8Array` | - |

#### Returns

`Promise`\<`void`\>

#### Overrides

`PlotComponentFill.updateField`
