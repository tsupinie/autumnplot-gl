[autumnplot-gl](../README.md) / [Exports](../modules.md) / PlotComponent

# Class: PlotComponent

## Hierarchy

- **`PlotComponent`**

  ↳ [`Barbs`](Barbs.md)

  ↳ [`Contour`](Contour.md)

  ↳ [`Paintball`](Paintball.md)

  ↳ [`Hodographs`](Hodographs.md)

## Table of contents

### Constructors

- [constructor](PlotComponent.md#constructor)

### Methods

- [onAdd](PlotComponent.md#onadd)
- [render](PlotComponent.md#render)

## Constructors

### constructor

• **new PlotComponent**()

## Methods

### onAdd

▸ `Abstract` **onAdd**(`map`, `gl`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | [`MapType`](../modules.md#maptype) |
| `gl` | [`WebGLAnyRenderingContext`](../modules.md#webglanyrenderingcontext) |

#### Returns

`Promise`<`void`\>

#### Defined in

[PlotComponent.ts:13](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/PlotComponent.ts#L13)

___

### render

▸ `Abstract` **render**(`gl`, `matrix`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | [`WebGLAnyRenderingContext`](../modules.md#webglanyrenderingcontext) |
| `matrix` | `number`[] |

#### Returns

`void`

#### Defined in

[PlotComponent.ts:14](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/PlotComponent.ts#L14)