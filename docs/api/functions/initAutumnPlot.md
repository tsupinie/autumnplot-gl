---
title: initAutumnPlot()
---

# Function: initAutumnPlot()

> **initAutumnPlot**(`opts?`): `void`

Defined in: [index.ts:55](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/index.ts#L55)

Initialize the WebAssembly module in autumnplot-gl. It's not strictly necessary to call it first, but if you call it
first, you can prevent races when you contour a bunch of fields at once.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `opts?` | [`InitAutumnPlotOpts`](../interfaces/InitAutumnPlotOpts.md) |

## Returns

`void`
