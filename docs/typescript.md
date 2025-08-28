---
sidebar_position: 5
---

# Typescript Considerations

autumnplot-gl is written in Typescript to facilitate type info in large projects. Typescript isn't necessary to use autumnplot-gl, but if you want to use it, there are some considerations. 

Many of the plot component classes have generic types. The Typescript compiler can generally figure out the generic type parameters, but if you're declaring a variable to be a plot component, you'll probably need to specify those ahead of time. The first type parameter is the array type (either `Float32Array` or `Float16Array`), the second parameter is the type of the Grid, and the third is the type of the Map you're using.

```typescript
// Import the map from maplibre-gl, if that's what you're using. Mapbox should be similar.
import { Map } from 'maplibre-gl';

// Declare a contour field which contours an array of float float32s on a Plate Carree grid with
//  the MapLibre map.
const cntr: Contour<Float32Array, PlateCarreeGrid, Map>;
```

More information on the generic type arguments for each component can be found on their respective API documentation pages.