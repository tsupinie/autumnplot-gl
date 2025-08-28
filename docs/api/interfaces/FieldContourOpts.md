---
title: FieldContourOpts
---

# Interface: FieldContourOpts

Defined in: [ContourCreator.ts:23](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/ContourCreator.ts#L23)

Options for contouring data via [RawScalarField.getContours()](../classes/RawScalarField.md#getcontours)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="interval"></a> `interval?` | `number` | The interval at which to create contours. The field will be contoured at this interval from its minimum to its maximum. | [ContourCreator.ts:27](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/ContourCreator.ts#L27) |
| <a id="levels"></a> `levels?` | `number`[] | Contour the field at these specific levels. | [ContourCreator.ts:32](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/ContourCreator.ts#L32) |
| <a id="quad_as_tri"></a> `quad_as_tri?` | `boolean` | Add triangles in the contouring, which takes longer and generates more detailed (not necessarily smoother or better) contours | [ContourCreator.ts:37](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/ContourCreator.ts#L37) |
