[autumnplot-gl](../README.md) / [Exports](../modules.md) / PlotLayer

# Class: PlotLayer

A static map layer. The data are assumed to be static in time. If the data have a time component (e.g., a model forecast), an [MultiPlotLayer](MultiPlotLayer.md) 
may be more appropriate.

**`Example`**

```ts
// Create map layers from provided fields
const height_layer = new PlotLayer('height-contours', height_contours);
const wind_speed_layer = new PlotLayer('wind-speed-fill', wind_speed_fill);
const barb_layer = new PlotLayer('barbs', wind_barbs);
```

## Hierarchy

- `PlotLayerBase`

  ↳ **`PlotLayer`**

## Table of contents

### Constructors

- [constructor](PlotLayer.md#constructor)

### Properties

- [id](PlotLayer.md#id)
- [type](PlotLayer.md#type)

## Constructors

### constructor

• **new PlotLayer**(`id`, `field`)

Create a map layer from a field

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | A unique id for this layer |
| `field` | [`PlotComponent`](PlotComponent.md) | The field to plot in this layer |

#### Overrides

PlotLayerBase.constructor

#### Defined in

[PlotLayer.ts:37](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/PlotLayer.ts#L37)

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
