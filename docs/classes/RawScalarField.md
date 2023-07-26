[autumnplot-gl](../README.md) / [Exports](../modules.md) / RawScalarField

# Class: RawScalarField

A class representing a raw 2D field of gridded data, such as height or u wind.

## Table of contents

### Constructors

- [constructor](RawScalarField.md#constructor)

### Properties

- [data](RawScalarField.md#data)
- [grid](RawScalarField.md#grid)

### Methods

- [getThinnedField](RawScalarField.md#getthinnedfield)
- [aggregateFields](RawScalarField.md#aggregatefields)

## Constructors

### constructor

• **new RawScalarField**(`grid`, `data`)

Create a data field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `grid` | [`Grid`](Grid.md) | The grid on which the data are defined |
| `data` | `Float32Array` | The data, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid. |

#### Defined in

[RawField.ts:288](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/RawField.ts#L288)

## Properties

### data

• `Readonly` **data**: `Float32Array`

#### Defined in

[RawField.ts:281](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/RawField.ts#L281)

___

### grid

• `Readonly` **grid**: [`Grid`](Grid.md)

#### Defined in

[RawField.ts:280](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/RawField.ts#L280)

## Methods

### getThinnedField

▸ **getThinnedField**(`thin_x`, `thin_y`): [`RawScalarField`](RawScalarField.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `thin_x` | `number` |
| `thin_y` | `number` |

#### Returns

[`RawScalarField`](RawScalarField.md)

#### Defined in

[RawField.ts:297](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/RawField.ts#L297)

___

### aggregateFields

▸ `Static` **aggregateFields**(`func`, `...args`): [`RawScalarField`](RawScalarField.md)

Create a new field by aggregating a number of fields using a specific function

**`Example`**

```ts
// Compute wind speed from u and v
wind_speed_field = RawScalarField.aggreateFields(Math.hypot, u_field, v_field);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `func` | (...`args`: `number`[]) => `number` | A function that will be applied each element of the field. It should take the same number of arguments as fields you have and return a single number. |
| `...args` | [`RawScalarField`](RawScalarField.md)[] | The RawScalarFields to aggregate |

#### Returns

[`RawScalarField`](RawScalarField.md)

a new gridded field

#### Defined in

[RawField.ts:322](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/RawField.ts#L322)
