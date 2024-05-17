[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / RawVectorField

# Class: RawVectorField\<ArrayType\>

A class representing a 2D gridded field of vectors

## Type parameters

• **ArrayType** *extends* [`TypedArray`](../type-aliases/TypedArray.md)

## Constructors

### new RawVectorField()

> **new RawVectorField**\<`ArrayType`\>(`grid`, `u`, `v`, `opts`?): [`RawVectorField`](RawVectorField.md)\<`ArrayType`\>

Create a vector field.

#### Parameters

• **grid**: [`Grid`](Grid.md)

The grid on which the vector components are defined

• **u**: `ArrayType`

The u (east/west) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid

• **v**: `ArrayType`

The v (north/south) component of the vectors, which should be given as a 1D array in row-major order, with the first element being at the lower-left corner of the grid

• **opts?**: [`RawVectorFieldOptions`](../interfaces/RawVectorFieldOptions.md)

Options for creating the vector field.

#### Returns

[`RawVectorField`](RawVectorField.md)\<`ArrayType`\>

#### Source

[RawField.ts:105](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/RawField.ts#L105)

## Properties

### relative\_to

> `readonly` **relative\_to**: [`VectorRelativeTo`](../type-aliases/VectorRelativeTo.md)

#### Source

[RawField.ts:96](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/RawField.ts#L96)

***

### u

> `readonly` **u**: [`RawScalarField`](RawScalarField.md)\<`ArrayType`\>

#### Source

[RawField.ts:94](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/RawField.ts#L94)

***

### v

> `readonly` **v**: [`RawScalarField`](RawScalarField.md)\<`ArrayType`\>

#### Source

[RawField.ts:95](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/RawField.ts#L95)

## Accessors

### grid

> `get` **grid**(): [`Grid`](Grid.md)

#### Returns

[`Grid`](Grid.md)

#### Source

[RawField.ts:149](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/RawField.ts#L149)

## Methods

### getTextureData()

> **getTextureData**(): `object`

#### Returns

`object`

##### u

> **u**: `TextureDataType`\<`ArrayType`\>

##### v

> **v**: `TextureDataType`\<`ArrayType`\>

#### Source

[RawField.ts:113](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/RawField.ts#L113)

***

### getThinnedField()

> **getThinnedField**(`thin_x`, `thin_y`): [`RawVectorField`](RawVectorField.md)\<`ArrayType`\>

#### Parameters

• **thin\_x**: `number`

• **thin\_y**: `number`

#### Returns

[`RawVectorField`](RawVectorField.md)\<`ArrayType`\>

#### Source

[RawField.ts:124](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/RawField.ts#L124)
