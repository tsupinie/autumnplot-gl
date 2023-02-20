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
- [grid\_spacing](Contour.md#grid_spacing)
- [interval](Contour.md#interval)
- [latitudes](Contour.md#latitudes)
- [map](Contour.md#map)
- [program](Contour.md#program)
- [tex\_height](Contour.md#tex_height)
- [tex\_width](Contour.md#tex_width)
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

[Contour.ts:71](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L71)

## Properties

### color

• `Readonly` **color**: [`number`, `number`, `number`]

#### Defined in

[Contour.ts:42](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L42)

___

### field

• `Readonly` **field**: [`RawScalarField`](RawScalarField.md)

#### Defined in

[Contour.ts:41](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L41)

___

### fill\_texture

• `Private` **fill\_texture**: `WGLTexture`

#### Defined in

[Contour.ts:55](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L55)

___

### grid\_spacing

• `Private` **grid\_spacing**: `number`

#### Defined in

[Contour.ts:59](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L59)

___

### interval

• `Readonly` **interval**: `number`

#### Defined in

[Contour.ts:43](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L43)

___

### latitudes

• `Private` **latitudes**: `WGLBuffer`

#### Defined in

[Contour.ts:53](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L53)

___

### map

• `Private` **map**: [`MapType`](../modules.md#maptype)

#### Defined in

[Contour.ts:47](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L47)

___

### program

• `Private` **program**: `WGLProgram`

#### Defined in

[Contour.ts:49](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L49)

___

### tex\_height

• `Private` **tex\_height**: `number`

#### Defined in

[Contour.ts:64](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L64)

___

### tex\_width

• `Private` **tex\_width**: `number`

#### Defined in

[Contour.ts:62](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L62)

___

### texcoords

• `Private` **texcoords**: `WGLBuffer`

#### Defined in

[Contour.ts:57](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L57)

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

[Contour.ts:44](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L44)

___

### vertices

• `Private` **vertices**: `WGLBuffer`

#### Defined in

[Contour.ts:51](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L51)

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

[Contour.ts:99](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L99)

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

[Contour.ts:135](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Contour.ts#L135)
