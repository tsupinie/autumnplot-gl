---
title: FieldContourOpts
---

# Interface: FieldContourOpts

Defined in: [ContourCreator.worker.ts:16](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/ContourCreator.worker.ts#L16)

Options for contouring data via [RawScalarField.getContours()](../classes/RawScalarField.md#getcontours)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="interval"></a> `interval?` | `number` | The interval at which to create contours. The field will be contoured at this interval from its minimum to its maximum. | [ContourCreator.worker.ts:20](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/ContourCreator.worker.ts#L20) |
| <a id="levels"></a> `levels?` | `number`[] | Contour the field at these specific levels. | [ContourCreator.worker.ts:25](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/ContourCreator.worker.ts#L25) |
| <a id="quad_as_tri"></a> `quad_as_tri?` | `boolean` | Add triangles in the contouring, which takes longer and generates more detailed (not necessarily smoother or better) contours | [ContourCreator.worker.ts:30](https://github.com/tsupinie/autumnplot-gl/blob/9b0e49471dc640025d41a95ab47d6bd092421f17/src/ContourCreator.worker.ts#L30) |
