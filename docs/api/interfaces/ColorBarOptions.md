---
title: ColorBarOptions
---

# Interface: ColorBarOptions

Defined in: [ColorBar.ts:13](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/ColorBar.ts#L13)

Options for [makeColorBar](../functions/makeColorBar.md)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="fontface"></a> `fontface?` | `string` | A font face to use for the label and tick values. **Default** `'sans-serif'` | [ColorBar.ts:52](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/ColorBar.ts#L52) |
| <a id="label"></a> `label?` | `string` | The label to place along the color bar | [ColorBar.ts:15](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/ColorBar.ts#L15) |
| <a id="orientation"></a> `orientation?` | [`ColorbarOrientation`](../type-aliases/ColorbarOrientation.md) | The orientation for the color bar. Valid values are 'horizontal' and 'vertical'. **Default** `'vertical'` | [ColorBar.ts:46](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/ColorBar.ts#L46) |
| <a id="outline_and_text_color"></a> `outline_and_text_color?` | `string` | The color for the color bar outline and the text **Default** `'#000000'` | [ColorBar.ts:64](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/ColorBar.ts#L64) |
| <a id="size_long"></a> `size_long?` | `number` | The size in pixels along the long axis of the colorbar **Default** `600` | [ColorBar.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/ColorBar.ts#L21) |
| <a id="size_short"></a> `size_short?` | `number` | The size in pixels along the short axis of the colorbar **Default** `size_long / 9` | [ColorBar.ts:27](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/ColorBar.ts#L27) |
| <a id="tick_direction"></a> `tick_direction?` | [`ColorbarTickDirection`](../type-aliases/ColorbarTickDirection.md) | The direction the ticks should face. Valid values are 'left' and 'right' if orientation is 'vertical' and 'top' and 'bottom' if orientation is 'horizontal'. **Default** `'left' if orientation is 'vertical' and 'bottom' if orientation is 'horizontal'` | [ColorBar.ts:40](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/ColorBar.ts#L40) |
| <a id="ticklabelsize"></a> `ticklabelsize?` | `number` | The font size (in points) to use for the tick labels **Default** `12` | [ColorBar.ts:58](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/ColorBar.ts#L58) |
| <a id="ticks"></a> `ticks?` | `number`[] | An array of numbers to use as the tick locations. **Default** Use all the levels in the color map provided to [makeColorBar](../functions/makeColorBar.md). | [ColorBar.ts:33](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/ColorBar.ts#L33) |
