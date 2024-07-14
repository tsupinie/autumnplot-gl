[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / Color

# Class: Color

## Constructors

### new Color()

> **new Color**(`rgba`): [`Color`](Color.md)

Create a new color object

#### Parameters

• **rgba**: [`number`, `number`, `number`, `number`]

An RGBA tuple of floats between 0 and 1

#### Returns

[`Color`](Color.md)

#### Source

[Color.ts:100](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Color.ts#L100)

## Accessors

### a

> `get` **a**(): `number`

The alpha component (opacity) of the color as a float value between 0 and 1

#### Returns

`number`

#### Source

[Color.ts:128](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Color.ts#L128)

***

### b

> `get` **b**(): `number`

The blue component of the color as a float value between 0 and 1

#### Returns

`number`

#### Source

[Color.ts:121](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Color.ts#L121)

***

### g

> `get` **g**(): `number`

The green component of the color as a float value between 0 and 1

#### Returns

`number`

#### Source

[Color.ts:114](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Color.ts#L114)

***

### r

> `get` **r**(): `number`

The red component of the color as a float value between 0 and 1

#### Returns

`number`

#### Source

[Color.ts:107](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Color.ts#L107)

## Methods

### toHSVTuple()

> **toHSVTuple**(): [`number`, `number`, `number`]

#### Returns

[`number`, `number`, `number`]

The color as a tuple of HSV values

#### Source

[Color.ts:164](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Color.ts#L164)

***

### toRGBAHex()

> **toRGBAHex**(): `string`

#### Returns

`string`

The color as an RGBA hex string (e.g., '#dedbefff')

#### Source

[Color.ts:150](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Color.ts#L150)

***

### toRGBATuple()

> **toRGBATuple**(): [`number`, `number`, `number`, `number`]

#### Returns

[`number`, `number`, `number`, `number`]

The color as an RGBA float tuple

#### Source

[Color.ts:157](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Color.ts#L157)

***

### toRGBHex()

> **toRGBHex**(): `string`

#### Returns

`string`

The color as an RGB hex string (e.g., '#dedbef')

#### Source

[Color.ts:143](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Color.ts#L143)

***

### withOpacity()

> **withOpacity**(`opacity`): [`Color`](Color.md)

#### Parameters

• **opacity**: `number`

The new alpha component (opacity)

#### Returns

[`Color`](Color.md)

A new color with the alpha component set to opacity.

#### Source

[Color.ts:136](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Color.ts#L136)

***

### fromHSVTuple()

> `static` **fromHSVTuple**(`hsv`): [`Color`](Color.md)

#### Parameters

• **hsv**: [`number`, `number`, `number`]

A tuple of HSV values

#### Returns

[`Color`](Color.md)

a new Color object

#### Source

[Color.ts:180](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Color.ts#L180)

***

### fromHex()

> `static` **fromHex**(`hex`): [`Color`](Color.md)

#### Parameters

• **hex**: `string`

An RGB or RGBA hex string to parse

#### Returns

[`Color`](Color.md)

a new Color object

#### Source

[Color.ts:172](https://github.com/tsupinie/autumnplot-gl/blob/0e257a0170331d21c88041ead5493447b81541cc/src/Color.ts#L172)
