import {useColorMode} from '@docusaurus/theme-common';
import useIsBrowser from '@docusaurus/useIsBrowser';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

import {Map, StyleSpecification, useMap} from "@vis.gl/react-maplibre";
import * as React from 'react';
import { ContourLabelOptions, ContourOptions, ObsRawData, SPDataConfig} from "autumnplot-gl";

import 'maplibre-gl/dist/maplibre-gl.css';
import styles from './styles.module.css';
import map_style_light from './style_light.json';
import map_style_dark from './style_dark.json';
import obs from './surface_20240823_1500.thin.json';
import vwps from './vwps.json';


type DemoContourLayerProps = {
    label_contours?: boolean,
}

const document_script = (ExecutionEnvironment.canUseDOM ? window.location.protocol + "/autumnplot-gl/" : "");

export function DemoContourLayer(props: DemoContourLayerProps) : React.ReactNode {
    const {current: map_ref} = useMap();
    const map = map_ref.getMap();

    const {colorMode: color_mode} = useColorMode();
    const color_mode_ref = React.useRef(color_mode);

    const is_browser = useIsBrowser();

    const contour_color = color_mode == 'dark' ? '#f0f0f0' : '#000000';
    const contour_args: ContourOptions = {color: contour_color, interval: 3};

    if (is_browser) {
        const {makeHeight, grid, addLayer} = require('./make_data');
        const {PlotLayer, Contour, ContourLabels, initAutumnPlot} = require('autumnplot-gl');

        initAutumnPlot({wasm_base_url: document_script});

        const raw_wspd_field = makeHeight(grid.copy(), 0);
        const cntr = new Contour(raw_wspd_field, contour_args);
        const hght_layer = new PlotLayer('height', cntr);
        
        addLayer(map, hght_layer, () => color_mode != color_mode_ref.current);

        if (props.label_contours) {
            const contour_label_args: ContourLabelOptions = {
                text_color: '#000000', halo: true, halo_color: '#f0f0f0', 
                font_face: 'Open Sans Semibold'
            };

            const labels = new ContourLabels(cntr, contour_label_args);
            const label_layer = new PlotLayer('label', labels);
            addLayer(map, label_layer, () => color_mode != color_mode_ref.current);
        }
    }

    color_mode_ref.current = color_mode;

    return null;
}


export function DemoBarbLayer() : React.ReactNode {
    const {current: map_ref} = useMap();
    const map = map_ref.getMap();

    const {colorMode: color_mode} = useColorMode();
    const color_mode_ref = React.useRef(color_mode);

    const is_browser = useIsBrowser();
    
    const barbs_args = {
        color: color_mode == 'dark' ? '#f0f0f0' : '#000000',
        thin_fac: 16
    };

    if (is_browser) {
        const {makeWinds, grid, addLayer} = require('./make_data');
        const {PlotLayer, Barbs} = require('autumnplot-gl');
        
        const raw_wind_field = makeWinds(grid.copy(), 0);
        const cntr = new Barbs(raw_wind_field, barbs_args);
        const barb_layer = new PlotLayer('wind', cntr);

        addLayer(map, barb_layer, () => color_mode != color_mode_ref.current);
    }


    color_mode_ref.current = color_mode;

    return null;
}


export function DemoContourFillLayer() : React.ReactNode {
    const {current: map_ref} = useMap();
    const map = map_ref.getMap();

    const {colorMode: color_mode} = useColorMode();
    const color_mode_ref = React.useRef(color_mode);

    const is_browser = useIsBrowser();

    if (is_browser) {
        const {makeWindSpeed, grid, addLayer} = require('./make_data');
        const {PlotLayer, ContourFill, colormaps} = require('autumnplot-gl');

        const default_cmap = colormaps.pw_speed500mb;
        const contour_fill_args = {cmap: default_cmap, opacity: 0.6};

        const raw_wspd_field = makeWindSpeed(grid.copy(), 0);
        const cntr = new ContourFill(raw_wspd_field, contour_fill_args);
        const wspd_layer = new PlotLayer('wspd', cntr);

        addLayer(map, wspd_layer, () => color_mode != color_mode_ref.current);
    }

    color_mode_ref.current = color_mode;

    return null;
}


