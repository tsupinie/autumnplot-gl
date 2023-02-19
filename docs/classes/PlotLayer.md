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

- [field](PlotLayer.md#field)
- [id](PlotLayer.md#id)
- [type](PlotLayer.md#type)

### Methods

- [onAdd](PlotLayer.md#onadd)
- [render](PlotLayer.md#render)

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

[PlotLayer.ts:36](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/PlotLayer.ts#L36)

## Properties

### field

• `Readonly` **field**: [`PlotComponent`](PlotComponent.md)

#### Defined in

[PlotLayer.ts:29](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/PlotLayer.ts#L29)

___

### id

• `Readonly` **id**: `string`

#### Inherited from

PlotLayerBase.id

#### Defined in

[PlotLayer.ts:8](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/PlotLayer.ts#L8)

___

### type

• `Readonly` **type**: ``"custom"``

#### Inherited from

PlotLayerBase.type

#### Defined in

[PlotLayer.ts:7](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/PlotLayer.ts#L7)

## Methods

### onAdd

▸ **onAdd**(`map`, `gl`): `void`

Add this layer to a map

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | [`MapType`](../modules.md#maptype) |
| `gl` | `WebGLRenderingContext` |

#### Returns

`void`

#### Overrides

PlotLayerBase.onAdd

#### Defined in

[PlotLayer.ts:45](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/PlotLayer.ts#L45)

___

### render

▸ **render**(`gl`, `matrix`): `void`

Render this layer

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `matrix` | `number`[] |

#### Returns

`void`

#### Overrides

PlotLayerBase.render

#### Defined in

[PlotLayer.ts:53](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/PlotLayer.ts#L53)
