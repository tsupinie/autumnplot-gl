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

- [id](MultiPlotLayer.md#id)
- [type](MultiPlotLayer.md#type)

### Methods

- [addField](MultiPlotLayer.md#addfield)
- [getKeys](MultiPlotLayer.md#getkeys)
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

[PlotLayer.ts:84](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/PlotLayer.ts#L84)

## Properties

### id

• `Readonly` **id**: `string`

#### Inherited from

PlotLayerBase.id

#### Defined in

[PlotLayer.ts:9](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/PlotLayer.ts#L9)

___

### type

• `Readonly` **type**: ``"custom"``

#### Inherited from

PlotLayerBase.type

#### Defined in

[PlotLayer.ts:8](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/PlotLayer.ts#L8)

## Methods

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

[PlotLayer.ts:145](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/PlotLayer.ts#L145)

___

### getKeys

▸ **getKeys**(): `string`[]

Get a list of all dates/times that have been added to the layer

#### Returns

`string`[]

An array of dates/times

#### Defined in

[PlotLayer.ts:136](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/PlotLayer.ts#L136)

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

[PlotLayer.ts:125](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/PlotLayer.ts#L125)
