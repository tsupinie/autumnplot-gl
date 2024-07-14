[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / RawScalarField

# Class: RawScalarField\<ArrayType\>

A class representing a raw 2D field of gridded data, such as height or u wind.

## Type parameters

• **ArrayType** *extends* [`TypedArray`](../type-aliases/TypedArray.md)

## Constructors

### new RawScalarField()

> **new RawScalarField**\<`ArrayType`\>(`grid`, `data`): [`RawScalarField`](RawScalarField.md)\<`ArrayType`\>

Create a data field.

#### Parameters

• **grid**: [`Grid`](Grid.md)

The grid on which the data are defined

• **data**: `ArrayType`

The data, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid.

#### Returns

[`RawScalarField`](RawScalarField.md)\<`ArrayType`\>

#### Source

[RawField.ts:26](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/RawField.ts#L26)

## Properties

### data

> `readonly` **data**: `ArrayType`

#### Source

[RawField.ts:17](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/RawField.ts#L17)

***

### grid

> `readonly` **grid**: [`Grid`](Grid.md)

#### Source

[RawField.ts:16](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/RawField.ts#L16)

## Methods

### getContours()

> **getContours**(`opts`): `Promise`\<[`ContourData`](../type-aliases/ContourData.md)\>

#### Parameters

• **opts**: [`FieldContourOpts`](../interfaces/FieldContourOpts.md)

#### Returns

`Promise`\<[`ContourData`](../type-aliases/ContourData.md)\>

#### Source

[RawField.ts:54](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/RawField.ts#L54)

***

### aggregateFields()

> `static` **aggregateFields**\<`ArrayType`\>(`func`, ...`args`): [`RawScalarField`](RawScalarField.md)\<`ArrayType`\>

Create a new field by aggregating a number of fields using a specific function

#### Type parameters

• **ArrayType** *extends* [`TypedArray`](../type-aliases/TypedArray.md)

#### Parameters

• **func**

A function that will be applied each element of the field. It should take the same number of arguments as fields you have and return a single number.

• ...**args**: [`RawScalarField`](RawScalarField.md)\<`ArrayType`\>[]

The RawScalarFields to aggregate

#### Returns

[`RawScalarField`](RawScalarField.md)\<`ArrayType`\>

a new gridded field

#### Example

```ts
// Compute wind speed from u and v
wind_speed_field = RawScalarField.aggreateFields(Math.hypot, u_field, v_field);
```

#### Source

[RawField.ts:67](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/RawField.ts#L67)
