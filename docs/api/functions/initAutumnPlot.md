---
title: initAutumnPlot()
---

# Function: initAutumnPlot()

> **initAutumnPlot**(`opts?`): `void`

Defined in: [index.ts:56](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/index.ts#L56)

Initialize the WebAssembly module in autumnplot-gl. It's not strictly necessary to call it first, but if you call it
first, you can prevent races when you contour a bunch of fields at once.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `opts?` | [`InitAutumnPlotOpts`](../interfaces/InitAutumnPlotOpts.md) |

## Returns

`void`
