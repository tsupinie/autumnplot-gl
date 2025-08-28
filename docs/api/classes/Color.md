---
title: Color
---

# Class: Color

Defined in: [Color.ts:94](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Color.ts#L94)

A class for handling colors and translations between different color spaces

## Constructors

### Constructor

> **new Color**(`rgba`): `Color`

Defined in: [Color.ts:101](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Color.ts#L101)

Create a new color object

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rgba` | \[`number`, `number`, `number`, `number`\] | An RGBA tuple of floats between 0 and 1 |

#### Returns

`Color`

## Accessors

### a

#### Get Signature

> **get** **a**(): `number`

Defined in: [Color.ts:129](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Color.ts#L129)

The alpha component (opacity) of the color as a float value between 0 and 1

##### Returns

`number`

***

### b

#### Get Signature

> **get** **b**(): `number`

Defined in: [Color.ts:122](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Color.ts#L122)

The blue component of the color as a float value between 0 and 1

##### Returns

`number`

***

### g

#### Get Signature

> **get** **g**(): `number`

Defined in: [Color.ts:115](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Color.ts#L115)

The green component of the color as a float value between 0 and 1

##### Returns

`number`

***

### r

#### Get Signature

> **get** **r**(): `number`

Defined in: [Color.ts:108](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Color.ts#L108)

The red component of the color as a float value between 0 and 1

##### Returns

`number`

## Methods

### toHSVTuple()

> **toHSVTuple**(): \[`number`, `number`, `number`\]

Defined in: [Color.ts:165](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Color.ts#L165)

#### Returns

\[`number`, `number`, `number`\]

The color as a tuple of HSV values

***

### toRGBAHex()

> **toRGBAHex**(): `string`

Defined in: [Color.ts:151](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Color.ts#L151)

#### Returns

`string`

The color as an RGBA hex string (e.g., '#dedbefff')

***

### toRGBATuple()

> **toRGBATuple**(): \[`number`, `number`, `number`, `number`\]

Defined in: [Color.ts:158](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Color.ts#L158)

#### Returns

\[`number`, `number`, `number`, `number`\]

The color as an RGBA float tuple

***

### toRGBHex()

> **toRGBHex**(): `string`

Defined in: [Color.ts:144](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Color.ts#L144)

#### Returns

`string`

The color as an RGB hex string (e.g., '#dedbef')

***

### withOpacity()

> **withOpacity**(`opacity`): `Color`

Defined in: [Color.ts:137](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Color.ts#L137)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opacity` | `number` | The new alpha component (opacity) |

#### Returns

`Color`

A new color with the alpha component set to opacity.

***

### fromHex()

> `static` **fromHex**(`hex`): `Color`

Defined in: [Color.ts:173](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Color.ts#L173)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `string` | An RGB or RGBA hex string to parse |

#### Returns

`Color`

a new Color object

***

### fromHSVTuple()

> `static` **fromHSVTuple**(`hsv`): `Color`

Defined in: [Color.ts:181](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Color.ts#L181)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hsv` | \[`number`, `number`, `number`\] | A tuple of HSV values |

#### Returns

`Color`

a new Color object

***

### normalizeColor()

> `static` **normalizeColor**(`color`): `Color`

Defined in: [Color.ts:186](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Color.ts#L186)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `color` | `string` \| `Color` |

#### Returns

`Color`
