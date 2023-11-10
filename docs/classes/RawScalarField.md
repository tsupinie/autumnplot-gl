[autumnplot-gl](../README.md) / [Exports](../modules.md) / RawScalarField

# Class: RawScalarField<ArrayType\>

A class representing a raw 2D field of gridded data, such as height or u wind.

## Type parameters

| Name | Type |
| :------ | :------ |
| `ArrayType` | extends [`TypedArray`](../modules.md#typedarray) |

## Table of contents

### Constructors

- [constructor](RawScalarField.md#constructor)

### Properties

- [data](RawScalarField.md#data)
- [grid](RawScalarField.md#grid)

### Methods

- [getThinnedField](RawScalarField.md#getthinnedfield)
- [isFloat16](RawScalarField.md#isfloat16)
- [aggregateFields](RawScalarField.md#aggregatefields)

## Constructors

### constructor

• **new RawScalarField**<`ArrayType`\>(`grid`, `data`)

Create a data field.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ArrayType` | extends [`TypedArray`](../modules.md#typedarray) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `grid` | [`Grid`](Grid.md) | The grid on which the data are defined |
| `data` | `ArrayType` | The data, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid. |

#### Defined in

[RawField.ts:392](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L392)

## Properties

### data

• `Readonly` **data**: `ArrayType`

#### Defined in

[RawField.ts:385](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L385)

___

### grid

• `Readonly` **grid**: [`Grid`](Grid.md)

#### Defined in

[RawField.ts:384](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L384)

## Methods

### getThinnedField

▸ **getThinnedField**(`thin_x`, `thin_y`): [`RawScalarField`](RawScalarField.md)<`ArrayType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `thin_x` | `number` |
| `thin_y` | `number` |

#### Returns

[`RawScalarField`](RawScalarField.md)<`ArrayType`\>

#### Defined in

[RawField.ts:419](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L419)

___

### isFloat16

▸ **isFloat16**(): `boolean`

#### Returns

`boolean`

#### Defined in

[RawField.ts:415](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L415)

___

### aggregateFields

▸ `Static` **aggregateFields**<`ArrayType`\>(`func`, `...args`): [`RawScalarField`](RawScalarField.md)<`ArrayType`\>

Create a new field by aggregating a number of fields using a specific function

**`Example`**

```ts
// Compute wind speed from u and v
wind_speed_field = RawScalarField.aggreateFields(Math.hypot, u_field, v_field);
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ArrayType` | extends [`TypedArray`](../modules.md#typedarray) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `func` | (...`args`: `number`[]) => `number` | A function that will be applied each element of the field. It should take the same number of arguments as fields you have and return a single number. |
| `...args` | [`RawScalarField`](RawScalarField.md)<`ArrayType`\>[] | The RawScalarFields to aggregate |

#### Returns

[`RawScalarField`](RawScalarField.md)<`ArrayType`\>

a new gridded field

#### Defined in

[RawField.ts:446](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L446)
