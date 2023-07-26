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
- [fill\_texture](Contour.md#fill_texture)
- [grid\_cell\_size](Contour.md#grid_cell_size)
- [interval](Contour.md#interval)
- [levels](Contour.md#levels)
- [map](Contour.md#map)
- [program](Contour.md#program)
- [texcoords](Contour.md#texcoords)
- [thinner](Contour.md#thinner)
- [vertices](Contour.md#vertices)

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

[Contour.ts:73](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Contour.ts#L73)

## Properties

### color

• `Readonly` **color**: [`number`, `number`, `number`]

#### Defined in

[Contour.ts:48](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Contour.ts#L48)

___

### field

• `Readonly` **field**: [`RawScalarField`](RawScalarField.md)

#### Defined in

[Contour.ts:47](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Contour.ts#L47)

___

### fill\_texture

• `Private` **fill\_texture**: `WGLTexture`

#### Defined in

[Contour.ts:62](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Contour.ts#L62)

___

### grid\_cell\_size

• `Private` **grid\_cell\_size**: `WGLBuffer`

#### Defined in

[Contour.ts:60](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Contour.ts#L60)

___

### interval

• `Readonly` **interval**: `number`

#### Defined in

[Contour.ts:49](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Contour.ts#L49)

___

### levels

• `Readonly` **levels**: `number`[]

#### Defined in

[Contour.ts:50](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Contour.ts#L50)

___

### map

• `Private` **map**: [`MapType`](../modules.md#maptype)

#### Defined in

[Contour.ts:54](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Contour.ts#L54)

___

### program

• `Private` **program**: `WGLProgram`

#### Defined in

[Contour.ts:56](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Contour.ts#L56)

___

### texcoords

• `Private` **texcoords**: `WGLBuffer`

#### Defined in

[Contour.ts:64](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Contour.ts#L64)

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

[Contour.ts:51](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Contour.ts#L51)

___

### vertices

• `Private` **vertices**: `WGLBuffer`

#### Defined in

[Contour.ts:58](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Contour.ts#L58)

## Methods

### onAdd

▸ **onAdd**(`map`, `gl`): `Promise`<`void`\>

Add the contours to a map

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | [`MapType`](../modules.md#maptype) |
| `gl` | `WebGLRenderingContext` |

#### Returns

`Promise`<`void`\>

#### Overrides

[PlotComponent](PlotComponent.md).[onAdd](PlotComponent.md#onadd)

#### Defined in

[Contour.ts:98](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Contour.ts#L98)

___

### render

▸ **render**(`gl`, `matrix`): `void`

Render the contours

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `matrix` | `number`[] |

#### Returns

`void`

#### Overrides

[PlotComponent](PlotComponent.md).[render](PlotComponent.md#render)

#### Defined in

[Contour.ts:125](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Contour.ts#L125)
