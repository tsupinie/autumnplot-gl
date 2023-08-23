[autumnplot-gl](../README.md) / [Exports](../modules.md) / Barbs

# Class: Barbs

A class representing a field of wind barbs. The barbs are automatically thinned based on the zoom level on the map; the user only has to provide a
thinning factor at zoom level 1.

**`Example`**

```ts
// Create a barb field with black barbs and plotting every 16th wind barb in both i and j at zoom level 1
const vector_field = new RawVectorField(grid, u_data, v_data);
const barbs = new Barbs(vector_field, {color: '#000000', thin_fac: 16});
```

## Hierarchy

- [`PlotComponent`](PlotComponent.md)

  ↳ **`Barbs`**

## Table of contents

### Constructors

- [constructor](Barbs.md#constructor)

### Properties

- [color](Barbs.md#color)
- [fields](Barbs.md#fields)
- [gl\_elems](Barbs.md#gl_elems)
- [thin\_fac](Barbs.md#thin_fac)

### Methods

- [onAdd](Barbs.md#onadd)
- [render](Barbs.md#render)

## Constructors

### constructor

• **new Barbs**(`fields`, `opts`)

Create a field of wind barbs

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fields` | [`RawVectorField`](RawVectorField.md) | The vector field to plot as barbs |
| `opts` | [`BarbsOptions`](../interfaces/BarbsOptions.md) | Options for creating the wind barbs |

#### Overrides

[PlotComponent](PlotComponent.md).[constructor](PlotComponent.md#constructor)

#### Defined in

[Barbs.ts:169](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/Barbs.ts#L169)

## Properties

### color

• `Readonly` **color**: [`number`, `number`, `number`]

#### Defined in

[Barbs.ts:158](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/Barbs.ts#L158)

___

### fields

• `Readonly` **fields**: [`RawVectorField`](RawVectorField.md)

The vector field

#### Defined in

[Barbs.ts:157](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/Barbs.ts#L157)

___

### gl\_elems

• `Private` **gl\_elems**: `BarbsGLElems`

#### Defined in

[Barbs.ts:162](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/Barbs.ts#L162)

___

### thin\_fac

• `Readonly` **thin\_fac**: `number`

#### Defined in

[Barbs.ts:159](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/Barbs.ts#L159)

## Methods

### onAdd

▸ **onAdd**(`map`, `gl`): `Promise`<`void`\>

Add the barb field to a map

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | [`MapType`](../modules.md#maptype) |
| `gl` | [`WebGLAnyRenderingContext`](../modules.md#webglanyrenderingcontext) |

#### Returns

`Promise`<`void`\>

#### Overrides

[PlotComponent](PlotComponent.md).[onAdd](PlotComponent.md#onadd)

#### Defined in

[Barbs.ts:185](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/Barbs.ts#L185)

___

### render

▸ **render**(`gl`, `matrix`): `void`

Render the barb field

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | [`WebGLAnyRenderingContext`](../modules.md#webglanyrenderingcontext) |
| `matrix` | `number`[] |

#### Returns

`void`

#### Overrides

[PlotComponent](PlotComponent.md).[render](PlotComponent.md#render)

#### Defined in

[Barbs.ts:209](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/Barbs.ts#L209)
