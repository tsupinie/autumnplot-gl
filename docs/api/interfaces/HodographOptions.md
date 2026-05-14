---
title: HodographOptions
---

# Interface: HodographOptions

Defined in: [Hodographs.ts:69](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Hodographs.ts#L69)

Options for [Hodographs](../classes/Hodographs.md) components

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="background_line_width"></a> `background_line_width?` | `number` | The width of the lines on the background in pixels **Default** `1.5` | [Hodographs.ts:93](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Hodographs.ts#L93) |
| <a id="bgcolor"></a> `bgcolor?` | `string` | The color of the hodograph plot background as a hex string **Default** `'#000000'` | [Hodographs.ts:74](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Hodographs.ts#L74) |
| <a id="height_cmap"></a> `height_cmap?` | [`ColorMap`](../classes/ColorMap.md) | The colormap to use for the heights on the hodograph. Default is a yellow-blue colormap. | [Hodographs.ts:98](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Hodographs.ts#L98) |
| <a id="hodo_line_width"></a> `hodo_line_width?` | `number` | The width of the hodograph line in pixels **Default** `2.5` | [Hodographs.ts:87](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Hodographs.ts#L87) |
| <a id="max_wind_speed_ring"></a> `max_wind_speed_ring?` | `number` | The wind speed (in kts) of the largest ring on the hodograph background **Default** `80` | [Hodographs.ts:104](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Hodographs.ts#L104) |
| <a id="thin_fac"></a> `thin_fac?` | `number` | How much to thin the hodographs at zoom level 1 on the map. This effectively means to plot every `n`th hodograph in the i and j directions, where `n` = `thin_fac`. `thin_fac` should be a power of 2. **Default** `1` | [Hodographs.ts:81](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Hodographs.ts#L81) |
