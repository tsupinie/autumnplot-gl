[autumnplot-gl](../README.md) / [Exports](../modules.md) / ContourFill

# Class: ContourFill<ArrayType\>

A filled contoured field

**`Example`**

```ts
// Create a field of filled contours with the provided color map
const fill = new ContourFill(wind_speed_field, {cmap: color_map});
```

## Type parameters

| Name | Type |
| :------ | :------ |
| `ArrayType` | extends [`TypedArray`](../modules.md#typedarray) |

## Hierarchy

- `PlotComponentFill`<`ArrayType`\>

  ↳ **`ContourFill`**

## Table of contents

### Constructors

- [constructor](ContourFill.md#constructor)

### Properties

- [cmap](ContourFill.md#cmap)
- [cmap\_mag\_filter](ContourFill.md#cmap_mag_filter)
- [image\_mag\_filter](ContourFill.md#image_mag_filter)
- [opacity](ContourFill.md#opacity)

## Constructors

### constructor

• **new ContourFill**<`ArrayType`\>(`field`, `opts`)

Create a filled contoured field

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ArrayType` | extends [`TypedArray`](../modules.md#typedarray) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | [`RawScalarField`](RawScalarField.md)<`ArrayType`\> | The field to create filled contours from |
| `opts` | [`ContourFillOptions`](../interfaces/ContourFillOptions.md) | Options for creating the filled contours |

#### Overrides

PlotComponentFill&lt;ArrayType\&gt;.constructor

#### Defined in

[Fill.ts:203](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Fill.ts#L203)

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