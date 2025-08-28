---
title: PlotComponent
---

# Abstract Class: PlotComponent\<MapType\>

Defined in: [PlotComponent.ts:13](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/PlotComponent.ts#L13)

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

Defined in: [PlotComponent.ts:14](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/PlotComponent.ts#L14)

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

Defined in: [PlotComponent.ts:15](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/PlotComponent.ts#L15)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `gl` | [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md) |
| `arg` | `RenderMethodArg` |

#### Returns

`void`
