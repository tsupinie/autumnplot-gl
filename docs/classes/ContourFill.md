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
- [field](ContourFill.md#field)
- [gl\_elems](ContourFill.md#gl_elems)
- [index\_map](ContourFill.md#index_map)
- [opacity](ContourFill.md#opacity)

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

[ContourFill.ts:57](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/ContourFill.ts#L57)

## Properties

### cmap

• `Readonly` **cmap**: [`ColorMap`](ColorMap.md)

#### Defined in

[ContourFill.ts:41](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/ContourFill.ts#L41)

___

### cmap\_image

• `Readonly` `Private` **cmap\_image**: `HTMLCanvasElement`

#### Defined in

[ContourFill.ts:45](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/ContourFill.ts#L45)

___

### field

• `Readonly` **field**: [`RawScalarField`](RawScalarField.md)

#### Defined in

[ContourFill.ts:40](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/ContourFill.ts#L40)

___

### gl\_elems

• `Private` **gl\_elems**: `ContourFillGLElems`

#### Defined in

[ContourFill.ts:50](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/ContourFill.ts#L50)

___

### index\_map

• `Readonly` `Private` **index\_map**: `Float32Array`

#### Defined in

[ContourFill.ts:47](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/ContourFill.ts#L47)

___

### opacity

• `Readonly` **opacity**: `number`

#### Defined in

[ContourFill.ts:42](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/ContourFill.ts#L42)

## Methods

### onAdd

▸ **onAdd**(`map`, `gl`): `Promise`<`void`\>

Add the filled contours to a map

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

[ContourFill.ts:96](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/ContourFill.ts#L96)

___

### render

▸ **render**(`gl`, `matrix`): `void`

Render the filled contours

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

[ContourFill.ts:136](https://github.com/tsupinie/autumnplot-gl/blob/43ca048/src/ContourFill.ts#L136)
