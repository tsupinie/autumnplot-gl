---
title: ColorBarOptions
---

# Interface: ColorBarOptions

Defined in: [ColorBar.ts:12](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/ColorBar.ts#L12)

Options for ColorBars

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="fontface"></a> `fontface?` | `string` | A font face to use for the label and tick values. **Default** `'sans-serif'` | [ColorBar.ts:51](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/ColorBar.ts#L51) |
| <a id="label"></a> `label?` | `string` | The label to place along the color bar | [ColorBar.ts:14](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/ColorBar.ts#L14) |
| <a id="orientation"></a> `orientation?` | [`ColorbarOrientation`](../type-aliases/ColorbarOrientation.md) | The orientation for the color bar. Valid values are 'horizontal' and 'vertical'. **Default** `'vertical'` | [ColorBar.ts:45](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/ColorBar.ts#L45) |
| <a id="outline_and_text_color"></a> `outline_and_text_color?` | `string` | The color for the color bar outline and the text **Default** `'#000000'` | [ColorBar.ts:63](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/ColorBar.ts#L63) |
| <a id="size_long"></a> `size_long?` | `number` | The size in pixels along the long axis of the colorbar **Default** `600` | [ColorBar.ts:20](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/ColorBar.ts#L20) |
| <a id="size_short"></a> `size_short?` | `number` | The size in pixels along the short axis of the colorbar **Default** `size_long / 9` | [ColorBar.ts:26](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/ColorBar.ts#L26) |
| <a id="tick_direction"></a> `tick_direction?` | [`ColorbarTickDirection`](../type-aliases/ColorbarTickDirection.md) | The direction the ticks should face. Valid values are 'left' and 'right' if orientation is 'vertical' and 'top' and 'bottom' if orientation is 'horizontal'. **Default** `'left' if orientation is 'vertical' and 'bottom' if orientation is 'horizontal'` | [ColorBar.ts:39](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/ColorBar.ts#L39) |
| <a id="ticklabelsize"></a> `ticklabelsize?` | `number` | The font size (in points) to use for the tick labels **Default** `12` | [ColorBar.ts:57](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/ColorBar.ts#L57) |
| <a id="ticks"></a> `ticks?` | `number`[] | An array of numbers to use as the tick locations. **Default** Use all the levels in the color map provided to [makeColorBar](../functions/makeColorBar.md). | [ColorBar.ts:32](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/ColorBar.ts#L32) |
