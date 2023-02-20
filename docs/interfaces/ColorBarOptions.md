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

[Colormap.ts:199](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Colormap.ts#L199)

___

### label

• `Optional` **label**: `string`

The label to place along the color bar

#### Defined in

[Colormap.ts:174](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Colormap.ts#L174)

___

### orientation

• `Optional` **orientation**: [`ColorbarOrientation`](../modules.md#colorbarorientation)

The orientation for the color bar. Valid values are 'horizontal' and 'vertical'.

**`Default`**

'vertical'

#### Defined in

[Colormap.ts:193](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Colormap.ts#L193)

___

### tick\_direction

• `Optional` **tick\_direction**: [`ColorbarTickDirection`](../modules.md#colorbartickdirection)

The direction the ticks should face. Valid values are 'left' and 'right' if orientation is 'vertical' and 'top' and 
'bottom' if orientation is 'horizontal'.

**`Default`**

'left' if orientation is 'vertical' and 'bottom' if orientation is 'horizontal'

#### Defined in

[Colormap.ts:187](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Colormap.ts#L187)

___

### ticks

• `Optional` **ticks**: `number`[]

An array of numbers to use as the tick locations.

**`Default`**

Use all the levels in the color map provided to [makeColorBar](../modules.md#makecolorbar).

#### Defined in

[Colormap.ts:180](https://github.com/tsupinie/autumnplot-gl/blob/8d93e31/src/Colormap.ts#L180)
