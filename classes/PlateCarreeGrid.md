[autumnplot-gl](../README.md) / [Exports](../modules.md) / PlateCarreeGrid

# Class: PlateCarreeGrid

A plate carree (a.k.a. lat/lon) grid with uniform grid spacing

## Table of contents

### Constructors

- [constructor](PlateCarreeGrid.md#constructor)

### Properties

- [\_ll\_cache](PlateCarreeGrid.md#_ll_cache)
- [ll\_lat](PlateCarreeGrid.md#ll_lat)
- [ll\_lon](PlateCarreeGrid.md#ll_lon)
- [ni](PlateCarreeGrid.md#ni)
- [nj](PlateCarreeGrid.md#nj)
- [type](PlateCarreeGrid.md#type)
- [ur\_lat](PlateCarreeGrid.md#ur_lat)
- [ur\_lon](PlateCarreeGrid.md#ur_lon)

### Methods

- [getCoords](PlateCarreeGrid.md#getcoords)

## Constructors

### constructor

• **new PlateCarreeGrid**(`ni`, `nj`, `ll_lon`, `ll_lat`, `ur_lon`, `ur_lat`)

Create a plate carree grid

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ni` | `number` | The number of grid points in the i (longitude) direction |
| `nj` | `number` | The number of grid points in the j (latitude) direction |
| `ll_lon` | `number` | The longitude of the lower left corner of the grid |
| `ll_lat` | `number` | The latitude of the lower left corner of the grid |
| `ur_lon` | `number` | The longitude of the upper right corner of the grid |
| `ur_lat` | `number` | The latitude of the upper right corner of the grid |

#### Defined in

[RawField.ts:50](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/RawField.ts#L50)

## Properties

### \_ll\_cache

• `Readonly` `Private` **\_ll\_cache**: `Cache`<[], `Coords`\>

#### Defined in

[RawField.ts:39](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/RawField.ts#L39)

___

### ll\_lat

• `Readonly` **ll\_lat**: `number`

#### Defined in

[RawField.ts:34](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/RawField.ts#L34)

___

### ll\_lon

• `Readonly` **ll\_lon**: `number`

#### Defined in

[RawField.ts:33](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/RawField.ts#L33)

___

### ni

• `Readonly` **ni**: `number`

#### Defined in

[RawField.ts:31](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/RawField.ts#L31)

___

### nj

• `Readonly` **nj**: `number`

#### Defined in

[RawField.ts:32](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/RawField.ts#L32)

___

### type

• `Readonly` **type**: ``"latlon"``

#### Defined in

[RawField.ts:29](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/RawField.ts#L29)

___

### ur\_lat

• `Readonly` **ur\_lat**: `number`

#### Defined in

[RawField.ts:36](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/RawField.ts#L36)

___

### ur\_lon

• `Readonly` **ur\_lon**: `number`

#### Defined in

[RawField.ts:35](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/RawField.ts#L35)

## Methods

### getCoords

▸ **getCoords**(): `Coords`

Get a list of longitudes and latitudes on the grid (internal method)

#### Returns

`Coords`

#### Defined in

[RawField.ts:82](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/RawField.ts#L82)
