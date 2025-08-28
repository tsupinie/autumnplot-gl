---
title: ObsRawData
---

# Type Alias: ObsRawData\<ObsFieldName\>

> **ObsRawData**\<`ObsFieldName`\> = `Record`\<`ObsFieldName`, `string` \| `number` \| \[`number`, `number`\] \| `null`\>

Defined in: [RawField.ts:259](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/RawField.ts#L259)

Type for an observation data point

## Type Parameters

| Type Parameter |
| ------ |
| `ObsFieldName` *extends* `string` |

## Example

```ts
const obs : ObsRawData<'t' | 'td'> = {'t': 71, 'td': 66};
```
