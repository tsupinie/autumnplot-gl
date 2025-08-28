---
title: ContourFillOptions
---

# Interface: ContourFillOptions

Defined in: [Fill.ts:16](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Fill.ts#L16)

Options for [ContourFill](../classes/ContourFill.md) components

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="cmap"></a> `cmap` | [`ColorMap`](../classes/ColorMap.md) \| [`ColorMap`](../classes/ColorMap.md)[] | The color maps to use when creating the fills | [Fill.ts:18](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Fill.ts#L18) |
| <a id="cmap_mask"></a> `cmap_mask?` | `null` \| `Uint8Array` | A mask specifying where to use each color map. This should be on the same grid as the RawScalarField passed. A 1 in the mask means to use the first colormap, a 2 means to use the second colormap, etc. | [Fill.ts:24](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Fill.ts#L24) |
| <a id="opacity"></a> `opacity?` | `number` | The opacity for the filled contours **Default** `1` | [Fill.ts:30](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Fill.ts#L30) |
