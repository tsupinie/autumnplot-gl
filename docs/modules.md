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

- [colormaps](modules.md#colormaps)

### Functions

- [makeColorBar](modules.md#makecolorbar)

## Type Aliases

### ColorbarOrientation

Ƭ **ColorbarOrientation**: ``"horizontal"`` \| ``"vertical"``

#### Defined in

[Colormap.ts:170](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Colormap.ts#L170)

___

### ColorbarTickDirection

Ƭ **ColorbarTickDirection**: ``"top"`` \| ``"bottom"`` \| ``"left"`` \| ``"right"``

#### Defined in

[Colormap.ts:171](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Colormap.ts#L171)

___

### Grid

Ƭ **Grid**: [`PlateCarreeGrid`](classes/PlateCarreeGrid.md)

#### Defined in

[RawField.ts:114](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/RawField.ts#L114)

___

### MapType

Ƭ **MapType**: `mapboxgl.Map` \| `maplibregl.Map`

#### Defined in

[Map.ts:5](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Map.ts#L5)

___

### RawVectorField

Ƭ **RawVectorField**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `u` | [`RawScalarField`](classes/RawScalarField.md) |
| `v` | [`RawScalarField`](classes/RawScalarField.md) |

#### Defined in

[RawField.ts:180](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/RawField.ts#L180)

## Variables

### colormaps

• `Const` **colormaps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bluered` | (`level_min`: `number`, `level_max`: `number`, `n_colors`: `number`) => [`ColorMap`](classes/ColorMap.md) |
| `pw_cape` | [`ColorMap`](classes/ColorMap.md) |
| `pw_speed500mb` | [`ColorMap`](classes/ColorMap.md) |
| `pw_speed850mb` | [`ColorMap`](classes/ColorMap.md) |
| `pw_t2m` | [`ColorMap`](classes/ColorMap.md) |
| `pw_td2m` | [`ColorMap`](classes/ColorMap.md) |
| `redblue` | (`level_min`: `number`, `level_max`: `number`, `n_colors`: `number`) => [`ColorMap`](classes/ColorMap.md) |

#### Defined in

[index.ts:15](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/index.ts#L15)

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

[Colormap.ts:215](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Colormap.ts#L215)
