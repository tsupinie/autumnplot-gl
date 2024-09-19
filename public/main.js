
function makeSynthetic500mbLayers() {
    const nx = 121, ny = 61;
    const grid = new apgl.PlateCarreeGrid(nx, ny, -130, 20, -65, 55);
    //const grid = new apgl.LambertGrid(nx, ny, -97.5, 38.5, [38.5, 38.5], -3600000, -1800000, 3600000, 1800000);
    //const grid = new apgl.PlateCarreeRotatedGrid(nx, ny, 65.305142, 36.08852, 180, -14.82122, -12.302501, 42.306283, 16.7);
    const coords = grid.getGridCoords();

    const height_base = 570;
    const height_pert = 10;
    const height_grad = 0.5
    const vel_pert = 60;
    const speed = 0.001;

    const arrayType = Float32Array;

    function makeHeight(key) {
        let hght = [];
        for (i = 0; i < nx; i++) {
            for (j = 0; j < ny; j++) {
                const idx = i + j * nx;
                if (i < 10 && j < 10) {
                    hght[idx] = NaN;
                }
                else {
                    hght[idx] = height_base + height_pert * (Math.cos(-key * speed + 4 * Math.PI * i / (nx - 1)) * Math.cos(2 * Math.PI * j / (ny - 1))) - 61 * height_grad * j / ny;
                }
            }
        }
        return new apgl.RawScalarField(grid, new arrayType(hght));
    }

    function makeWinds(key) {
        let u = [], v = [];
        for (i = 0; i < nx; i++) {
            for (j = 0; j < ny; j++) {
                const idx = i + j * nx;

                if (i < 10 && j < 10) {
                    u[idx] = v[idx] = NaN;
                }
                else {
                    let v_fac = 1;
                    if (grid.type == 'latlon' || grid.type == 'latlonrot') {
                        v_fac = Math.cos(coords.y[j] * Math.PI / 180);
                    }
        
                    let u_earth = vel_pert * (Math.cos(-key * speed + 4 * Math.PI * i / (nx - 1)) * Math.sin(2 * Math.PI * j / (ny - 1)) + height_grad);
                    let v_earth = -vel_pert * Math.sin(-key * speed + 4 * Math.PI * i / (nx - 1)) * Math.cos(2 * Math.PI * j / (ny - 1));
        
                    const mag = Math.hypot(u_earth, v_earth);
                    v_earth /= v_fac;
        
                    u[idx] = u_earth * mag / Math.hypot(u_earth, v_earth);
                    v[idx] = v_earth * mag / Math.hypot(u_earth, v_earth);
                }
            }
        }

        return new apgl.RawVectorField(grid, new arrayType(u), new arrayType(v), {relative_to: 'grid'});
    }

    function makeWindSpeed(key) {
        const winds = makeWinds(key);
        const wspd = [];

        for (let idx = 0; idx < winds.u.data.length; idx++) {
            wspd[idx] = Math.hypot(winds.u.data[idx], winds.v.data[idx]);
        }

        return new apgl.RawScalarField(grid, new arrayType(wspd));
    }

    const colormap = apgl.colormaps.pw_speed500mb;

    const raw_hght_field = makeHeight(0);
    const raw_wind_field = makeWinds(0);
    const raw_ws_field = makeWindSpeed(0);

    const cntr = new apgl.Contour(raw_hght_field, {interval: 1, color: '#000000', line_width: lev => lev < 565 ? 2 : 4, line_style: lev => lev < 555 ? '--' : '-'});
    const filled = new apgl.ContourFill(raw_ws_field, {'cmap': colormap, 'opacity': 0.8});
    const barbs = new apgl.Barbs(raw_wind_field, {color: '#000000', thin_fac: 16});

    const labels = new apgl.ContourLabels(cntr, {text_color: '#ffffff', halo: true});

    const hght_layer = new apgl.PlotLayer('height', cntr);
    const ws_layer = new apgl.PlotLayer('wind-speed', filled);
    const barb_layer = new apgl.PlotLayer('barbs', barbs);
    const label_layer = new apgl.PlotLayer('label', labels);

    function updateTime(time) {
        cntr.updateField(makeHeight(time));
        filled.updateField(makeWindSpeed(time));
        barbs.updateField(makeWinds(time));
        labels.updateField();

        window.requestAnimationFrame(updateTime);
    }

    //updateTime(0);

    const svg = apgl.makeColorBar(colormap, {label: "Wind Speed (kts)", fontface: 'Trebuchet MS', 
                                             ticks: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140],
                                             orientation: 'horizontal', tick_direction: 'bottom'});

    return {layers: [ws_layer, hght_layer, barb_layer, label_layer], colorbar: svg};
}

