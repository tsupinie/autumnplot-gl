[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / PlotLayer

# Class: PlotLayer\<MapType\>

A static map layer. The data are assumed to be static in time. If the data have a time component (e.g., a model forecast), an [MultiPlotLayer](MultiPlotLayer.md) 
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

## Type parameters

• **MapType** *extends* [`MapLikeType`](../type-aliases/MapLikeType.md)

## Constructors

### new PlotLayer()

> **new PlotLayer**\<`MapType`\>(`id`, `field`): [`PlotLayer`](PlotLayer.md)\<`MapType`\>

Create a map layer from a field

#### Parameters

• **id**: `string`

A unique id for this layer

• **field**: [`PlotComponent`](PlotComponent.md)\<`MapType`\>

The field to plot in this layer

#### Returns

[`PlotLayer`](PlotLayer.md)\<`MapType`\>

#### Overrides

`PlotLayerBase<MapType>.constructor`

#### Source

[PlotLayer.ts:45](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/PlotLayer.ts#L45)

## Properties

### id

> `readonly` **id**: `string`

#### Inherited from

`PlotLayerBase.id`

#### Source

[PlotLayer.ts:9](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/PlotLayer.ts#L9)

***

### map

> `protected` **map**: `null` \| `MapType`

#### Inherited from

`PlotLayerBase.map`

#### Source

[PlotLayer.ts:10](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/PlotLayer.ts#L10)

***

### type

> `readonly` **type**: `"custom"`

#### Inherited from

`PlotLayerBase.type`

#### Source

[PlotLayer.ts:8](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/PlotLayer.ts#L8)

## Methods

### repaint()

> `protected` **repaint**(): `void`

#### Returns

`void`

#### Inherited from

`PlotLayerBase.repaint`

#### Source

[PlotLayer.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/PlotLayer.ts#L21)
