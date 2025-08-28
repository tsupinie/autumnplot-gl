---
title: MultiPlotLayer
---

# Class: MultiPlotLayer\<MapType\>

Defined in: [PlotLayer.ts:82](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/PlotLayer.ts#L82)

A varying map layer. If the data don't have a varying component, such as over time, it might be easier to use a [PlotLayer](PlotLayer.md) instead.

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

## Type Parameters

| Type Parameter |
| ------ |
| `MapType` *extends* [`MapLikeType`](../type-aliases/MapLikeType.md) |

## Constructors

### Constructor

> **new MultiPlotLayer**\<`MapType`\>(`id`): `MultiPlotLayer`\<`MapType`\>

Defined in: [PlotLayer.ts:92](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/PlotLayer.ts#L92)

Create a time-varying map layer

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | A unique id for this layer |

#### Returns

`MultiPlotLayer`\<`MapType`\>

#### Overrides

`PlotLayerBase<MapType>.constructor`

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `readonly` | `string` | `PlotLayerBase.id` | [PlotLayer.ts:9](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/PlotLayer.ts#L9) |
| <a id="map"></a> `map` | `protected` | `null` \| `MapType` | `PlotLayerBase.map` | [PlotLayer.ts:10](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/PlotLayer.ts#L10) |
| <a id="type"></a> `type` | `readonly` | `"custom"` | `PlotLayerBase.type` | [PlotLayer.ts:8](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/PlotLayer.ts#L8) |

## Methods

### addField()

> **addField**(`field`, `key`): `void`

Defined in: [PlotLayer.ts:153](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/PlotLayer.ts#L153)

Add a field with a given key

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`PlotComponent`](PlotComponent.md)\<`MapType`\> | The field to add |
| `key` | `string` | The key to associate with the field |

#### Returns

`void`

***

### getKeys()

> **getKeys**(): `string`[]

Defined in: [PlotLayer.ts:144](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/PlotLayer.ts#L144)

Get a list of all dates/times that have been added to the layer

#### Returns

`string`[]

An array of dates/times

***

### repaint()

> `protected` **repaint**(): `void`

Defined in: [PlotLayer.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/PlotLayer.ts#L21)

#### Returns

`void`

#### Inherited from

`PlotLayerBase.repaint`

***

### setActiveKey()

> **setActiveKey**(`key`): `void`

Defined in: [PlotLayer.ts:133](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/PlotLayer.ts#L133)

Set the active key

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The new key. The field with that key is plotted immediately. |

#### Returns

`void`