async function fetchBinary(fname) {
    resp = await fetch(fname);
    const blob = await resp.blob();
    const ary = new Uint8Array(await blob.arrayBuffer());
    const ary_inflated = pako.inflate(ary);
    return new float16.Float16Array(new Float32Array(ary_inflated.buffer));
}

async function makeHREFLayers() {
    const grid_href = new apgl.LambertGrid.fromLLCornerLonLat(1799, 1059, -97.5, 38.5, [38.5, 38.5], -122.719528, 21.138123, 3000, 3000);

    const nh_prob_data = await fetchBinary('data/hrefv3.2023051100.f036.mxuphl5000_2000m.nh_max.086400_p99.85_0040km.bin.gz');
    //const nh_prob_data = await fetchBinary('data/hrrr_pmsl.bin.gz');
    const nh_prob_field = new apgl.RawScalarField(grid_href, nh_prob_data);
    const nh_prob_contour = new apgl.Contour(nh_prob_field, {'levels': [0.1, 0.3, 0.5, 0.7, 0.9], 'color': '#000000'});
    //const nh_prob_contour = new apgl.Contour(nh_prob_field, {'interval': 400, 'color': '#000000'});
    const nh_prob_layer = new apgl.PlotLayer('nh_probs', nh_prob_contour);


    const pb_data = await fetchBinary('data/hrefv3.2023051100.f036.mxuphl5000_2000m.086400.pb75.bin.gz');
    // If I don't draw the contours, this doesn't draw anything. Why is that?
    const href_pb_colors = ['#9d4c1c', '#f2b368', '#792394', '#d99cf9', '#1e3293', '#aabee3', '#bc373b', '#f0928f', '#397d21', '#b5f0ab'];

    const pb_field = new apgl.RawScalarField(grid_href, pb_data);
    const paintball = new apgl.Paintball(pb_field, {'colors': href_pb_colors});
    const paintball_layer = new apgl.PlotLayer('paintball', paintball);

    const svg = apgl.makePaintballKey(href_pb_colors,
                                      ['HRRR', 'HRRR -6h', 'HRW ARW', 'HRW ARW -12h', 'HRW FV3', 'HRW FV3 -12h', 'HRW NSSL', 'HRW NSSL -12h', 'NAM 3k', 'NAM 3k -12h'],
                                      {n_cols: 5});

    return {layers: [paintball_layer, nh_prob_layer], colorbar: svg};
}

