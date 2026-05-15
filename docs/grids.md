---
sidebar_position: 4
---

# Grids
autumnplot-gl provides several grids to define the georeferencing for the fields. These are independent of the plot component (e.g., `Fill`, `Contour`, etc.) so you can mix and match them however you like (almost; see [Compatibility](#compatibility)).

- A [`PlateCarreeGrid`](api/classes/PlateCarreeGrid) (a.k.a., lat/lon grid) is a grid regular in latitude-longitude space. This is the output grid for a lot of global models, including the NCEP GFS. For the `PlateCarreeGrid`, the data are assumed to be in row-major order with the first grid point being the southwest corner of the domain.
- A [`PlateCarreeRotatedGrid`](api/classes/PlateCarreeRotatedGrid) (a.k.a. rotated lat/lon grid) is like a regular `PlateCarreeGrid`, but it's been rotated around the sphere somehow. This is used in limited-area domains that would like the ease of representing things in lat/lon space, but don't want the distortion that you get away from the equator. As with the `PlateCarreeGrid`, the data are assumed to be in row-major order with the first grid point being the southwest corner of the domain.
- A [`LambertGrid`](api/classes/LambertGrid) is a grid that uses a Lambert Conformal Conic projection. It's a common grid for limited-area models such as the HRRR. As with the previous two grids, the data are assumed to be in row-major order with the first grid point being the southwest corner of the domain.
- An [`UnstructuredGrid`](api/classes/UnstructuredGrid) is really a fancy name for a collection of points, such as surface observations.
- A [`GeostationaryImage`](api/classes/GeostationaryImage) is for plotting images from geostationary satellites, e.g., the GOES satellites. As with the model grids, the data are assumed to be in row-major order with the first grid point being the southwest corner of the domain.
- A [`RadarSweepGrid`](api/classes/RadarSweepGrid) is for plotting single-site radar data. It is observing-system agnostic and can be either a full 360-degree scan or a sector scan. The data for a radar sweep are assumed to be in radial-major order (e.g., the data looks like a list of radials, which is how they come in the NWS Level 2 data files).

## Compatibility

Not every grid can be used with every plot component. The table below shows the compatibility for each grid and plot component.

|                          | `Fill`             | `Raster`           | `Contour`          | `Paintball`        | `Barbs`            | `Hodographs`       | `StationPlot`      |
|--------------------------|--------------------|--------------------|--------------------|--------------------|--------------------|--------------------|--------------------|
| `PlateCarreeGrid`        | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| `PlateCarreeRotatedGrid` | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| `LambertGrid`            | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| `UnstructuredGrid`       | :x:                | :x:                | :x:                | :x:                | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| `GeostationaryImage`     | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                | :x:                | :x:                |
| `RadarSweepGrid`         | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x:                | :x:                | :x:                |

Where an incompatiblity exists, it's because I haven't had a need to figure out the methods to make it work yet. In some cases (such as using a `ContourFill` on an `UnstructuredGrid`), it's a plausible need, I just haven't come across it yet. Other (such as plotting `StationPlots` on a `RadarSweepGrid`), seem a little less useful.