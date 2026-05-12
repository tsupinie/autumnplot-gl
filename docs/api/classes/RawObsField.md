---
title: RawObsField
---

# Class: RawObsField\<GridType, ObsFieldName\>

Defined in: [RawField.ts:701](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/RawField.ts#L701)

Raw observation data, given as a list of objects

## Type Parameters

| Type Parameter |
| ------ |
| `GridType` *extends* [`AutoZoomGrid`](../type-aliases/AutoZoomGrid.md) |
| `ObsFieldName` *extends* `string` |

## Constructors

### Constructor

> **new RawObsField**\<`GridType`, `ObsFieldName`\>(`grid`, `data`): `RawObsField`\<`GridType`, `ObsFieldName`\>

Defined in: [RawField.ts:710](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/RawField.ts#L710)

Create a field of observations

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `grid` | `GridType` | The grid on which the obs are defined (can be either a structured or unstructured grid) |
| `data` | [`ObsRawData`](../type-aliases/ObsRawData.md)\<`ObsFieldName`\>[] | The observation data. Conceptually, obs are given as a list of individual observations. |

#### Returns

`RawObsField`\<`GridType`, `ObsFieldName`\>

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="data"></a> `data` | `readonly` | [`ObsRawData`](../type-aliases/ObsRawData.md)\<`ObsFieldName`\>[] | [RawField.ts:703](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/RawField.ts#L703) |
| <a id="grid"></a> `grid` | `readonly` | `GridType` | [RawField.ts:702](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/RawField.ts#L702) |
