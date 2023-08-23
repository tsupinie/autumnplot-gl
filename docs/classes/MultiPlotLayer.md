[autumnplot-gl](../README.md) / [Exports](../modules.md) / MultiPlotLayer

# Class: MultiPlotLayer

A varying map layer. If the data don't have a varying component, such as over time, it might be easier to use an [PlotLayer](PlotLayer.md) instead.

**`Example`**

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

## Hierarchy

- `PlotLayerBase`

  ↳ **`MultiPlotLayer`**

## Table of contents

### Constructors

- [constructor](MultiPlotLayer.md#constructor)

### Properties

- [field\_key](MultiPlotLayer.md#field_key)
- [fields](MultiPlotLayer.md#fields)
- [gl](MultiPlotLayer.md#gl)
- [id](MultiPlotLayer.md#id)
- [map](MultiPlotLayer.md#map)
- [type](MultiPlotLayer.md#type)

### Methods

- [\_repaintIfNecessary](MultiPlotLayer.md#_repaintifnecessary)
- [addField](MultiPlotLayer.md#addfield)
- [getKeys](MultiPlotLayer.md#getkeys)
- [onAdd](MultiPlotLayer.md#onadd)
- [render](MultiPlotLayer.md#render)
- [setActiveKey](MultiPlotLayer.md#setactivekey)

## Constructors

### constructor

• **new MultiPlotLayer**(`id`)

Create a time-varying map layer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | A unique id for this layer |

#### Overrides

PlotLayerBase.constructor

#### Defined in

[PlotLayer.ts:88](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/PlotLayer.ts#L88)

## Properties

### field\_key

• `Private` **field\_key**: `string`

#### Defined in

[PlotLayer.ts:77](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/PlotLayer.ts#L77)

___

### fields

• `Private` **fields**: `Record`<`string`, [`PlotComponent`](PlotComponent.md)\>

#### Defined in

[PlotLayer.ts:75](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/PlotLayer.ts#L75)

___

### gl

• `Private` **gl**: [`WebGLAnyRenderingContext`](../modules.md#webglanyrenderingcontext)

#### Defined in

[PlotLayer.ts:82](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/PlotLayer.ts#L82)

___

### id

• `Readonly` **id**: `string`

#### Inherited from

PlotLayerBase.id

#### Defined in

[PlotLayer.ts:9](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/PlotLayer.ts#L9)

___

### map

• `Private` **map**: [`MapType`](../modules.md#maptype)

#### Defined in

[PlotLayer.ts:80](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/PlotLayer.ts#L80)

___

### type

• `Readonly` **type**: ``"custom"``

#### Inherited from

PlotLayerBase.type

#### Defined in

[PlotLayer.ts:8](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/PlotLayer.ts#L8)

## Methods

### \_repaintIfNecessary

▸ `Private` **_repaintIfNecessary**(`old_field_key`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `old_field_key` | `string` |

#### Returns

`void`

#### Defined in

[PlotLayer.ts:166](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/PlotLayer.ts#L166)

___

### addField

▸ **addField**(`field`, `key`): `void`

Add a field valid at a specific date/time

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | [`PlotComponent`](PlotComponent.md) | The field to add |
| `key` | `string` | - |

#### Returns

`void`

#### Defined in

[PlotLayer.ts:149](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/PlotLayer.ts#L149)

___

### getKeys

▸ **getKeys**(): `string`[]

Get a list of all dates/times that have been added to the layer

#### Returns

`string`[]

An array of dates/times

#### Defined in

[PlotLayer.ts:140](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/PlotLayer.ts#L140)

___

### onAdd

▸ **onAdd**(`map`, `gl`): `void`

Add this layer to a map

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | [`MapType`](../modules.md#maptype) |
| `gl` | [`WebGLAnyRenderingContext`](../modules.md#webglanyrenderingcontext) |

#### Returns

`void`

#### Overrides

PlotLayerBase.onAdd

#### Defined in

[PlotLayer.ts:101](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/PlotLayer.ts#L101)

___

### render

▸ **render**(`gl`, `matrix`): `void`

Render this layer

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | [`WebGLAnyRenderingContext`](../modules.md#webglanyrenderingcontext) |
| `matrix` | `number`[] |

#### Returns

`void`

#### Overrides

PlotLayerBase.render

#### Defined in

[PlotLayer.ts:118](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/PlotLayer.ts#L118)

___

### setActiveKey

▸ **setActiveKey**(`key`): `void`

Set the active key

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The new key |

#### Returns

`void`

#### Defined in

[PlotLayer.ts:129](https://github.com/tsupinie/autumnplot-gl/blob/9814269/src/PlotLayer.ts#L129)
