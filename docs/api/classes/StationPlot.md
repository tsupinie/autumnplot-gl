---
title: StationPlot
---

# Class: StationPlot\<GridType, MapType, ObsFieldName\>

Defined in: [StationPlot.ts:295](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/StationPlot.ts#L295)

Station model plots for observed data

## Example

```ts
// Specify how to set up the station plot
const station_plot_locs = {
    tmpf: {type: 'number', pos: 'ul', color: '#cc0000', formatter: val => val === null ? '' : val.toFixed(0)},
    dwpf: {type: 'number', pos: 'll', color: '#00aa00', formatter: val => val === null ? '' : val.toFixed(0)}, 
    wind: {type: 'barb', pos: 'c'},
    preswx: {type: 'symbol', pos: 'cl', color: '#ff00ff'},
    skyc: {type: 'symbol', pos: 'c'},
};

// Create the station plot
const station_plot = new StationPlot(obs_field, {config: station_plot_locs, thin_fac: 8, font_size: 14});
```

## Extends

- [`PlotComponent`](PlotComponent.md)\<`MapType`\>

## Type Parameters

| Type Parameter |
| ------ |
| `GridType` *extends* [`Grid`](Grid.md) |
| `MapType` *extends* [`MapLikeType`](../type-aliases/MapLikeType.md) |
| `ObsFieldName` *extends* `string` |

## Constructors

### Constructor

> **new StationPlot**\<`GridType`, `MapType`, `ObsFieldName`\>(`field`, `opts`): `StationPlot`\<`GridType`, `MapType`, `ObsFieldName`\>

Defined in: [StationPlot.ts:306](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/StationPlot.ts#L306)

Create station plots

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`RawObsField`](RawObsField.md)\<`GridType`, `ObsFieldName`\> | A field containing the observed data |
| `opts` | [`StationPlotOptions`](../interfaces/StationPlotOptions.md)\<`ObsFieldName`\> | Various options for the station plots |

#### Returns

`StationPlot`\<`GridType`, `MapType`, `ObsFieldName`\>

#### Overrides

[`PlotComponent`](PlotComponent.md).[`constructor`](PlotComponent.md#constructor)

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="opts"></a> `opts` | `readonly` | `Required`\<[`StationPlotOptions`](../interfaces/StationPlotOptions.md)\<`ObsFieldName`\>\> | [StationPlot.ts:297](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/StationPlot.ts#L297) |

## Methods

### updateField()

> **updateField**(`field`): `Promise`\<`void`\>

Defined in: [StationPlot.ts:319](https://github.com/tsupinie/autumnplot-gl/blob/415c194b5b688b75b61f2937cae581fa6787a516/src/StationPlot.ts#L319)

Update the data displayed as station plots

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`RawObsField`](RawObsField.md)\<`GridType`, `ObsFieldName`\> | The new field to display as station plots |

#### Returns

`Promise`\<`void`\>
