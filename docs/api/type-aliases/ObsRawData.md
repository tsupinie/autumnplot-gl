---
title: ObsRawData
---

# Type Alias: ObsRawData\<ObsFieldName\>

> **ObsRawData**\<`ObsFieldName`\> = `Record`\<`ObsFieldName`, `string` \| `number` \| \[`number`, `number`\] \| `null`\>

Defined in: [RawField.ts:698](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/RawField.ts#L698)

Type for an observation data point

## Type Parameters

| Type Parameter |
| ------ |
| `ObsFieldName` *extends* `string` |

## Example

```ts
const obs : ObsRawData<'t' | 'td'> = {'t': 71, 'td': 66};
```
