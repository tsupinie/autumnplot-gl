[autumnplot-gl](../README.md) / [Exports](../modules.md) / Paintball

# Class: Paintball<ArrayType\>

A class representing a paintball plot, which is a plot of objects in every member of an ensemble. Objects are usually defined by a single threshold on
a field (such as simulated reflectivity greater than 40 dBZ), but could in theory be defined by any arbitrarily complicated method. In autumnplot-gl,
the data for the paintball plot is given as a single field with the objects from each member encoded as "bits" in the field. Because the field is made up
of single-precision floats, this works for up to 24 members. (Technically speaking, I don't need the quotes around "bits", as they're bits of the 
significand of an IEEE 754 float.)

## Type parameters

| Name | Type |
| :------ | :------ |
| `ArrayType` | extends [`TypedArray`](../modules.md#typedarray) |

## Hierarchy

- [`PlotComponent`](PlotComponent.md)

  ↳ **`Paintball`**

## Table of contents

### Constructors

- [constructor](Paintball.md#constructor)

### Properties

- [colors](Paintball.md#colors)
- [opacity](Paintball.md#opacity)

## Constructors

### constructor

• **new Paintball**<`ArrayType`\>(`field`, `opts?`)

Create a paintball plot

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ArrayType` | extends [`TypedArray`](../modules.md#typedarray) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | [`RawScalarField`](RawScalarField.md)<`ArrayType`\> | A scalar field containing the member objects encoded as "bits." The numerical value of each grid point can be constructed like `1.0 * M1 + 2.0 * M2 + 4.0 * M3 + 8.0 * M4 ...`, where `M1` is 1 if that grid point is in an object in member 1 and 0 otherwise, `M2` is the same thing for member 2, and `M3` and `M4` and up to `Mn` are the same thing for the rest of the members. |
| `opts?` | [`PaintballOptions`](../interfaces/PaintballOptions.md) | Options for creating the paintball plot |

#### Overrides

[PlotComponent](PlotComponent.md).[constructor](PlotComponent.md#constructor)

#### Defined in

[Paintball.ts:54](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Paintball.ts#L54)

## Properties

### colors

• `Readonly` **colors**: `number`[]

#### Defined in

[Paintball.ts:42](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Paintball.ts#L42)

___

### opacity

• `Readonly` **opacity**: `number`

#### Defined in

[Paintball.ts:43](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Paintball.ts#L43)
