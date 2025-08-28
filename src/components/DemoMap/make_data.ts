import { Grid, PlateCarreeGrid, PlotLayer, RawScalarField, RawVectorField } from "autumnplot-gl";
import Rand from "rand-seed";
import { guassian_blur } from "./gaussian_blur";
import { MapInstance } from "@vis.gl/react-maplibre";
import React from "react";

const nx = 121, ny = 61;
export const grid = new PlateCarreeGrid(nx, ny, -130, 20, -65, 55);
const arrayType = Float32Array;

export type GridType = typeof grid;
export type ArrayType = InstanceType<typeof arrayType>;

const height_base = 570;
const height_pert = 10;
const height_grad = 0.5;
const vel_pert = 60;
const speed = 0.001;


export function makeHeight<GridType extends Grid>(grid: GridType, time: number) {
    let hght = [];
    for (let i = 0; i < grid.ni; i++) {
        for (let j = 0; j < grid.nj; j++) {
            const idx = i + j * grid.ni;
            hght[idx] = height_base
                        + height_pert * (Math.cos(-time * speed + 4 * Math.PI * i / (grid.ni - 1)) * Math.cos(2 * Math.PI * j / (grid.nj - 1)))
                        - 61 * height_grad * j / grid.nj;
        }
    }

    return new RawScalarField(grid, new arrayType(hght));
}

export function makeWinds<GridType extends Grid>(grid: GridType, time: number) {
    const coords = grid.getGridCoords();

    let u = [], v = [];
    for (let i = 0; i < grid.ni; i++) {
        for (let j = 0; j < grid.nj; j++) {
            const idx = i + j * grid.ni;

            let v_fac = 1;
            if (grid.type == 'latlon' || grid.type == 'latlonrot') {
                v_fac = Math.cos(coords.y[j] * Math.PI / 180);
            }

            let u_earth = vel_pert * (Math.cos(-time * speed + 4 * Math.PI * i / (grid.ni - 1)) * Math.sin(2 * Math.PI * j / (grid.nj - 1)) + height_grad);
            let v_earth = -vel_pert * Math.sin(-time * speed + 4 * Math.PI * i / (grid.ni - 1)) * Math.cos(2 * Math.PI * j / (grid.nj - 1));

            const mag = Math.hypot(u_earth, v_earth);
            v_earth /= v_fac;

            u[idx] = u_earth * mag / Math.hypot(u_earth, v_earth);
            v[idx] = v_earth * mag / Math.hypot(u_earth, v_earth);
        }
    }

    return new RawVectorField(grid, new arrayType(u), new arrayType(v), {relative_to: 'grid'});
}

export function makeWindSpeed<GridType extends Grid>(grid: GridType, time: number) {
    const winds = makeWinds(grid, time);
    const wspd = [];

    for (let idx = 0; idx < winds.u.data.length; idx++) {
        wspd[idx] = Math.hypot(winds.u.data[idx], winds.v.data[idx]);
    }

    return new RawScalarField(grid, new arrayType(wspd));
}

export function makePaintballData<GridType extends Grid>(grid: GridType, n_members: number) {
    const rand = new Rand('autumnplot-gl');

    const data = new Float32Array(grid.ni * grid.nj);

    for (let imem = 0; imem < n_members; imem++) {
        const bit = Math.pow(2, imem);
        const ary = new Float32Array(grid.ni * grid.nj);

        for (let idx = 0; idx < grid.ni * grid.nj; idx++) {
            ary[idx] = rand.next();
        }

        const ary_blur = guassian_blur(grid, ary, 3);
        
        for (let idx = 0; idx < grid.ni * grid.nj; idx++) {
            data[idx] += bit * (ary_blur[idx] > 0.52 ? 1 : 0);
        }
    }

    return new RawScalarField(grid, data);
}

export function addLayer<MapType extends MapInstance>(map: MapType, layer: PlotLayer<MapType>, refreshCondition: () => boolean) {
    const [, setStyleLoaded] = React.useState(0);

    React.useEffect(() => {
        const forceUpdate = () => setStyleLoaded(version => version + 1);
        map.on('styledata', forceUpdate);
        forceUpdate();

        return () => {
            map.off('styledata', forceUpdate);
            if (map.style && map.getLayer(layer.id)) {
                map.removeLayer(layer.id);
            }
        };
    }, [map]);

    const layer_after = 'countries-boundary';

    // @ts-ignore
    if (map.style && map.style._loaded && !map.getLayer(layer.id)) {
        map.addLayer(layer, layer_after);
    }

    if (refreshCondition()) {
        if (map.style && map.getLayer(layer.id)) {
            map.removeLayer(layer.id);
        }
    
        // @ts-ignore
        if (map.style && map.style._loaded) {
            map.addLayer(layer, layer_after);
        }
    }
}