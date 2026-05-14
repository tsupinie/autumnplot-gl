---
title: StationPlotOptions
---

# Interface: StationPlotOptions\<ObsFieldName\>

Defined in: [StationPlot.ts:231](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/StationPlot.ts#L231)

Options for [StationPlot](../classes/StationPlot.md) components

## Type Parameters

| Type Parameter |
| ------ |
| `ObsFieldName` *extends* `string` |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="config"></a> `config` | [`SPDataConfig`](../type-aliases/SPDataConfig.md)\<`ObsFieldName`\> | - | [StationPlot.ts:232](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/StationPlot.ts#L232) |
| <a id="font_face"></a> `font_face?` | `string` | Font face to use for plotting text **Default** `'Trebuchet MS'` | [StationPlot.ts:243](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/StationPlot.ts#L243) |
| <a id="font_size"></a> `font_size?` | `number` | Size of the font to use for the text **Default** `12` | [StationPlot.ts:249](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/StationPlot.ts#L249) |
| <a id="font_url_template"></a> `font_url_template?` | `string` | URL template to use in retrieving the font data for the text. The default is to use the template from the map style. | [StationPlot.ts:254](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/StationPlot.ts#L254) |
| <a id="thin_fac"></a> `thin_fac?` | `number` | Thin factor at zoom level 1 for the station plots. Should be a power of 2. **Default** `1` | [StationPlot.ts:237](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/StationPlot.ts#L237) |
