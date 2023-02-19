[autumnplot-gl](../README.md) / [Exports](../modules.md) / ContourFill

# Class: ContourFill

A filled contoured field

**`Example`**

```ts
// Create a field of filled contours with the provided color map
const fill = new ContourFill(wind_speed_field, {cmap: color_map});
```

## Hierarchy

- [`PlotComponent`](PlotComponent.md)

  ↳ **`ContourFill`**

## Table of contents

### Constructors

- [constructor](ContourFill.md#constructor)

### Properties

- [cmap](ContourFill.md#cmap)
- [cmap\_image](ContourFill.md#cmap_image)
- [cmap\_nonlin\_texture](ContourFill.md#cmap_nonlin_texture)
- [cmap\_texture](ContourFill.md#cmap_texture)
- [field](ContourFill.md#field)
- [fill\_texture](ContourFill.md#fill_texture)
- [index\_map](ContourFill.md#index_map)
- [opacity](ContourFill.md#opacity)
- [program](ContourFill.md#program)
- [texcoords](ContourFill.md#texcoords)
- [vertices](ContourFill.md#vertices)

### Methods

- [onAdd](ContourFill.md#onadd)
- [render](ContourFill.md#render)

## Constructors

### constructor

• **new ContourFill**(`field`, `opts`)

Create a filled contoured field

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | [`RawScalarField`](RawScalarField.md) | The field to create filled contours from |
| `opts` | [`ContourFillOptions`](../interfaces/ContourFillOptions.md) | Options for creating the filled contours |

#### Overrides

[PlotComponent](PlotComponent.md).[constructor](PlotComponent.md#constructor)

#### Defined in

[ContourFill.ts:57](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/ContourFill.ts#L57)

## Properties

### cmap

• `Readonly` **cmap**: [`ColorMap`](ColorMap.md)

#### Defined in

[ContourFill.ts:30](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/ContourFill.ts#L30)

___

### cmap\_image

• `Readonly` `Private` **cmap\_image**: `HTMLCanvasElement`

#### Defined in

[ContourFill.ts:34](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/ContourFill.ts#L34)

___

### cmap\_nonlin\_texture

• `Private` **cmap\_nonlin\_texture**: `WGLTexture`

#### Defined in

[ContourFill.ts:50](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/ContourFill.ts#L50)

___

### cmap\_texture

• `Private` **cmap\_texture**: `WGLTexture`

#### Defined in

[ContourFill.ts:48](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/ContourFill.ts#L48)

___

### field

• `Readonly` **field**: [`RawScalarField`](RawScalarField.md)

#### Defined in

[ContourFill.ts:29](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/ContourFill.ts#L29)

___

### fill\_texture

• `Private` **fill\_texture**: `WGLTexture`

#### Defined in

[ContourFill.ts:44](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/ContourFill.ts#L44)

___

### index\_map

• `Readonly` `Private` **index\_map**: `Float32Array`

#### Defined in

[ContourFill.ts:36](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/ContourFill.ts#L36)

___

### opacity

• `Readonly` **opacity**: `number`

#### Defined in

[ContourFill.ts:31](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/ContourFill.ts#L31)

___

### program

• `Private` **program**: `WGLProgram`

#### Defined in

[ContourFill.ts:39](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/ContourFill.ts#L39)

___

### texcoords

• `Private` **texcoords**: `WGLBuffer`

#### Defined in

[ContourFill.ts:46](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/ContourFill.ts#L46)

___

### vertices

• `Private` **vertices**: `WGLBuffer`

#### Defined in

[ContourFill.ts:41](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/ContourFill.ts#L41)

## Methods

### onAdd

▸ **onAdd**(`map`, `gl`): `Promise`<`void`\>

Add the filled contours to a map

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

[ContourFill.ts:101](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/ContourFill.ts#L101)

___

### render

▸ **render**(`gl`, `matrix`): `void`

Render the filled contours

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

[ContourFill.ts:139](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/ContourFill.ts#L139)
