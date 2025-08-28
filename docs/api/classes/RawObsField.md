---
title: RawObsField
---

# Class: RawObsField\<GridType, ObsFieldName\>

Defined in: [RawField.ts:262](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/RawField.ts#L262)

Raw observation data, given as a list of objects

## Type Parameters

| Type Parameter |
| ------ |
| `GridType` *extends* [`Grid`](Grid.md) |
| `ObsFieldName` *extends* `string` |

## Constructors

### Constructor

> **new RawObsField**\<`GridType`, `ObsFieldName`\>(`grid`, `data`): `RawObsField`\<`GridType`, `ObsFieldName`\>

Defined in: [RawField.ts:271](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/RawField.ts#L271)

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
| <a id="data"></a> `data` | `readonly` | [`ObsRawData`](../type-aliases/ObsRawData.md)\<`ObsFieldName`\>[] | [RawField.ts:264](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/RawField.ts#L264) |
| <a id="grid"></a> `grid` | `readonly` | `GridType` | [RawField.ts:263](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/RawField.ts#L263) |
