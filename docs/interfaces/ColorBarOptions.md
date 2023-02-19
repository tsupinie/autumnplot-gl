[autumnplot-gl](../README.md) / [Exports](../modules.md) / ColorBarOptions

# Interface: ColorBarOptions

## Table of contents

### Properties

- [fontface](ColorBarOptions.md#fontface)
- [label](ColorBarOptions.md#label)
- [orientation](ColorBarOptions.md#orientation)
- [tick\_direction](ColorBarOptions.md#tick_direction)
- [ticks](ColorBarOptions.md#ticks)

## Properties

### fontface

• `Optional` **fontface**: `string`

A font face to use for the label and tick values.

**`Default`**

'sans-serif'

#### Defined in

[Colormap.ts:176](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Colormap.ts#L176)

___

### label

• `Optional` **label**: `string`

The label to place along the color bar

#### Defined in

[Colormap.ts:151](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Colormap.ts#L151)

___

### orientation

• `Optional` **orientation**: [`ColorbarOrientation`](../modules.md#colorbarorientation)

The orientation for the color bar. Valid values are 'horizontal' and 'vertical'.

**`Default`**

'vertical'

#### Defined in

[Colormap.ts:170](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Colormap.ts#L170)

___

### tick\_direction

• `Optional` **tick\_direction**: [`ColorbarTickDirection`](../modules.md#colorbartickdirection)

The direction the ticks should face. Valid values are 'left' and 'right' if orientation is 'vertical' and 'top' and 
'bottom' if orientation is 'horizontal'.

**`Default`**

'left' if orientation is 'vertical' and 'bottom' if orientation is 'horizontal'

#### Defined in

[Colormap.ts:164](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Colormap.ts#L164)

___

### ticks

• `Optional` **ticks**: `number`[]

An array of numbers to use as the tick locations.

**`Default`**

Use all the levels in the color map provided to [makeColorBar](../modules.md#makecolorbar).

#### Defined in

[Colormap.ts:157](https://github.com/tsupinie/autumnplot-gl/blob/749eabd/src/Colormap.ts#L157)
