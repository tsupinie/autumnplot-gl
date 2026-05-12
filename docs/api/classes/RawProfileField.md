---
title: RawProfileField
---

# Class: RawProfileField\<GridType\>

Defined in: [RawField.ts:639](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/RawField.ts#L639)

A class grid of wind profiles

## Type Parameters

| Type Parameter |
| ------ |
| `GridType` *extends* [`AutoZoomGrid`](../type-aliases/AutoZoomGrid.md) |

## Constructors

### Constructor

> **new RawProfileField**\<`GridType`\>(`grid`, `profiles`): `RawProfileField`\<`GridType`\>

Defined in: [RawField.ts:648](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/RawField.ts#L648)

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
| <a id="grid"></a> `grid` | `readonly` | `GridType` | [RawField.ts:641](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/RawField.ts#L641) |
| <a id="profiles"></a> `profiles` | `readonly` | [`WindProfile`](../type-aliases/WindProfile.md)[] | [RawField.ts:640](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/RawField.ts#L640) |
