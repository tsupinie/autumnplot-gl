---
title: SPNumberConfig
---

# Interface: SPNumberConfig

Defined in: [StationPlot.ts:32](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/StationPlot.ts#L32)

Configuration for numerical values on station plots

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="color"></a> `color?` | `string` | The color to use to draw the number **Default** `'#000000'` | [StationPlot.ts:44](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/StationPlot.ts#L44) |
| <a id="formatter"></a> `formatter?` | (`val`) => `string` | A function that properly formats the number for display **Example** `(val) => val === null ? '' : val.toFixed(0)` | [StationPlot.ts:64](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/StationPlot.ts#L64) |
| <a id="halo"></a> `halo?` | `boolean` | Whether to draw a halo (outline) around the number **Default** `true;` | [StationPlot.ts:50](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/StationPlot.ts#L50) |
| <a id="halo_color"></a> `halo_color?` | `string` | The color to use for the halo (outline) **Default** `'#ffffff'` | [StationPlot.ts:56](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/StationPlot.ts#L56) |
| <a id="pos"></a> `pos` | [`SPPosition`](../type-aliases/SPPosition.md) | The position on the station plot at which to place the number | [StationPlot.ts:38](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/StationPlot.ts#L38) |
| <a id="type"></a> `type` | `"number"` | - | [StationPlot.ts:33](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/StationPlot.ts#L33) |
