---
title: ObsRawData
---

# Type Alias: ObsRawData\<ObsFieldName\>

> **ObsRawData**\<`ObsFieldName`\> = `Record`\<`ObsFieldName`, `string` \| `number` \| \[`number`, `number`\] \| `null`\>

Defined in: [RawField.ts:698](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/RawField.ts#L698)

Type for an observation data point

## Type Parameters

| Type Parameter |
| ------ |
| `ObsFieldName` *extends* `string` |

## Example

```ts
const obs : ObsRawData<'t' | 'td'> = {'t': 71, 'td': 66};
```
