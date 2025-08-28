---
title: RasterOptions
---

# Interface: RasterOptions

Defined in: [Fill.ts:42](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Fill.ts#L42)

Options for [Raster](../classes/Raster.md) components

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="cmap"></a> `cmap` | [`ColorMap`](../classes/ColorMap.md) \| [`ColorMap`](../classes/ColorMap.md)[] | The color map to use when creating the raster plot | [Fill.ts:44](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Fill.ts#L44) |
| <a id="cmap_mask"></a> `cmap_mask?` | `null` \| `Uint8Array` | A mask specifying where to use each color map. This should be on the same grid as the RawScalarField passed. A 1 in the mask means to use the first colormap, a 2 means to use the second colormap, etc. | [Fill.ts:50](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Fill.ts#L50) |
| <a id="opacity"></a> `opacity?` | `number` | The opacity for the raster plot **Default** `1` | [Fill.ts:56](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/Fill.ts#L56) |
