---
title: StationPlotOptions
---

# Interface: StationPlotOptions\<ObsFieldName\>

Defined in: [StationPlot.ts:223](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/StationPlot.ts#L223)

Options for [StationPlot](../classes/StationPlot.md) components

## Type Parameters

| Type Parameter |
| ------ |
| `ObsFieldName` *extends* `string` |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="config"></a> `config` | [`SPDataConfig`](../type-aliases/SPDataConfig.md)\<`ObsFieldName`\> | - | [StationPlot.ts:224](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/StationPlot.ts#L224) |
| <a id="font_face"></a> `font_face?` | `string` | Font face to use for plotting text **Default** `'Trebuchet MS'` | [StationPlot.ts:235](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/StationPlot.ts#L235) |
| <a id="font_size"></a> `font_size?` | `number` | Size of the font to use for the text **Default** `12` | [StationPlot.ts:241](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/StationPlot.ts#L241) |
| <a id="font_url_template"></a> `font_url_template?` | `string` | URL template to use in retrieving the font data for the text. The default is to use the template from the map style. | [StationPlot.ts:246](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/StationPlot.ts#L246) |
| <a id="thin_fac"></a> `thin_fac?` | `number` | Thin factor at zoom level 1 for the station plots. Should be a power of 2. **Default** `1` | [StationPlot.ts:229](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/StationPlot.ts#L229) |
