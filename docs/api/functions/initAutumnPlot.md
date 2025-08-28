---
title: initAutumnPlot()
---

# Function: initAutumnPlot()

> **initAutumnPlot**(`opts?`): `void`

Defined in: [index.ts:44](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/index.ts#L44)

Initialize the WebAssembly module in autumnplot-gl. It's not strictly necessary to call it first, but if you call it
first, you can prevent races when you contour a bunch of fields at once.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `opts?` | [`InitAutumnPlotOpts`](../interfaces/InitAutumnPlotOpts.md) |

## Returns

`void`
