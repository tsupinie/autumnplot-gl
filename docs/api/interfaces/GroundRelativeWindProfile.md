---
title: GroundRelativeWindProfile
---

# Interface: GroundRelativeWindProfile

Defined in: [AutumnTypes.ts:29](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/AutumnTypes.ts#L29)

A wind profile without a storm motion for plotting ground-relative hodographs

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="ilon"></a> `ilon` | `number` | The grid index in the i direction | [AutumnTypes.ts:34](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/AutumnTypes.ts#L34) |
| <a id="jlat"></a> `jlat` | `number` | The grid index in the j direction (ignored for unstructured grids) | [AutumnTypes.ts:31](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/AutumnTypes.ts#L31) |
| <a id="u"></a> `u` | `Float32Array` | Ground-relative u winds in kts | [AutumnTypes.ts:37](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/AutumnTypes.ts#L37) |
| <a id="v"></a> `v` | `Float32Array` | Ground-relative v winds in kts | [AutumnTypes.ts:40](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/AutumnTypes.ts#L40) |
| <a id="z"></a> `z` | `Float32Array` | Height of each data point in km | [AutumnTypes.ts:43](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/AutumnTypes.ts#L43) |
