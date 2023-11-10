[autumnplot-gl](README.md) / Exports

# autumnplot-gl

## Table of contents

### Classes

- [Barbs](classes/Barbs.md)
- [ColorMap](classes/ColorMap.md)
- [Contour](classes/Contour.md)
- [ContourFill](classes/ContourFill.md)
- [Grid](classes/Grid.md)
- [Hodographs](classes/Hodographs.md)
- [LambertGrid](classes/LambertGrid.md)
- [MultiPlotLayer](classes/MultiPlotLayer.md)
- [Paintball](classes/Paintball.md)
- [PlateCarreeGrid](classes/PlateCarreeGrid.md)
- [PlateCarreeRotatedGrid](classes/PlateCarreeRotatedGrid.md)
- [PlotComponent](classes/PlotComponent.md)
- [PlotLayer](classes/PlotLayer.md)
- [Raster](classes/Raster.md)
- [RawProfileField](classes/RawProfileField.md)
- [RawScalarField](classes/RawScalarField.md)
- [RawVectorField](classes/RawVectorField.md)

### Interfaces

- [BarbsOptions](interfaces/BarbsOptions.md)
- [Color](interfaces/Color.md)
- [ColorBarOptions](interfaces/ColorBarOptions.md)
- [ContourFillOptions](interfaces/ContourFillOptions.md)
- [ContourOptions](interfaces/ContourOptions.md)
- [HodographOptions](interfaces/HodographOptions.md)
- [PaintballKeyOptions](interfaces/PaintballKeyOptions.md)
- [PaintballOptions](interfaces/PaintballOptions.md)
- [RasterOptions](interfaces/RasterOptions.md)
- [RawVectorFieldOptions](interfaces/RawVectorFieldOptions.md)
- [WindProfile](interfaces/WindProfile.md)

### Type Aliases

- [ColorbarOrientation](modules.md#colorbarorientation)
- [ColorbarTickDirection](modules.md#colorbartickdirection)
- [GridType](modules.md#gridtype)
- [MapType](modules.md#maptype)
- [TypedArray](modules.md#typedarray)
- [VectorRelativeTo](modules.md#vectorrelativeto)
- [WebGLAnyRenderingContext](modules.md#webglanyrenderingcontext)

### Variables

- [colormaps](modules.md#colormaps)

### Functions

- [makeColorBar](modules.md#makecolorbar)
- [makePaintballKey](modules.md#makepaintballkey)

## Type Aliases

### ColorbarOrientation

Ƭ **ColorbarOrientation**: ``"horizontal"`` \| ``"vertical"``

#### Defined in

[ColorBar.ts:4](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/ColorBar.ts#L4)

___

### ColorbarTickDirection

Ƭ **ColorbarTickDirection**: ``"top"`` \| ``"bottom"`` \| ``"left"`` \| ``"right"``

#### Defined in

[ColorBar.ts:5](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/ColorBar.ts#L5)

___

### GridType

Ƭ **GridType**: ``"latlon"`` \| ``"latlonrot"`` \| ``"lcc"``

#### Defined in

[RawField.ts:46](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L46)

___

### MapType

Ƭ **MapType**: `mapboxgl.Map` \| `maplibregl.Map`

#### Defined in

[Map.ts:5](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/Map.ts#L5)

___

### TypedArray

Ƭ **TypedArray**: `Float16Array` \| `Float32Array`

#### Defined in

[AutumnTypes.ts:47](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/AutumnTypes.ts#L47)

___

### VectorRelativeTo

Ƭ **VectorRelativeTo**: ``"earth"`` \| ``"grid"``

#### Defined in

[RawField.ts:461](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/RawField.ts#L461)

___

### WebGLAnyRenderingContext

Ƭ **WebGLAnyRenderingContext**: `WebGLRenderingContext` \| `WebGL2RenderingContext`

#### Defined in

[AutumnTypes.ts:41](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/AutumnTypes.ts#L41)

## Variables

### colormaps

• `Const` **colormaps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bluered` | (`level_min`: `number`, `level_max`: `number`, `n_colors`: `number`) => [`ColorMap`](classes/ColorMap.md) |
| `nws_storm_clear_refl` | [`ColorMap`](classes/ColorMap.md) |
| `pw_cape` | [`ColorMap`](classes/ColorMap.md) |
| `pw_speed500mb` | [`ColorMap`](classes/ColorMap.md) |
| `pw_speed850mb` | [`ColorMap`](classes/ColorMap.md) |
| `pw_t2m` | [`ColorMap`](classes/ColorMap.md) |
| `pw_td2m` | [`ColorMap`](classes/ColorMap.md) |
| `redblue` | (`level_min`: `number`, `level_max`: `number`, `n_colors`: `number`) => [`ColorMap`](classes/ColorMap.md) |

#### Defined in

[index.ts:16](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/index.ts#L16)

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

[ColorBar.ts:71](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/ColorBar.ts#L71)

___

### makePaintballKey

▸ **makePaintballKey**(`colors`, `labels`, `opts?`): `SVGElement`

Make an SVG containing a color key for a paintball plot. The key can be split over any number of columns.

**`Example`**

```ts
// Create the color key
const svg = makePaintballKey(colors, labels, {n_cols: 2, fontface: 'Trebuchet MS'});

// Add the color key to the page
document.getElementById('pb-key-container').appendChild(svg);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `colors` | (`string` \| [`Color`](interfaces/Color.md))[] | A list of colors |
| `labels` | `string`[] | The labels corresponding to each color |
| `opts?` | [`PaintballKeyOptions`](interfaces/PaintballKeyOptions.md) | The options for creating the color key |

#### Returns

`SVGElement`

An SVGElement containing the color bar image.

#### Defined in

[ColorBar.ts:235](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/ColorBar.ts#L235)
