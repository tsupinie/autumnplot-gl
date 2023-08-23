[autumnplot-gl](../README.md) / [Exports](../modules.md) / Paintball

# Class: Paintball

A class representing a paintball plot, which is a plot of objects in every member of an ensemble. Objects are usually defined by a single threshold on
a field (such as simulated reflectivity greater than 40 dBZ), but could in theory be defined by any arbitrarily complicated method. In autumnplot-gl,
the data for the paintball plot is given as a single field with the objects from each member encoded as "bits" in the field. Because the field is made up
of single-precision floats, this works for up to 24 members. (Technically speaking, I don't need the quotes around "bits", as they're bits of the 
significand of an IEEE 754 float.)

## Hierarchy

- [`PlotComponent`](PlotComponent.md)

  ↳ **`Paintball`**

## Table of contents

### Constructors

- [constructor](Paintball.md#constructor)

### Properties

- [colors](Paintball.md#colors)
- [field](Paintball.md#field)
- [gl\_elems](Paintball.md#gl_elems)
- [opacity](Paintball.md#opacity)

### Methods

- [onAdd](Paintball.md#onadd)
- [render](Paintball.md#render)

## Constructors

### constructor

• **new Paintball**(`field`, `opts?`)

Create a paintball plot

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | [`RawScalarField`](RawScalarField.md) | A scalar field containing the member objects encoded as "bits." The numerical value of each grid point can be constructed like `1.0 * M1 + 2.0 * M2 + 4.0 * M3 + 8.0 * M4 ...`, where `M1` is 1 if that grid point is in an object in member 1 and 0 otherwise, `M2` is the same thing for member 2, and `M3` and `M4` and up to `Mn` are the same thing for the rest of the members. |
| `opts?` | [`PaintballOptions`](../interfaces/PaintballOptions.md) | Options for creating the paintball plot |

#### Overrides

[PlotComponent](PlotComponent.md).[constructor](PlotComponent.md#constructor)

#### Defined in

[Paintball.ts:54](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Paintball.ts#L54)

## Properties

### colors

• `Readonly` **colors**: `number`[]

#### Defined in

[Paintball.ts:41](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Paintball.ts#L41)

___

### field

• `Readonly` **field**: [`RawScalarField`](RawScalarField.md)

#### Defined in

[Paintball.ts:40](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Paintball.ts#L40)

___

### gl\_elems

• `Private` **gl\_elems**: `PaintballGLElems`

#### Defined in

[Paintball.ts:45](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Paintball.ts#L45)

___

### opacity

• `Readonly` **opacity**: `number`

#### Defined in

[Paintball.ts:42](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Paintball.ts#L42)

## Methods

### onAdd

▸ **onAdd**(`map`, `gl`): `Promise`<`void`\>

Add the paintball plot to a map.

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | [`MapType`](../modules.md#maptype) |
| `gl` | `WebGLAnyRenderingContext` |

#### Returns

`Promise`<`void`\>

#### Overrides

[PlotComponent](PlotComponent.md).[onAdd](PlotComponent.md#onadd)

#### Defined in

[Paintball.ts:71](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Paintball.ts#L71)

___

### render

▸ **render**(`gl`, `matrix`): `void`

Render the paintball plot

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLAnyRenderingContext` |
| `matrix` | `number`[] |

#### Returns

`void`

#### Overrides

[PlotComponent](PlotComponent.md).[render](PlotComponent.md#render)

#### Defined in

[Paintball.ts:98](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Paintball.ts#L98)
