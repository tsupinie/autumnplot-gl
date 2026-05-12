---
title: ContourLabelOptions
---

# Interface: ContourLabelOptions

Defined in: [Contour.ts:223](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Contour.ts#L223)

Options for [ContourLabels](../classes/ContourLabels.md)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="density"></a> `density?` | `number` | Label density. 2 makes the labels twice as dense, 0.5 makes them half as dense. **Default** `1` | [Contour.ts:276](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Contour.ts#L276) |
| <a id="font_face"></a> `font_face?` | `string` | Font face to use for the contour labels **Default** `'Trebuchet MS'` | [Contour.ts:234](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Contour.ts#L234) |
| <a id="font_size"></a> `font_size?` | `number` | Font size in points to use for the contour labels **Default** `12` | [Contour.ts:240](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Contour.ts#L240) |
| <a id="font_url_template"></a> `font_url_template?` | `string` | URL template to use in retrieving the font data for the labels. The default is to use the template from the map style. | [Contour.ts:245](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Contour.ts#L245) |
| <a id="halo"></a> `halo?` | `boolean` | Whether to draw the halo (outline) on the contour labels **Default** `false` | [Contour.ts:270](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Contour.ts#L270) |
| <a id="halo_color"></a> `halo_color?` | `string` | Halo (outline) color for the contour labels **Default** `'#000000'` | [Contour.ts:264](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Contour.ts#L264) |
| <a id="label_formatter"></a> `label_formatter?` | (`val`) => `string` | Function to format the labels from numbers to a string **Example** `val => Math.round(val).toString() // Round a number before to the nearest integer before converting to a string` **Default** `val => val.toString()` | [Contour.ts:252](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Contour.ts#L252) |
| <a id="n_decimal_places"></a> `n_decimal_places?` | `number` | Number of decimal places to use in the contour labels **Default** `0` | [Contour.ts:228](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Contour.ts#L228) |
| <a id="text_color"></a> `text_color?` | `string` | Text color for the contour labels **Default** `'#000000'` | [Contour.ts:258](https://github.com/tsupinie/autumnplot-gl/blob/0822947f9111ebf4b3b48d4d1f9022809e8030c4/src/Contour.ts#L258) |
