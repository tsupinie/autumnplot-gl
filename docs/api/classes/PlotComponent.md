---
title: PlotComponent
---

# Abstract Class: PlotComponent\<MapType\>

Defined in: [PlotComponent.ts:31](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/PlotComponent.ts#L31)

Base class for all plot components

## Extended by

- [`Barbs`](Barbs.md)
- [`Contour`](Contour.md)
- [`ContourLabels`](ContourLabels.md)
- [`Paintball`](Paintball.md)
- [`Hodographs`](Hodographs.md)
- [`StationPlot`](StationPlot.md)

## Type Parameters

| Type Parameter |
| ------ |
| `MapType` *extends* [`MapLikeType`](../type-aliases/MapLikeType.md) |

## Constructors

### Constructor

> **new PlotComponent**\<`MapType`\>(): `PlotComponent`\<`MapType`\>

#### Returns

`PlotComponent`\<`MapType`\>

## Methods

### onAdd()

> `abstract` **onAdd**(`map`, `gl`): `Promise`\<`void`\>

Defined in: [PlotComponent.ts:32](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/PlotComponent.ts#L32)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `map` | `MapType` |
| `gl` | [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md) |

#### Returns

`Promise`\<`void`\>

***

### render()

> `abstract` **render**(`gl`, `arg`): `void`

Defined in: [PlotComponent.ts:33](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/PlotComponent.ts#L33)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `gl` | [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md) |
| `arg` | `RenderMethodArg` |

#### Returns

`void`
