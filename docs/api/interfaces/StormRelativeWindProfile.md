---
title: StormRelativeWindProfile
---

# Interface: StormRelativeWindProfile

Defined in: [AutumnTypes.ts:5](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/AutumnTypes.ts#L5)

A wind profile with a storm-motion for plotting storm-relative hodographs

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="ilon"></a> `ilon` | `number` | The grid index in the i direction | [AutumnTypes.ts:10](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/AutumnTypes.ts#L10) |
| <a id="jlat"></a> `jlat` | `number` | The grid index in the j direction (ignored for unstructured grids) | [AutumnTypes.ts:7](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/AutumnTypes.ts#L7) |
| <a id="smu"></a> `smu` | `number` | u component of storm motion in kts | [AutumnTypes.ts:13](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/AutumnTypes.ts#L13) |
| <a id="smv"></a> `smv` | `number` | v component of storm motion in kts | [AutumnTypes.ts:16](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/AutumnTypes.ts#L16) |
| <a id="u"></a> `u` | `Float32Array` | Ground-relative u winds in kts (will be converted to storm-relative during plotting) | [AutumnTypes.ts:19](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/AutumnTypes.ts#L19) |
| <a id="v"></a> `v` | `Float32Array` | Ground-relative v winds in kts (will be converted to storm-relative during plotting) | [AutumnTypes.ts:22](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/AutumnTypes.ts#L22) |
| <a id="z"></a> `z` | `Float32Array` | Height of each data point in km | [AutumnTypes.ts:25](https://github.com/tsupinie/autumnplot-gl/blob/b59c6a647bbca9e48b763c34d4ef9e92b3f89bd7/src/AutumnTypes.ts#L25) |
