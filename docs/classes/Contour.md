[autumnplot-gl](../README.md) / [Exports](../modules.md) / Contour

# Class: Contour

A field of contoured data. The contours can optionally be thinned based on map zoom level.

**`Example`**

```ts
// Create a contoured height field, with black contours every 30 m (assuming the height field is in 
// meters) and only using every other contour when the map zoom level is less than 5.
const contours = new Contour(height_field, {color: '#000000', interval: 30, 
                                                 thinner: zoom => zoom < 5 ? 2 : 1});
```

## Hierarchy

- [`PlotComponent`](PlotComponent.md)

  ↳ **`Contour`**

## Table of contents

### Constructors

- [constructor](Contour.md#constructor)

### Properties

- [color](Contour.md#color)
- [field](Contour.md#field)
- [gl\_elems](Contour.md#gl_elems)
- [interval](Contour.md#interval)
- [levels](Contour.md#levels)
- [thinner](Contour.md#thinner)

### Methods

- [onAdd](Contour.md#onadd)
- [render](Contour.md#render)

## Constructors

### constructor

• **new Contour**(`field`, `opts`)

Create a contoured field

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | [`RawScalarField`](RawScalarField.md) | The field to contour |
| `opts` | [`ContourOptions`](../interfaces/ContourOptions.md) | Options for creating the contours |

#### Overrides

[PlotComponent](PlotComponent.md).[constructor](PlotComponent.md#constructor)

#### Defined in

[Contour.ts:71](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Contour.ts#L71)

## Properties

### color

• `Readonly` **color**: [`number`, `number`, `number`]

#### Defined in

[Contour.ts:58](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Contour.ts#L58)

___

### field

• `Readonly` **field**: [`RawScalarField`](RawScalarField.md)

#### Defined in

[Contour.ts:57](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Contour.ts#L57)

___

### gl\_elems

• `Private` **gl\_elems**: `ContourGLElems`

#### Defined in

[Contour.ts:64](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Contour.ts#L64)

___

### interval

• `Readonly` **interval**: `number`

#### Defined in

[Contour.ts:59](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Contour.ts#L59)

___

### levels

• `Readonly` **levels**: `number`[]

#### Defined in

[Contour.ts:60](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Contour.ts#L60)

___

### thinner

• `Readonly` **thinner**: (`zoom`: `number`) => `number`

#### Type declaration

▸ (`zoom`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `zoom` | `number` |

##### Returns

`number`

#### Defined in

[Contour.ts:61](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Contour.ts#L61)

## Methods

### onAdd

▸ **onAdd**(`map`, `gl`): `Promise`<`void`\>

Add the contours to a map

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | [`MapType`](../modules.md#maptype) |
| `gl` | `WebGLAnyRenderingContext` |

#### Returns

`Promise`<`void`\>

#### Overrides

[PlotComponent](PlotComponent.md).[onAdd](PlotComponent.md#onadd)

#### Defined in

[Contour.ts:91](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Contour.ts#L91)

___

### render

▸ **render**(`gl`, `matrix`): `void`

Render the contours

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLAnyRenderingContext` |
| `matrix` | `number`[] |

#### Returns

`void`

#### Overrides

[PlotComponent](PlotComponent.md).[render](PlotComponent.md#render)

#### Defined in

[Contour.ts:121](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/Contour.ts#L121)
