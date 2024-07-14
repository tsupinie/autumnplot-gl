[**autumnplot-gl**](../index.md) • **Docs**

***

[autumnplot-gl](../globals.md) / PlotComponent

# Class: `abstract` PlotComponent\<MapType\>

## Extended by

- [`Barbs`](Barbs.md)
- [`Contour`](Contour.md)
- [`ContourLabels`](ContourLabels.md)
- [`Paintball`](Paintball.md)
- [`Hodographs`](Hodographs.md)

## Type parameters

• **MapType** *extends* [`MapLikeType`](../type-aliases/MapLikeType.md)

## Constructors

### new PlotComponent()

> **new PlotComponent**\<`MapType`\>(): [`PlotComponent`](PlotComponent.md)\<`MapType`\>

#### Returns

[`PlotComponent`](PlotComponent.md)\<`MapType`\>

## Methods

### onAdd()

> `abstract` **onAdd**(`map`, `gl`): `Promise`\<`void`\>

#### Parameters

• **map**: `MapType`

• **gl**: [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md)

#### Returns

`Promise`\<`void`\>

#### Source

[PlotComponent.ts:13](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/PlotComponent.ts#L13)

***

### render()

> `abstract` **render**(`gl`, `matrix`): `void`

#### Parameters

• **gl**: [`WebGLAnyRenderingContext`](../type-aliases/WebGLAnyRenderingContext.md)

• **matrix**: `number`[] \| `Float32Array`

#### Returns

`void`

#### Source

[PlotComponent.ts:14](https://github.com/tsupinie/autumnplot-gl/blob/f3c7a419dbb9b291dc2fc3e12d17fe6bae8ddba4/src/PlotComponent.ts#L14)
