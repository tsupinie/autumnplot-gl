[autumnplot-gl](../README.md) / [Exports](../modules.md) / PlotComponent

# Class: PlotComponent

## Hierarchy

- **`PlotComponent`**

  ↳ [`Barbs`](Barbs.md)

  ↳ [`Contour`](Contour.md)

  ↳ [`ContourFill`](ContourFill.md)

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
| `gl` | `WebGLRenderingContext` |

#### Returns

`Promise`<`void`\>

#### Defined in

[PlotComponent.ts:11](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/PlotComponent.ts#L11)

___

### render

▸ `Abstract` **render**(`gl`, `matrix`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `matrix` | `number`[] |

#### Returns

`void`

#### Defined in

[PlotComponent.ts:12](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/PlotComponent.ts#L12)