export function DemoObsLayer() : React.ReactNode {
    const {current: map_ref} = useMap();
    const map = map_ref.getMap();

    const {colorMode: color_mode} = useColorMode();
    const color_mode_ref = React.useRef(color_mode);

    const is_browser = useIsBrowser();

    const skyc_choices = ['0/8', '1/8', '2/8', '3/8', '4/8', '5/8', '6/8', '7/8', '8/8', 'obsc', null];
    obs.forEach((ob, iob) => {
        (ob.data as ObsRawData<'pres' | 'tmpf' | 'dwpf' | 'wind' | 'skyc'>).skyc = skyc_choices[iob % skyc_choices.length];
    });

    if (is_browser) {
        const {addLayer} = require('./make_data');
        const {PlotLayer, UnstructuredGrid, RawObsField, StationPlot} = require('autumnplot-gl');

        const obs_grid = new UnstructuredGrid(obs.map(o => o.coord));
        const obs_field = new RawObsField(obs_grid, obs.map(o => o.data) as any);

        const halo_color = color_mode == 'dark' ? '#000000' : '#f0f0f0';
        
        const station_plot_locs: SPDataConfig<'tmpf' | 'dwpf' | 'wind' | 'skyc'> = {
            tmpf: {type: 'number', pos: 'ul', color: '#cc0000', halo_color: halo_color, formatter: val => val === null ? '' : val.toFixed(0)},
            dwpf: {type: 'number', pos: 'll', color: '#00aa00', halo_color: halo_color, formatter: val => val === null ? '' : val.toFixed(0)}, 
            wind: {type: 'barb', color: color_mode == 'dark' ? '#cccccc' : '#000000'},
            skyc: {type: 'symbol', pos: 'c', color: color_mode == 'dark' ? '#cccccc' : '#000000', halo_color: halo_color},
        };
        const station_plot = new StationPlot(obs_field, 
            {config: station_plot_locs, thin_fac: 8, font_size: 14, font_url_template: "https://autumnsky.us/glyphs/{fontstack}/{range}.pbf"});
        const station_plot_layer = new PlotLayer('station-plots', station_plot);

        addLayer(map, station_plot_layer, () => color_mode != color_mode_ref.current);
    }


    color_mode_ref.current = color_mode;

    return null;   
}

export function DemoHodographLayer() : React.ReactNode {
    const {current: map_ref} = useMap();
    const map = map_ref.getMap();

    const {colorMode: color_mode} = useColorMode();
    const color_mode_ref = React.useRef(color_mode);

    const is_browser = useIsBrowser();

    if (is_browser) {
        const {addLayer} = require('./make_data');
        const {PlotLayer, UnstructuredGrid, RawProfileField, Hodographs} = require('autumnplot-gl');

        const points = vwps.map(vwp => ({lon: vwp.lon, lat: vwp.lat}));
        const profs = vwps.map((vwp, ivwp) => ({ilon: ivwp, jlat: 0, u: new Float32Array(vwp.u), v: new Float32Array(vwp.v), z: new Float32Array(vwp.z)}));

        const hodo_grid = new UnstructuredGrid(points)
        const raw_prof_field = new RawProfileField(hodo_grid, profs);
        const hodos = new Hodographs(raw_prof_field, {bgcolor: color_mode == 'dark' ? '#f0f0f0' : '#000000', thin_fac: 4, max_wind_speed_ring: 80});
        const hodo_layer = new PlotLayer('hodos', hodos);

        addLayer(map, hodo_layer, () => color_mode != color_mode_ref.current);
    }

    color_mode_ref.current = color_mode;

    return null;
}


export function DemoPaintballLayer() : React.ReactNode {
    const {current: map_ref} = useMap();
    const map = map_ref.getMap();

    const {colorMode: color_mode} = useColorMode();
    const color_mode_ref = React.useRef(color_mode);

    const is_browser = useIsBrowser();

    const colors = color_mode == 'dark' ? ['#ff5656', '#31d960', '#7b7bff'] : ['#bb2323', '#0a9231', '#2e2eb5'];

    if (is_browser) {
        const {makePaintballData, grid, addLayer} = require('./make_data');
        const {PlotLayer, Paintball} = require('autumnplot-gl');

        const paintball_field = makePaintballData(grid.copy(), colors.length);
        const paintball = new Paintball(paintball_field, {colors: colors});
        const paintball_layer = new PlotLayer('paintball', paintball);

        addLayer(map, paintball_layer, () => color_mode != color_mode_ref.current);
    }

    color_mode_ref.current = color_mode;

    return null;
}


type DemoMapProps = {
    default_expand?: boolean;
    children?: any;
}

export function DemoMap(props: DemoMapProps) : React.ReactNode {
    const default_expand = props.default_expand === undefined ? false : props.default_expand;

    const [viewState, setViewState] = React.useState({
        expanded: default_expand
    });

    const {colorMode} = useColorMode();

    return (
        <div className={viewState.expanded ? `${styles['autumnplot-gl-demo-map']} ${styles['expanded']}` : styles['autumnplot-gl-demo-map']}>
            <Map
                projection='globe'
                initialViewState={{longitude: -97.5, latitude: 38.5, zoom: 3}}
                maxZoom={7}
                mapStyle={(colorMode == 'dark' ? map_style_dark : map_style_light) as StyleSpecification /* Just trust me, bro */}
                attributionControl={false}
            >
                {props.children}
            </Map>
            <div 
                className={styles['expand-handle']}
                onClick={() => setViewState({expanded: !viewState.expanded})}
                title={`Click to ${viewState.expanded ? 'collapse' : 'expand'}`}
            >{viewState.expanded ? '\u25b2' : '\u25bc'}</div>
        </div>
    );
}