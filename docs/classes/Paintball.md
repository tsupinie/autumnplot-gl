[autumnplot-gl](../README.md) / [Exports](../modules.md) / Paintball

# Class: Paintball

## Hierarchy

- [`PlotComponent`](PlotComponent.md)

  ↳ **`Paintball`**

## Table of contents

### Constructors

- [constructor](Paintball.md#constructor)

### Properties

- [colors](Paintball.md#colors)
- [field](Paintball.md#field)
- [fill\_texture](Paintball.md#fill_texture)
- [opacity](Paintball.md#opacity)
- [program](Paintball.md#program)
- [texcoords](Paintball.md#texcoords)
- [vertices](Paintball.md#vertices)

### Methods

- [onAdd](Paintball.md#onadd)
- [render](Paintball.md#render)

## Constructors

### constructor

• **new Paintball**(`field`, `opts?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | [`RawScalarField`](RawScalarField.md) |
| `opts?` | [`PaintballOptions`](../interfaces/PaintballOptions.md) |

#### Overrides

[PlotComponent](PlotComponent.md).[constructor](PlotComponent.md#constructor)

#### Defined in

[Paintball.ts:32](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Paintball.ts#L32)

## Properties

### colors

• `Readonly` **colors**: `number`[]

#### Defined in

[Paintball.ts:19](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Paintball.ts#L19)

___

### field

• `Readonly` **field**: [`RawScalarField`](RawScalarField.md)

#### Defined in

[Paintball.ts:18](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Paintball.ts#L18)

___

### fill\_texture

• `Private` **fill\_texture**: `WGLTexture`

#### Defined in

[Paintball.ts:28](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Paintball.ts#L28)

___

### opacity

• `Readonly` **opacity**: `number`

#### Defined in

[Paintball.ts:20](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Paintball.ts#L20)

___

### program

• `Private` **program**: `WGLProgram`

#### Defined in

[Paintball.ts:23](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Paintball.ts#L23)

___

### texcoords

• `Private` **texcoords**: `WGLBuffer`

#### Defined in

[Paintball.ts:30](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Paintball.ts#L30)

___

### vertices

• `Private` **vertices**: `WGLBuffer`

#### Defined in

[Paintball.ts:25](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Paintball.ts#L25)

## Methods

### onAdd

▸ **onAdd**(`map`, `gl`): `Promise`<`void`\>

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

[Paintball.ts:48](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Paintball.ts#L48)

___

### render

▸ **render**(`gl`, `matrix`): `void`

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

[Paintball.ts:63](https://github.com/tsupinie/autumnplot-gl/blob/eec924e/src/Paintball.ts#L63)
