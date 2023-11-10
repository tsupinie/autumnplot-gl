[autumnplot-gl](../README.md) / [Exports](../modules.md) / Contour

# Class: Contour<ArrayType\>

A field of contoured data. The contours can optionally be thinned based on map zoom level.

**`Example`**

```ts
// Create a contoured height field, with black contours every 30 m (assuming the height field is in 
// meters) and only using every other contour when the map zoom level is less than 5.
const contours = new Contour(height_field, {color: '#000000', interval: 30, 
                                                 thinner: zoom => zoom < 5 ? 2 : 1});
```

## Type parameters

| Name | Type |
| :------ | :------ |
| `ArrayType` | extends [`TypedArray`](../modules.md#typedarray) |

## Hierarchy

- [`PlotComponent`](PlotComponent.md)

  ↳ **`Contour`**

## Table of contents

### Constructors

- [constructor](Contour.md#constructor)

### Properties

- [color](Contour.md#color)
- [interval](Contour.md#interval)
- [levels](Contour.md#levels)
- [thinner](Contour.md#thinner)

## Constructors

### constructor

• **new Contour**<`ArrayType`\>(`field`, `opts`)

Create a contoured field

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ArrayType` | extends [`TypedArray`](../modules.md#typedarray) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | [`RawScalarField`](RawScalarField.md)<`ArrayType`\> | The field to contour |
| `opts` | [`ContourOptions`](../interfaces/ContourOptions.md) | Options for creating the contours |

#### Overrides

[PlotComponent](PlotComponent.md).[constructor](PlotComponent.md#constructor)

#### Defined in

[Contour.ts:71](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Contour.ts#L71)

## Properties

### color

• `Readonly` **color**: [`number`, `number`, `number`]

#### Defined in

[Contour.ts:59](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Contour.ts#L59)

___

### interval

• `Readonly` **interval**: `number`

#### Defined in

[Contour.ts:60](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Contour.ts#L60)

___

### levels

• `Readonly` **levels**: `number`[]

#### Defined in

[Contour.ts:61](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Contour.ts#L61)

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

[Contour.ts:62](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Contour.ts#L62)
