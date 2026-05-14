---
title: ContourOptions
---

# Interface: ContourOptions

Defined in: [Contour.ts:16](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Contour.ts#L16)

Options for [Contour](../classes/Contour.md) components

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="cmap"></a> `cmap?` | `null` \| [`ColorMap`](../classes/ColorMap.md) | A color map to use to color the contours. Specifying a colormap overrides the color option. **Default** `null` | [Contour.ts:27](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Contour.ts#L27) |
| <a id="color"></a> `color?` | `string` | The color of the contours as a hex color string **Default** `'#000000'` | [Contour.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Contour.ts#L21) |
| <a id="interval"></a> `interval?` | `number` | The contour interval for drawing contours at regular intervals **Default** `1` | [Contour.ts:33](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Contour.ts#L33) |
| <a id="levels"></a> `levels?` | `null` \| `number`[] | A list of arbitrary levels to contour. This overrides the `interval` option. **Default** `null` | [Contour.ts:39](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Contour.ts#L39) |
| <a id="line_style"></a> `line_style?` | [`LineStyle`](../type-aliases/LineStyle.md) \| (`level`) => [`LineStyle`](../type-aliases/LineStyle.md) | The style to use for the line. This can be either a LineStyle or a function that takes a contour level as a number and returns a LineStyle. This can be used to vary the contours by value. **Example** `level => level < 0 ? '--' : '-'` **Default** `'-'` | [Contour.ts:55](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Contour.ts#L55) |
| <a id="line_width"></a> `line_width?` | `number` \| (`level`) => `number` | The width of the line in pixels. This could be either a number or a function that takes a contour level as a number and returns a line width. This can be used to vary the width of the contours by value. **Example** `level => level >= 100 ? 3 : 1.5` **Default** `2` | [Contour.ts:47](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Contour.ts#L47) |
| <a id="quad_as_tri"></a> `quad_as_tri?` | `boolean` | - | [Contour.ts:61](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/Contour.ts#L61) |
