[autumnplot-gl](README.md) / Exports

# autumnplot-gl

## Table of contents

### Classes

- [Barbs](classes/Barbs.md)
- [ColorMap](classes/ColorMap.md)
- [Contour](classes/Contour.md)
- [ContourFill](classes/ContourFill.md)
- [Hodographs](classes/Hodographs.md)
- [MultiPlotLayer](classes/MultiPlotLayer.md)
- [PlateCarreeGrid](classes/PlateCarreeGrid.md)
- [PlotComponent](classes/PlotComponent.md)
- [PlotLayer](classes/PlotLayer.md)
- [RawScalarField](classes/RawScalarField.md)

### Interfaces

- [BarbsOptions](interfaces/BarbsOptions.md)
- [Color](interfaces/Color.md)
- [ColorBarOptions](interfaces/ColorBarOptions.md)
- [ContourFillOptions](interfaces/ContourFillOptions.md)
- [ContourOptions](interfaces/ContourOptions.md)
- [WindProfile](interfaces/WindProfile.md)

### Type Aliases

- [ColorbarOrientation](modules.md#colorbarorientation)
- [ColorbarTickDirection](modules.md#colorbartickdirection)
- [Grid](modules.md#grid)
- [MapType](modules.md#maptype)
- [RawVectorField](modules.md#rawvectorfield)

### Variables

- [pw\_speed500mb](modules.md#pw_speed500mb)

### Functions

- [makeColorBar](modules.md#makecolorbar)

## Type Aliases

### ColorbarOrientation

Ƭ **ColorbarOrientation**: ``"horizontal"`` \| ``"vertical"``

#### Defined in

ColorMap.ts:147

___

### ColorbarTickDirection

Ƭ **ColorbarTickDirection**: ``"top"`` \| ``"bottom"`` \| ``"left"`` \| ``"right"``

#### Defined in

ColorMap.ts:148

___

### Grid

Ƭ **Grid**: [`PlateCarreeGrid`](classes/PlateCarreeGrid.md)

#### Defined in

[RawField.ts:114](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/RawField.ts#L114)

___

### MapType

Ƭ **MapType**: `mapboxgl.Map` \| `maplibregl.Map`

#### Defined in

[Map.ts:5](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/Map.ts#L5)

___

### RawVectorField

Ƭ **RawVectorField**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `u` | [`RawScalarField`](classes/RawScalarField.md) |
| `v` | [`RawScalarField`](classes/RawScalarField.md) |

#### Defined in

[RawField.ts:180](https://github.com/tsupinie/autumnplot-gl/blob/3306c37/src/RawField.ts#L180)

## Variables

### pw\_speed500mb

• `Const` **pw\_speed500mb**: [`ColorMap`](classes/ColorMap.md)

#### Defined in

ColorMap.ts:121

## Functions

### makeColorBar

▸ **makeColorBar**(`colormap`, `opts`): `SVGElement`

Make an SVG containing a color bar. The color bar can either be oriented horizontal or vertical, and a label can be provided.

**`Example`**

```ts
// Create the color bar
const svg = makeColorBar(color_map, {label: 'Wind Speed (kts)', orientation: 'horizontal', 
                                     fontface: 'Trebuchet MS'});

// Add colorbar to the page
document.getElementById('colorbar-container').appendChild(svg);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `colormap` | [`ColorMap`](classes/ColorMap.md) | The color map to use |
| `opts` | [`ColorBarOptions`](interfaces/ColorBarOptions.md) | The options for creating the color bar |

#### Returns

`SVGElement`

An SVGElement containing the color bar image.

#### Defined in

ColorMap.ts:192