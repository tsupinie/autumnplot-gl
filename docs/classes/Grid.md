[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / Grid

# Class: `abstract` Grid

## Extended by

- [`PlateCarreeGrid`](PlateCarreeGrid.md)
- [`PlateCarreeRotatedGrid`](PlateCarreeRotatedGrid.md)
- [`LambertGrid`](LambertGrid.md)

## Constructors

### new Grid()

> **new Grid**(`type`, `is_conformal`, `ni`, `nj`): [`Grid`](Grid.md)

#### Parameters

• **type**: [`GridType`](../type-aliases/GridType.md)

• **is\_conformal**: `boolean`

• **ni**: `number`

• **nj**: `number`

#### Returns

[`Grid`](Grid.md)

#### Source

[Grid.ts:92](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L92)

## Properties

### is\_conformal

> `readonly` **is\_conformal**: `boolean`

#### Source

[Grid.ts:86](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L86)

***

### ni

> `readonly` **ni**: `number`

#### Source

[Grid.ts:84](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L84)

***

### nj

> `readonly` **nj**: `number`

#### Source

[Grid.ts:85](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L85)

***

### type

> `readonly` **type**: [`GridType`](../type-aliases/GridType.md)

#### Source

[Grid.ts:83](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L83)

## Methods

### copy()

> `abstract` **copy**(`opts`?): [`Grid`](Grid.md)

#### Parameters

• **opts?**

• **opts.ni?**: `number`

• **opts.nj?**: `number`

#### Returns

[`Grid`](Grid.md)

#### Source

[Grid.ts:113](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L113)

***

### getEarthCoords()

> `abstract` **getEarthCoords**(): `EarthCoords`

#### Returns

`EarthCoords`

#### Source

[Grid.ts:115](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L115)

***

### getGridCoords()

> `abstract` **getGridCoords**(): `GridCoords`

#### Returns

`GridCoords`

#### Source

[Grid.ts:116](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L116)

***

### getThinnedGrid()

> `abstract` **getThinnedGrid**(`thin_x`, `thin_y`): [`Grid`](Grid.md)

#### Parameters

• **thin\_x**: `number`

• **thin\_y**: `number`

#### Returns

[`Grid`](Grid.md)

#### Source

[Grid.ts:118](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L118)

***

### getVectorRotationTexture()

> **getVectorRotationTexture**(`gl`): `object`

#### Parameters

• **gl**: [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md)

#### Returns

`object`

##### rotation

> **rotation**: `WGLTexture`

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

#### Source

[Grid.ts:120](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L120)

***

### transform()

> `abstract` **transform**(`x`, `y`, `opts`?): [`number`, `number`]

#### Parameters

• **x**: `number`

• **y**: `number`

• **opts?**

• **opts.inverse?**: `boolean`

#### Returns

[`number`, `number`]

#### Source

[Grid.ts:117](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/Grid.ts#L117)
