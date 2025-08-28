---
title: SPDataConfig
---

# Type Alias: SPDataConfig\<ObsFieldName\>

> **SPDataConfig**\<`ObsFieldName`\> = `Record`\<`ObsFieldName`, [`SPConfig`](SPConfig.md)\>

Defined in: [StationPlot.ts:220](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/StationPlot.ts#L220)

Configuration for station data plots

## Type Parameters

| Type Parameter |
| ------ |
| `ObsFieldName` *extends* `string` |

## Example

```ts
spconfig : SPDataConfig<'id' | 'tmpf' | 'wind' | 'skyc'> = {
     // Add a string to the station plot (like the station ID)
     id:   {type: 'string', pos: 'lr'},

     // Add a number to the station plot (like the temperature)
     tmpf: {type: 'number', pos: 'ul', color: '#cc0000', formatter: val => val === null ? '' : val.toFixed(0)},

     // Add a barb to the station plot
     wind: {type: 'barb', pos: 'c'},

     // Add a symbol to the station plot
     skyc: {type: 'symbol', pos: 'c'},
}
```
