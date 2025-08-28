---
title: HodographOptions
---

# Interface: HodographOptions

Defined in: [Hodographs.ts:68](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Hodographs.ts#L68)

Options for [Hodographs](../classes/Hodographs.md) components

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="background_line_width"></a> `background_line_width?` | `number` | The width of the lines on the background in pixels **Default** `1.5` | [Hodographs.ts:92](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Hodographs.ts#L92) |
| <a id="bgcolor"></a> `bgcolor?` | `string` | The color of the hodograph plot background as a hex string **Default** `'#000000'` | [Hodographs.ts:73](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Hodographs.ts#L73) |
| <a id="height_cmap"></a> `height_cmap?` | [`ColorMap`](../classes/ColorMap.md) | The colormap to use for the heights on the hodograph. Default is a yellow-blue colormap. | [Hodographs.ts:97](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Hodographs.ts#L97) |
| <a id="hodo_line_width"></a> `hodo_line_width?` | `number` | The width of the hodograph line in pixels **Default** `2.5` | [Hodographs.ts:86](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Hodographs.ts#L86) |
| <a id="max_wind_speed_ring"></a> `max_wind_speed_ring?` | `number` | The wind speed (in kts) of the largest ring on the hodograph background **Default** `80` | [Hodographs.ts:103](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Hodographs.ts#L103) |
| <a id="thin_fac"></a> `thin_fac?` | `number` | How much to thin the hodographs at zoom level 1 on the map. This effectively means to plot every `n`th hodograph in the i and j directions, where `n` = `thin_fac`. `thin_fac` should be a power of 2. **Default** `1` | [Hodographs.ts:80](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Hodographs.ts#L80) |
