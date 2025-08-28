---
title: BarbsOptions
---

# Interface: BarbsOptions

Defined in: [Barbs.ts:131](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Barbs.ts#L131)

Options for [Barbs](../classes/Barbs.md) components

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="barb_size_multiplier"></a> `barb_size_multiplier?` | `number` | A multiplier for the barb size **Default** `1` | [Barbs.ts:153](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Barbs.ts#L153) |
| <a id="cmap"></a> `cmap?` | `null` \| [`ColorMap`](../classes/ColorMap.md) | A color map to use to color the barbs by magnitude. Specifying cmap overrides the color argument. | [Barbs.ts:141](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Barbs.ts#L141) |
| <a id="color"></a> `color?` | `string` | The color to use for the barbs as a hex color string;. **Default** `'#000000'` | [Barbs.ts:136](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Barbs.ts#L136) |
| <a id="line_width"></a> `line_width?` | `number` | The width of the lines to use for the barbs **Default** `2` | [Barbs.ts:147](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Barbs.ts#L147) |
| <a id="thin_fac"></a> `thin_fac?` | `number` | How much to thin the barbs at zoom level 1 on the map. This effectively means to plot every `n`th barb in the i and j directions, where `n` = `thin_fac`. `thin_fac` should be a power of 2. **Default** `1` | [Barbs.ts:160](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/Barbs.ts#L160) |
