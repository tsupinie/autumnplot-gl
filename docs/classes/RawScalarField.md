[autumnplot-gl](../README.md) / [Exports](../modules.md) / RawScalarField

# Class: RawScalarField

A class representing a raw 2D field of gridded data, such as height or u wind.

## Table of contents

### Constructors

- [constructor](RawScalarField.md#constructor)

### Properties

- [\_pad\_cache](RawScalarField.md#_pad_cache)
- [data](RawScalarField.md#data)
- [grid](RawScalarField.md#grid)

### Methods

- [getPaddedData](RawScalarField.md#getpaddeddata)
- [aggregateFields](RawScalarField.md#aggregatefields)

## Constructors

### constructor

• **new RawScalarField**(`grid`, `data`)

Create a data field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `grid` | [`PlateCarreeGrid`](PlateCarreeGrid.md) | The grid on which the data are defined |
| `data` | `Float32Array` | The data, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid. |

#### Defined in

[RawField.ts:130](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/RawField.ts#L130)

## Properties

### \_pad\_cache

• `Readonly` `Private` **\_pad\_cache**: `Cache`<[], { `data`: `Float32Array` ; `height`: `number` ; `width`: `number`  }\>

#### Defined in

[RawField.ts:123](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/RawField.ts#L123)

___

### data

• `Readonly` **data**: `Float32Array`

#### Defined in

[RawField.ts:120](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/RawField.ts#L120)

___

### grid

• `Readonly` **grid**: [`PlateCarreeGrid`](PlateCarreeGrid.md)

#### Defined in

[RawField.ts:119](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/RawField.ts#L119)

## Methods

### getPaddedData

▸ **getPaddedData**(): `Object`

Pad the data such that both axes are a power of 2 in length (internal method)

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `data` | `Float32Array` |
| `height` | `number` |
| `width` | `number` |

#### Defined in

[RawField.ts:153](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/RawField.ts#L153)

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

[RawField.ts:166](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/RawField.ts#L166)
