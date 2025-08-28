---
title: ObsRawData
---

# Type Alias: ObsRawData\<ObsFieldName\>

> **ObsRawData**\<`ObsFieldName`\> = `Record`\<`ObsFieldName`, `string` \| `number` \| \[`number`, `number`\] \| `null`\>

Defined in: [RawField.ts:259](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/RawField.ts#L259)

Type for an observation data point

## Type Parameters

| Type Parameter |
| ------ |
| `ObsFieldName` *extends* `string` |

## Example

```ts
const obs : ObsRawData<'t' | 'td'> = {'t': 71, 'td': 66};
```
