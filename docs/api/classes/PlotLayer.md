---
title: PlotLayer
---

# Class: PlotLayer\<MapType\>

Defined in: [PlotLayer.ts:37](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/PlotLayer.ts#L37)

A static map layer. The data are assumed to be static in time. If the data have a time component (e.g., a model forecast), a [MultiPlotLayer](MultiPlotLayer.md) 
may be more appropriate.

## Example

```ts
// Create map layers from provided fields
const height_layer = new PlotLayer('height-contours', height_contours);
const wind_speed_layer = new PlotLayer('wind-speed-fill', wind_speed_fill);
const barb_layer = new PlotLayer('barbs', wind_barbs);
```

## Extends

- `PlotLayerBase`\<`MapType`\>

## Type Parameters

| Type Parameter |
| ------ |
| `MapType` *extends* [`MapLikeType`](../type-aliases/MapLikeType.md) |

## Constructors

### Constructor

> **new PlotLayer**\<`MapType`\>(`id`, `field`): `PlotLayer`\<`MapType`\>

Defined in: [PlotLayer.ts:45](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/PlotLayer.ts#L45)

Create a map layer from a field

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | A unique id for this layer |
| `field` | [`PlotComponent`](PlotComponent.md)\<`MapType`\> | The field to plot in this layer |

#### Returns

`PlotLayer`\<`MapType`\>

#### Overrides

`PlotLayerBase<MapType>.constructor`

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `readonly` | `string` | `PlotLayerBase.id` | [PlotLayer.ts:9](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/PlotLayer.ts#L9) |
| <a id="map"></a> `map` | `protected` | `null` \| `MapType` | `PlotLayerBase.map` | [PlotLayer.ts:10](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/PlotLayer.ts#L10) |
| <a id="type"></a> `type` | `readonly` | `"custom"` | `PlotLayerBase.type` | [PlotLayer.ts:8](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/PlotLayer.ts#L8) |

## Methods

### repaint()

> `protected` **repaint**(): `void`

Defined in: [PlotLayer.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/PlotLayer.ts#L21)

#### Returns

`void`

#### Inherited from

`PlotLayerBase.repaint`
