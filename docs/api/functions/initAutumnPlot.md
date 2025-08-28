---
title: initAutumnPlot()
---

# Function: initAutumnPlot()

> **initAutumnPlot**(`opts?`): `void`

Defined in: [index.ts:44](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/index.ts#L44)

Initialize the WebAssembly module in autumnplot-gl. It's not strictly necessary to call it first, but if you call it
first, you can prevent races when you contour a bunch of fields at once.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `opts?` | [`InitAutumnPlotOpts`](../interfaces/InitAutumnPlotOpts.md) |

## Returns

`void`
