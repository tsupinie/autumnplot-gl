[autumnplot-gl](../README.md) / [Exports](../modules.md) / Barbs

# Class: Barbs<ArrayType\>

A class representing a field of wind barbs. The barbs are automatically thinned based on the zoom level on the map; the user only has to provide a
thinning factor at zoom level 1.

**`Example`**

```ts
// Create a barb field with black barbs and plotting every 16th wind barb in both i and j at zoom level 1
const vector_field = new RawVectorField(grid, u_data, v_data);
const barbs = new Barbs(vector_field, {color: '#000000', thin_fac: 16});
```

## Type parameters

| Name | Type |
| :------ | :------ |
| `ArrayType` | extends [`TypedArray`](../modules.md#typedarray) |

## Hierarchy

- [`PlotComponent`](PlotComponent.md)

  ↳ **`Barbs`**

## Table of contents

### Constructors

- [constructor](Barbs.md#constructor)

### Properties

- [color](Barbs.md#color)
- [thin\_fac](Barbs.md#thin_fac)

## Constructors

### constructor

• **new Barbs**<`ArrayType`\>(`fields`, `opts`)

Create a field of wind barbs

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ArrayType` | extends [`TypedArray`](../modules.md#typedarray) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fields` | [`RawVectorField`](RawVectorField.md)<`ArrayType`\> | The vector field to plot as barbs |
| `opts` | [`BarbsOptions`](../interfaces/BarbsOptions.md) | Options for creating the wind barbs |

#### Overrides

[PlotComponent](PlotComponent.md).[constructor](PlotComponent.md#constructor)

#### Defined in

[Barbs.ts:168](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Barbs.ts#L168)

## Properties

### color

• `Readonly` **color**: [`number`, `number`, `number`]

#### Defined in

[Barbs.ts:158](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Barbs.ts#L158)

___

### thin\_fac

• `Readonly` **thin\_fac**: `number`

#### Defined in

[Barbs.ts:159](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Barbs.ts#L159)
