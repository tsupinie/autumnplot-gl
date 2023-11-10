[autumnplot-gl](../README.md) / [Exports](../modules.md) / Raster

# Class: Raster<ArrayType\>

A raster (i.e. pixel) plot

**`Example`**

```ts
// Create a raster plot with the provided color map
const raster = new Raster(wind_speed_field, {cmap: color_map});
```

## Type parameters

| Name | Type |
| :------ | :------ |
| `ArrayType` | extends [`TypedArray`](../modules.md#typedarray) |

## Hierarchy

- `PlotComponentFill`<`ArrayType`\>

  ↳ **`Raster`**

## Table of contents

### Constructors

- [constructor](Raster.md#constructor)

### Properties

- [cmap](Raster.md#cmap)
- [cmap\_mag\_filter](Raster.md#cmap_mag_filter)
- [image\_mag\_filter](Raster.md#image_mag_filter)
- [opacity](Raster.md#opacity)

## Constructors

### constructor

• **new Raster**<`ArrayType`\>(`field`, `opts`)

Create a raster plot

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ArrayType` | extends [`TypedArray`](../modules.md#typedarray) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | [`RawScalarField`](RawScalarField.md)<`ArrayType`\> | The field to create the raster plot from |
| `opts` | [`RasterOptions`](../interfaces/RasterOptions.md) | Options for creating the raster plot |

#### Overrides

PlotComponentFill&lt;ArrayType\&gt;.constructor

#### Defined in

[Fill.ts:167](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Fill.ts#L167)

## Properties

### cmap

• `Readonly` **cmap**: [`ColorMap`](ColorMap.md)

#### Inherited from

PlotComponentFill.cmap

#### Defined in

[Fill.ts:49](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Fill.ts#L49)

___

### cmap\_mag\_filter

• `Protected` **cmap\_mag\_filter**: `number`

#### Inherited from

PlotComponentFill.cmap\_mag\_filter

#### Defined in

[Fill.ts:57](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Fill.ts#L57)

___

### image\_mag\_filter

• `Protected` **image\_mag\_filter**: `number`

#### Inherited from

PlotComponentFill.image\_mag\_filter

#### Defined in

[Fill.ts:56](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Fill.ts#L56)

___

### opacity

• `Readonly` **opacity**: `number`

#### Inherited from

PlotComponentFill.opacity

#### Defined in

[Fill.ts:50](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Fill.ts#L50)
