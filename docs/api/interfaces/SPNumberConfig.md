---
title: SPNumberConfig
---

# Interface: SPNumberConfig

Defined in: [StationPlot.ts:31](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/StationPlot.ts#L31)

Configuration for numerical values on station plots

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="color"></a> `color?` | `string` | The color to use to draw the number **Default** `'#000000'` | [StationPlot.ts:43](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/StationPlot.ts#L43) |
| <a id="formatter"></a> `formatter?` | (`val`) => `string` | A function that properly formats the number for display **Example** `(val) => val === null ? '' : val.toFixed(0)` | [StationPlot.ts:63](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/StationPlot.ts#L63) |
| <a id="halo"></a> `halo?` | `boolean` | Whether to draw a halo (outline) around the number **Default** `true;` | [StationPlot.ts:49](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/StationPlot.ts#L49) |
| <a id="halo_color"></a> `halo_color?` | `string` | The color to use for the halo (outline) **Default** `'#ffffff'` | [StationPlot.ts:55](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/StationPlot.ts#L55) |
| <a id="pos"></a> `pos` | [`SPPosition`](../type-aliases/SPPosition.md) | The position on the station plot at which to place the number | [StationPlot.ts:37](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/StationPlot.ts#L37) |
| <a id="type"></a> `type` | `"number"` | - | [StationPlot.ts:32](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/StationPlot.ts#L32) |
