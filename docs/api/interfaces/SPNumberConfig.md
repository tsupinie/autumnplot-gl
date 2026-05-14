---
title: SPNumberConfig
---

# Interface: SPNumberConfig

Defined in: [StationPlot.ts:33](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/StationPlot.ts#L33)

Configuration for numerical values on station plots

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="cmap"></a> `cmap?` | `null` \| [`ColorMap`](../classes/ColorMap.md) | A colormap to use for coloring numeric values **Default** `null` | [StationPlot.ts:51](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/StationPlot.ts#L51) |
| <a id="color"></a> `color?` | `string` | The color to use to draw the number **Default** `'#000000'` | [StationPlot.ts:45](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/StationPlot.ts#L45) |
| <a id="formatter"></a> `formatter?` | (`val`) => `string` | A function that properly formats the number for display **Example** `(val) => val === null ? '' : val.toFixed(0)` | [StationPlot.ts:71](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/StationPlot.ts#L71) |
| <a id="halo"></a> `halo?` | `boolean` | Whether to draw a halo (outline) around the number **Default** `true;` | [StationPlot.ts:57](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/StationPlot.ts#L57) |
| <a id="halo_color"></a> `halo_color?` | `string` | The color to use for the halo (outline) **Default** `'#ffffff'` | [StationPlot.ts:63](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/StationPlot.ts#L63) |
| <a id="pos"></a> `pos` | [`SPPosition`](../type-aliases/SPPosition.md) | The position on the station plot at which to place the number | [StationPlot.ts:39](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/StationPlot.ts#L39) |
| <a id="type"></a> `type` | `"number"` | - | [StationPlot.ts:34](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/StationPlot.ts#L34) |