async function makeGFSLayers() {
    const grid_gfs = new apgl.PlateCarreeGrid(1441, 721, 0, -90, 360, 90);

    const colormap = apgl.colormaps.pw_t2m
    const t2m_data = await fetchBinary('data/gfs.bin.gz');

    const t2m_data_pad = new float16.Float16Array(grid_gfs.ni * grid_gfs.nj);

    for (let j = 0; j < grid_gfs.nj; j++) {
        const idx_start = (grid_gfs.ni - 1) * j;
        const idx_end = (grid_gfs.ni - 1) * (j + 1);
        const idx_pad_start = grid_gfs.ni * j;
        const idx_pad_end = grid_gfs.ni * (j + 1);

        t2m_data_pad.set(t2m_data.subarray(idx_start, idx_end), idx_pad_start);
        t2m_data_pad[idx_pad_end - 1] = t2m_data[idx_start];
    }

    const t2m_field = new apgl.RawScalarField(grid_gfs, t2m_data_pad);
    const t2m_contour = new apgl.ContourFill(t2m_field, {'cmap': colormap});
    const t2m_layer = new apgl.PlotLayer('nh_probs', t2m_contour);


    const svg = apgl.makeColorBar(colormap, {label: "Temperature", fontface: 'Trebuchet MS', 
                                             ticks: [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
                                             orientation: 'horizontal', tick_direction: 'bottom'});

    return {layers: [t2m_layer], colorbar: svg};
}

function makeHodoLayers() {
    const hodo_u = [];
    const hodo_v = [];
    const hodo_z = [];
    const hodo_nz = 40;
    const hodo_zmax = 9;
    for (let kdz = 0; kdz < hodo_nz; kdz++) {
        const z = kdz / (hodo_nz - 1) * hodo_zmax;
        hodo_u.push(-20 * Math.cos(z / hodo_zmax * Math.PI));
        hodo_v.push(20 * (Math.sin(z / hodo_zmax * Math.PI) + 1));
        hodo_z.push(z);
    }
    const profs = [
        {lat: 35.17, lon: -97.44, ilon: 0, jlat: 0, smu: 0, smv: 20, u: hodo_u, v: hodo_v, z: hodo_z},
        {lat: 35.17, lon: -96.94, ilon: 1, jlat: 0, smu: 0, smv: 20, u: hodo_u, v: hodo_v, z: hodo_z},
        {lat: 35.67, lon: -97.44, ilon: 0, jlat: 1, smu: 0, smv: 20, u: hodo_u, v: hodo_v, z: hodo_z},
        {lat: 35.67, lon: -96.94, ilon: 1, jlat: 1, smu: 0, smv: 20, u: hodo_u, v: hodo_v, z: hodo_z},
        {lat: 36.17, lon: -97.44, ilon: 0, jlat: 2, smu: 0, smv: 20, u: hodo_u, v: hodo_v, z: hodo_z},
    ];
    const hodo_grid = new apgl.PlateCarreeGrid(2, 3, -97.44, 35.17, -96.94, 36.17);
    const raw_prof_field = new apgl.RawProfileField(hodo_grid, profs);
    const hodos = new apgl.Hodographs(raw_prof_field, {bgcolor: '#000000', thin_fac: 64});
    const hodo_layer = new apgl.PlotLayer('hodos', hodos);

    return {layers: [hodo_layer]};
}

async function makeObsLayers() {
    const skyc_choices = ['0/8', '1/8', '2/8', '3/8', '4/8', '5/8', '6/8', '7/8', '8/8', 'obsc', null];
    const preswx_choices = ['fu', 'hz', 'du', 'bldu', 'po', 'vcds',
                            'br', 'bc', 'mifg', 'vcts', 'virga', 'vcsh', 'ts', 
                            'sq', 'fc', 'ds', '+ds', 'drsn', '+drsn', '-blsn', '+blsn',
                            'vcfg', 'bcfg', 'prfg', 'fg', 'fzfg', 
                            '-vctsdz', '-dz', '-dzbr', 'vctsdz', 'dz', '+vctsdz', '+dz', '-fzdz', 'fzdz', '-dzra', '+dzra', 
                            '-ra', 'ra', '+ra', '-fzra',  'fzra',  '-rasn', 'rasn', '-sn', 'sn', '+sn', 'ic',  'pl',
                            '-sh', 'sh', '-shsnra', '+shrabr', '-shsn', 'shsn', '-gs', '-sngs', '-gr', 'gr', 
                            'tsrasn', 'tsra',  'tspl',  'tsgr', '+tsfzrapl', '+tsra', '+tssn', 'tssa', '+tsgr', 
                            '-up', '+up', '-fzup', '+fzup']

    //const resp = await fetch('data/okmeso.json');
    const resp = await fetch('data/surface_20240823_1500.json');
    const obs = await resp.json();

    obs.forEach((ob, iob) => {
        ob.data.skyc = skyc_choices[iob % skyc_choices.length];
        ob.data.preswx = preswx_choices[iob % preswx_choices.length];
    });

    const obs_grid = new apgl.UnstructuredGrid(obs.map(o => o.coord));
    const obs_field = new apgl.RawObsField(obs_grid, obs.map(o => o.data));

    // Should missing be NaN or null? Also, the function formatter isn't transferrable to JSON. Is that easy enough to fix?
    const station_plot_locs = {
        //id: {type: 'string', pos: 'lr'},
        tmpf: {type: 'number', pos: 'ul', color: '#cc0000', formatter: val => val === null ? '' : val.toFixed(0)},
        dwpf: {type: 'number', pos: 'll', color: '#00aa00', formatter: val => val === null ? '' : val.toFixed(0)}, 
        wind: {type: 'barb', pos: 'c'},
        preswx: {type: 'symbol', pos: 'cl', color: '#ff00ff'},
        skyc: {type: 'symbol', pos: 'c'},
    };
    const station_plot = new apgl.StationPlot(obs_field, {config: station_plot_locs, thin_fac: 8, font_size: 14});
    const station_plot_layer = new apgl.PlotLayer('station-plots', station_plot);

    return {layers: [station_plot_layer]};
}

async function makeMRMSLayer() {
    const grid_mrms = new apgl.PlateCarreeGrid(7000, 3500, -129.995, 20.005, -60.005, 54.995);
    const data = await fetchBinary('data/mrms.202112152259.cref.bin.gz');
    const raw_cref_field = new apgl.RawScalarField(grid_mrms, data);
    const raster_cref = new apgl.Raster(raw_cref_field, {cmap: apgl.colormaps.nws_storm_clear_refl});
    const raster_layer = new apgl.PlotLayer('mrms_cref', raster_cref);

    const svg = apgl.makeColorBar(apgl.colormaps.nws_storm_clear_refl, {label: "Reflectivity (dBZ)", fontface: 'Trebuchet MS', 
                                                                        ticks: [-20, -10, 0, 10, 20, 30, 40, 50, 60, 70],
                                                                        orientation: 'horizontal', tick_direction: 'bottom'})

    return {layers: [raster_layer], colorbar: svg};
}

const views = {
    'default': {
        name: "Synthetic 500mb",
        makeLayers: makeSynthetic500mbLayers,
        maxZoom: 7,
    },
    'href': {
        name: "HREF",
        makeLayers: makeHREFLayers,
        maxZoom: 7,
    },
    'gfs': {
        name: "GFS",
        makeLayers: makeGFSLayers,
        maxZoom: 7,
    },
    'hodo': {
        name: "Hodographs",
        makeLayers: makeHodoLayers,
        maxZoom: 7,
    },
    'obs': {
        name: "Observations",
        makeLayers: makeObsLayers,
        maxZoom: 8.5,
    },
    'mrms': {
        name: "MRMS",
        makeLayers: makeMRMSLayer,
        maxZoom: 8.5,
    }
};

window.addEventListener('load', () => {
    const menu = document.querySelector('#selection select');
    menu.innerHTML = Object.entries(views).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('');

    const map = new maplibregl.Map({
        container: 'map',
        style: 'http://localhost:9000/style.json',
        center: [-97.5, 38.5],
        zoom: 4,
        maxZoom: 7,
    });

    let current_layers = [];

    async function updateMap() {
        const view = views[menu.value];
        map.setMaxZoom(view.maxZoom);

        const {layers, colorbar} = await view.makeLayers();

        current_layers.forEach(lyr => {
            map.removeLayer(lyr.id);
        });

        layers.forEach(lyr => {
            map.addLayer(lyr, 'coastline');
        });

        const colorbar_container = document.querySelector('#colorbar');
        colorbar_container.innerHTML = "";
        if (colorbar) {
            colorbar_container.appendChild(colorbar);
        }

        current_layers = layers;
    }

    map.on('load', updateMap);
    menu.addEventListener('change', updateMap);
});