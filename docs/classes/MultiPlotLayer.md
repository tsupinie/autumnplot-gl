[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / MultiPlotLayer

# Class: MultiPlotLayer\<MapType\>

A varying map layer. If the data don't have a varying component, such as over time, it might be easier to use an [PlotLayer](PlotLayer.md) instead.

## Example

```ts
// Create a varying map layer
height_layer = new MultiPlotLayer('height-contours');

// Add some fields to it
height_layer.addField(height_contour_f00, '20230112_1200');
height_layer.addField(height_contour_f01, '20230112_1300');
height_layer.addField(height_contour_f02, '20230112_1400');

// Set the date/time in the map layer
height_layer.setActiveKey('20230112_1200');
```

## Extends

- `PlotLayerBase`\<`MapType`\>

## Type parameters

• **MapType** *extends* [`MapLikeType`](../type-aliases/MapLikeType.md)

## Constructors

### new MultiPlotLayer()

> **new MultiPlotLayer**\<`MapType`\>(`id`): [`MultiPlotLayer`](MultiPlotLayer.md)\<`MapType`\>

Create a time-varying map layer

#### Parameters

• **id**: `string`

A unique id for this layer

#### Returns

[`MultiPlotLayer`](MultiPlotLayer.md)\<`MapType`\>

#### Overrides

`PlotLayerBase<MapType>.constructor`

#### Source

[PlotLayer.ts:92](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/PlotLayer.ts#L92)

## Properties

### id

> `readonly` **id**: `string`

#### Inherited from

`PlotLayerBase.id`

#### Source

[PlotLayer.ts:9](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/PlotLayer.ts#L9)

***

### map

> `protected` **map**: `MapType`

#### Inherited from

`PlotLayerBase.map`

#### Source

[PlotLayer.ts:10](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/PlotLayer.ts#L10)

***

### type

> `readonly` **type**: `"custom"`

#### Inherited from

`PlotLayerBase.type`

#### Source

[PlotLayer.ts:8](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/PlotLayer.ts#L8)

## Methods

### addField()

> **addField**(`field`, `key`): `void`

Add a field with a given key

#### Parameters

• **field**: [`PlotComponent`](PlotComponent.md)\<`MapType`\>

The field to add

• **key**: `string`

The key to associate with the field

#### Returns

`void`

#### Source

[PlotLayer.ts:153](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/PlotLayer.ts#L153)

***

### getKeys()

> **getKeys**(): `string`[]

Get a list of all dates/times that have been added to the layer

#### Returns

`string`[]

An array of dates/times

#### Source

[PlotLayer.ts:144](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/PlotLayer.ts#L144)

***

### repaint()

> `protected` **repaint**(): `void`

#### Returns

`void`

#### Inherited from

`PlotLayerBase.repaint`

#### Source

[PlotLayer.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/PlotLayer.ts#L21)

***

### setActiveKey()

> **setActiveKey**(`key`): `void`

Set the active key

#### Parameters

• **key**: `string`

The new key. The field with that key is plotted immediately.

#### Returns

`void`

#### Source

[PlotLayer.ts:133](https://github.com/tsupinie/autumnplot-gl/blob/7275cfd3c408281ebdf9877f1a2a5b354d6cd87f/src/PlotLayer.ts#L133)
