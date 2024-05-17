[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / PlateCarreeRotatedGrid

# Class: PlateCarreeRotatedGrid

A rotated lat-lon (plate carree) grid with uniform grid spacing

## Extends

- [`Grid`](Grid.md)

## Constructors

### new PlateCarreeRotatedGrid()

> **new PlateCarreeRotatedGrid**(`ni`, `nj`, `np_lon`, `np_lat`, `lon_shift`, `ll_lon`, `ll_lat`, `ur_lon`, `ur_lat`): [`PlateCarreeRotatedGrid`](PlateCarreeRotatedGrid.md)

Create a Lambert conformal conic grid

#### Parameters

• **ni**: `number`

The number of grid points in the i (longitude) direction

• **nj**: `number`

The number of grid points in the j (latitude) direction

• **np\_lon**: `number`

The longitude of the north pole for the rotated grid

• **np\_lat**: `number`

The latitude of the north pole for the rotated grid

• **lon\_shift**: `number`

The angle around the rotated north pole to shift the central meridian

• **ll\_lon**: `number`

The longitude of the lower left corner of the grid (on the rotated earth)

• **ll\_lat**: `number`

The latitude of the lower left corner of the grid (on the rotated earth)

• **ur\_lon**: `number`

The longitude of the upper right corner of the grid (on the rotated earth)

• **ur\_lat**: `number`

The latitude of the upper right corner of the grid (on the rotated earth)

#### Returns

[`PlateCarreeRotatedGrid`](PlateCarreeRotatedGrid.md)

#### Overrides

[`Grid`](Grid.md).[`constructor`](Grid.md#constructors)

#### Source

[Grid.ts:265](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L265)

## Properties

### is\_conformal

> `readonly` **is\_conformal**: `boolean`

#### Inherited from

[`Grid`](Grid.md).[`is_conformal`](Grid.md#is_conformal)

#### Source

[Grid.ts:86](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L86)

***

### ll\_lat

> `readonly` **ll\_lat**: `number`

#### Source

[Grid.ts:245](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L245)

***

### ll\_lon

> `readonly` **ll\_lon**: `number`

#### Source

[Grid.ts:244](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L244)

***

### lon\_shift

> `readonly` **lon\_shift**: `number`

#### Source

[Grid.ts:243](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L243)

***

### ni

> `readonly` **ni**: `number`

#### Inherited from

[`Grid`](Grid.md).[`ni`](Grid.md#ni)

#### Source

[Grid.ts:84](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L84)

***

### nj

> `readonly` **nj**: `number`

#### Inherited from

[`Grid`](Grid.md).[`nj`](Grid.md#nj)

#### Source

[Grid.ts:85](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L85)

***

### np\_lat

> `readonly` **np\_lat**: `number`

#### Source

[Grid.ts:242](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L242)

***

### np\_lon

> `readonly` **np\_lon**: `number`

#### Source

[Grid.ts:241](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L241)

***

### type

> `readonly` **type**: [`GridType`](../type-aliases/GridType.md)

#### Inherited from

[`Grid`](Grid.md).[`type`](Grid.md#type)

#### Source

[Grid.ts:83](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L83)

***

### ur\_lat

> `readonly` **ur\_lat**: `number`

#### Source

[Grid.ts:247](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L247)

***

### ur\_lon

> `readonly` **ur\_lon**: `number`

#### Source

[Grid.ts:246](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L246)

## Methods

### copy()

> **copy**(`opts`?): [`PlateCarreeRotatedGrid`](PlateCarreeRotatedGrid.md)

#### Parameters

• **opts?**

• **opts.ll\_lat?**: `number`

• **opts.ll\_lon?**: `number`

• **opts.ni?**: `number`

• **opts.nj?**: `number`

• **opts.ur\_lat?**: `number`

• **opts.ur\_lon?**: `number`

#### Returns

[`PlateCarreeRotatedGrid`](PlateCarreeRotatedGrid.md)

#### Overrides

[`Grid`](Grid.md).[`copy`](Grid.md#copy)

#### Source

[Grid.ts:315](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L315)

***

### getEarthCoords()

> **getEarthCoords**(): `EarthCoords`

Get a list of longitudes and latitudes on the grid (internal method)

#### Returns

`EarthCoords`

#### Overrides

[`Grid`](Grid.md).[`getEarthCoords`](Grid.md#getearthcoords)

#### Source

[Grid.ts:330](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L330)

***

### getGridCoords()

> **getGridCoords**(): `GridCoords`

#### Returns

`GridCoords`

#### Overrides

[`Grid`](Grid.md).[`getGridCoords`](Grid.md#getgridcoords)

#### Source

[Grid.ts:334](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L334)

***

### getThinnedGrid()

> **getThinnedGrid**(`thin_x`, `thin_y`): [`PlateCarreeRotatedGrid`](PlateCarreeRotatedGrid.md)

#### Parameters

• **thin\_x**: `number`

• **thin\_y**: `number`

#### Returns

[`PlateCarreeRotatedGrid`](PlateCarreeRotatedGrid.md)

#### Overrides

[`Grid`](Grid.md).[`getThinnedGrid`](Grid.md#getthinnedgrid)

#### Source

[Grid.ts:345](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L345)

***

### getVectorRotationTexture()

> **getVectorRotationTexture**(`gl`): `object`

#### Parameters

• **gl**: [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md)

#### Returns

`object`

##### rotation

> **rotation**: `WGLTexture`

#### Inherited from

[`Grid`](Grid.md).[`getVectorRotationTexture`](Grid.md#getvectorrotationtexture)

#### Source

[Grid.ts:128](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L128)

***

### getWGLBillboardBuffers()

> **getWGLBillboardBuffers**(`gl`, `thin_fac`, `max_zoom`): `Promise`\<`object`\>

#### Parameters

• **gl**: [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md)

• **thin\_fac**: `number`

• **max\_zoom**: `number`

#### Returns

`Promise`\<`object`\>

##### texcoords

> **texcoords**: `WGLBuffer`

##### vertices

> **vertices**: `WGLBuffer`

#### Inherited from

[`Grid`](Grid.md).[`getWGLBillboardBuffers`](Grid.md#getwglbillboardbuffers)

#### Source

[Grid.ts:124](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L124)

***

### getWGLBuffers()

> **getWGLBuffers**(`gl`): `Promise`\<`object`\>

#### Parameters

• **gl**: [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md)

#### Returns

`Promise`\<`object`\>

##### cellsize

> **cellsize**: `WGLBuffer`

##### texcoords

> **texcoords**: `WGLBuffer`

##### vertices

> **vertices**: `WGLBuffer`

#### Inherited from

[`Grid`](Grid.md).[`getWGLBuffers`](Grid.md#getwglbuffers)

#### Source

[Grid.ts:120](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L120)

***

### transform()

> **transform**(`x`, `y`, `opts`?): [`number`, `number`]

#### Parameters

• **x**: `number`

• **y**: `number`

• **opts?**

• **opts.inverse?**: `boolean`

#### Returns

[`number`, `number`]

#### Overrides

[`Grid`](Grid.md).[`transform`](Grid.md#transform)

#### Source

[Grid.ts:338](https://github.com/tsupinie/autumnplot-gl/blob/da83b636ef88a1d3337f3a9820a0b90f5b249286/src/Grid.ts#L338)
