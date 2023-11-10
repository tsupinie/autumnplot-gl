[autumnplot-gl](../README.md) / [Exports](../modules.md) / ColorBarOptions

# Interface: ColorBarOptions

## Table of contents

### Properties

- [fontface](ColorBarOptions.md#fontface)
- [label](ColorBarOptions.md#label)
- [orientation](ColorBarOptions.md#orientation)
- [tick\_direction](ColorBarOptions.md#tick_direction)
- [ticklabelsize](ColorBarOptions.md#ticklabelsize)
- [ticks](ColorBarOptions.md#ticks)

## Properties

### fontface

• `Optional` **fontface**: `string`

A font face to use for the label and tick values.

**`Default`**

'sans-serif'

#### Defined in

[ColorBar.ts:33](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/ColorBar.ts#L33)

___

### label

• `Optional` **label**: `string`

The label to place along the color bar

#### Defined in

[ColorBar.ts:8](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/ColorBar.ts#L8)

___

### orientation

• `Optional` **orientation**: [`ColorbarOrientation`](../modules.md#colorbarorientation)

The orientation for the color bar. Valid values are 'horizontal' and 'vertical'.

**`Default`**

'vertical'

#### Defined in

[ColorBar.ts:27](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/ColorBar.ts#L27)

___

### tick\_direction

• `Optional` **tick\_direction**: [`ColorbarTickDirection`](../modules.md#colorbartickdirection)

The direction the ticks should face. Valid values are 'left' and 'right' if orientation is 'vertical' and 'top' and 
'bottom' if orientation is 'horizontal'.

**`Default`**

'left' if orientation is 'vertical' and 'bottom' if orientation is 'horizontal'

#### Defined in

[ColorBar.ts:21](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/ColorBar.ts#L21)

___

### ticklabelsize

• `Optional` **ticklabelsize**: `number`

The font size (in points) to use for the tick labels

**`Default`**

12

#### Defined in

[ColorBar.ts:39](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/ColorBar.ts#L39)

___

### ticks

• `Optional` **ticks**: `number`[]

An array of numbers to use as the tick locations.

**`Default`**

Use all the levels in the color map provided to [makeColorBar](../modules.md#makecolorbar).

#### Defined in

[ColorBar.ts:14](https://github.com/tsupinie/autumnplot-gl/blob/f74c7b8/src/ColorBar.ts#L14)
