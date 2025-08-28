---
title: RawProfileField
---

# Class: RawProfileField\<GridType\>

Defined in: [RawField.ts:200](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/RawField.ts#L200)

A class grid of wind profiles

## Type Parameters

| Type Parameter |
| ------ |
| `GridType` *extends* [`Grid`](Grid.md) |

## Constructors

### Constructor

> **new RawProfileField**\<`GridType`\>(`grid`, `profiles`): `RawProfileField`\<`GridType`\>

Defined in: [RawField.ts:209](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/RawField.ts#L209)

Create a grid of wind profiles

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `grid` | `GridType` | The grid on which the profiles are defined |
| `profiles` | [`WindProfile`](../type-aliases/WindProfile.md)[] | The wind profiles themselves, which should be given as a 1D array in row-major order, with the first profile being at the lower-left corner of the grid |

#### Returns

`RawProfileField`\<`GridType`\>

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="grid"></a> `grid` | `readonly` | `GridType` | [RawField.ts:202](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/RawField.ts#L202) |
| <a id="profiles"></a> `profiles` | `readonly` | [`WindProfile`](../type-aliases/WindProfile.md)[] | [RawField.ts:201](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/RawField.ts#L201) |
