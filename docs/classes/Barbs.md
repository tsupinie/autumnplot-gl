[autumnplot-gl](../README.md) / [Exports](../modules.md) / Barbs

# Class: Barbs

A class representing a field of wind barbs. The barbs are automatically thinned based on the zoom level on the map; the user only has to provide a
thinning factor at zoom level 1.

**`Example`**

```ts
// Create a barb field with black barbs and plotting every 16th wind barb in both i and j at zoom level 1
const vector_field = {u: u_field, v: v_field};
const barbs = new Barbs(vector_field, {color: '#000000', thin_fac: 16});
```

## Hierarchy

- [`PlotComponent`](PlotComponent.md)

  ↳ **`Barbs`**

## Table of contents

### Constructors

- [constructor](Barbs.md#constructor)

### Properties

- [barb\_billboards](Barbs.md#barb_billboards)
- [color](Barbs.md#color)
- [fields](Barbs.md#fields)
- [map](Barbs.md#map)
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
| `fields` | [`RawVectorField`](../modules.md#rawvectorfield) | The u and v fields to use as an object |
| `opts` | [`BarbsOptions`](../interfaces/BarbsOptions.md) | Options for creating the wind barbs |

#### Overrides

[PlotComponent](PlotComponent.md).[constructor](PlotComponent.md#constructor)

#### Defined in

[Barbs.ts:165](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/Barbs.ts#L165)

## Properties

### barb\_billboards

• `Private` **barb\_billboards**: `BillboardCollection`

#### Defined in

[Barbs.ts:158](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/Barbs.ts#L158)

___

### color

• `Readonly` **color**: [`number`, `number`, `number`]

#### Defined in

[Barbs.ts:152](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/Barbs.ts#L152)

___

### fields

• `Readonly` **fields**: [`RawVectorField`](../modules.md#rawvectorfield)

The vector field

#### Defined in

[Barbs.ts:151](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/Barbs.ts#L151)

___

### map

• `Private` **map**: [`MapType`](../modules.md#maptype)

#### Defined in

[Barbs.ts:156](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/Barbs.ts#L156)

___

### thin\_fac

• `Readonly` **thin\_fac**: `number`

#### Defined in

[Barbs.ts:153](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/Barbs.ts#L153)

## Methods

### onAdd

▸ **onAdd**(`map`, `gl`): `Promise`<`void`\>

Add the barb field to a map

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | [`MapType`](../modules.md#maptype) |
| `gl` | `WebGLRenderingContext` |

#### Returns

`Promise`<`void`\>

#### Overrides

[PlotComponent](PlotComponent.md).[onAdd](PlotComponent.md#onadd)

#### Defined in

[Barbs.ts:182](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/Barbs.ts#L182)

___

### render

▸ **render**(`gl`, `matrix`): `void`

Render the barb field

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `matrix` | `number`[] |

#### Returns

`void`

#### Overrides

[PlotComponent](PlotComponent.md).[render](PlotComponent.md#render)

#### Defined in

[Barbs.ts:202](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/Barbs.ts#L202)
