[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / LambertGrid

# Class: LambertGrid

A Lambert conformal conic grid with uniform grid spacing

## Extends

- [`Grid`](Grid.md)

## Constructors

### new LambertGrid()

> **new LambertGrid**(`ni`, `nj`, `lon_0`, `lat_0`, `lat_std`, `ll_x`, `ll_y`, `ur_x`, `ur_y`): [`LambertGrid`](LambertGrid.md)

Create a Lambert conformal conic grid

#### Parameters

• **ni**: `number`

The number of grid points in the i (longitude) direction

• **nj**: `number`

The number of grid points in the j (latitude) direction

• **lon\_0**: `number`

The standard longitude for the projection; this is also the center longitude for the projection

• **lat\_0**: `number`

The center latitude for the projection

• **lat\_std**: [`number`, `number`]

The standard latitudes for the projection

• **ll\_x**: `number`

The x coordinate in projection space of the lower-left corner of the grid

• **ll\_y**: `number`

The y coordinate in projection space of the lower-left corner of the grid

• **ur\_x**: `number`

The x coordinate in projection space of the upper-right corner of the grid

• **ur\_y**: `number`

The y coordinate in projection space of the upper-right corner of the grid

#### Returns

[`LambertGrid`](LambertGrid.md)

#### Overrides

[`Grid`](Grid.md).[`constructor`](Grid.md#constructors)

#### Source

[Grid.ts:388](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L388)

## Properties

### is\_conformal

> `readonly` **is\_conformal**: `boolean`

#### Inherited from

[`Grid`](Grid.md).[`is_conformal`](Grid.md#is_conformal)

#### Source

[Grid.ts:86](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L86)

***

### lat\_0

> `readonly` **lat\_0**: `number`

#### Source

[Grid.ts:365](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L365)

***

### lat\_std

> `readonly` **lat\_std**: [`number`, `number`]

#### Source

[Grid.ts:366](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L366)

***

### ll\_x

> `readonly` **ll\_x**: `number`

#### Source

[Grid.ts:367](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L367)

***

### ll\_y

> `readonly` **ll\_y**: `number`

#### Source

[Grid.ts:368](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L368)

***

### lon\_0

> `readonly` **lon\_0**: `number`

#### Source

[Grid.ts:364](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L364)

***

### ni

> `readonly` **ni**: `number`

#### Inherited from

[`Grid`](Grid.md).[`ni`](Grid.md#ni)

#### Source

[Grid.ts:84](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L84)

***

### nj

> `readonly` **nj**: `number`

#### Inherited from

[`Grid`](Grid.md).[`nj`](Grid.md#nj)

#### Source

[Grid.ts:85](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L85)

***

### type

> `readonly` **type**: [`GridType`](../type-aliases/GridType.md)

#### Inherited from

[`Grid`](Grid.md).[`type`](Grid.md#type)

#### Source

[Grid.ts:83](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L83)

***

### ur\_x

> `readonly` **ur\_x**: `number`

#### Source

[Grid.ts:369](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L369)

***

### ur\_y

> `readonly` **ur\_y**: `number`

#### Source

[Grid.ts:370](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L370)

## Methods

### copy()

> **copy**(`opts`?): [`LambertGrid`](LambertGrid.md)

#### Parameters

• **opts?**

• **opts.ll\_x?**: `number`

• **opts.ll\_y?**: `number`

• **opts.ni?**: `number`

• **opts.nj?**: `number`

• **opts.ur\_x?**: `number`

• **opts.ur\_y?**: `number`

#### Returns

[`LambertGrid`](LambertGrid.md)

#### Overrides

[`Grid`](Grid.md).[`copy`](Grid.md#copy)

#### Source

[Grid.ts:439](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L439)

***

### getEarthCoords()

> **getEarthCoords**(): `EarthCoords`

Get a list of longitudes and latitudes on the grid (internal method)

#### Returns

`EarthCoords`

#### Overrides

[`Grid`](Grid.md).[`getEarthCoords`](Grid.md#getearthcoords)

#### Source

[Grid.ts:454](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L454)

***

### getGridCoords()

> **getGridCoords**(): `GridCoords`

#### Returns

`GridCoords`

#### Overrides

[`Grid`](Grid.md).[`getGridCoords`](Grid.md#getgridcoords)

#### Source

[Grid.ts:458](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L458)

***

### getThinnedGrid()

> **getThinnedGrid**(`thin_x`, `thin_y`): [`LambertGrid`](LambertGrid.md)

#### Parameters

• **thin\_x**: `number`

• **thin\_y**: `number`

#### Returns

[`LambertGrid`](LambertGrid.md)

#### Overrides

[`Grid`](Grid.md).[`getThinnedGrid`](Grid.md#getthinnedgrid)

#### Source

[Grid.ts:469](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L469)

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

[Grid.ts:128](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L128)

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

[Grid.ts:124](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L124)

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

[Grid.ts:120](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L120)

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

[Grid.ts:462](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L462)
