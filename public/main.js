
function makeSynthetic500mbLayers() {
    const nx = 121, ny = 61;
    const grid = new apgl.PlateCarreeGrid(nx, ny, -130, 20, -65, 55);
    let hght = [], u = [], v = [];
    for (i = 0; i < nx; i++) {
        for (j = 0; j < ny; j++) {
            const idx = i + j * nx;
            hght[idx] = 10 * (Math.cos(4 * Math.PI * i / (nx - 1)) * Math.cos(2 * Math.PI * j / (ny - 1)) - 0.05 * j);
            u[idx] = 60 * (Math.cos(4 * Math.PI * i / (nx - 1)) * Math.sin(2 * Math.PI * j / (ny - 1)) + 0.5);
            v[idx] = -60 * Math.sin(4 * Math.PI * i / (nx - 1)) * Math.cos(2 * Math.PI * j / (ny - 1));
        }
    }
    const colormap = apgl.colormaps.pw_speed500mb;

    const arrayType = float16.Float16Array;

    const raw_hght_field = new apgl.RawScalarField(grid, new arrayType(hght));
    const raw_u_field = new apgl.RawScalarField(grid, new arrayType(u));
    const raw_v_field = new apgl.RawScalarField(grid, new arrayType(v));

    const raw_ws_field = apgl.RawScalarField.aggregateFields(Math.hypot, raw_u_field, raw_v_field);
    const raw_vec_field = new apgl.RawVectorField(grid, new arrayType(u), new arrayType(v), {relative_to: 'grid'});

    const cntr = new apgl.Contour(raw_hght_field, {interval: 1, color: '#000000', thinner: zoom => zoom < 5 ? 2 : 1});
    const filled = new apgl.ContourFill(raw_ws_field, {'cmap': colormap, 'opacity': 0.8});
    const barbs = new apgl.Barbs(raw_vec_field, {color: '#000000', thin_fac: 16});

    const hght_layer = new apgl.PlotLayer('height', cntr);
    const ws_layer = new apgl.PlotLayer('wind-speed', filled);
    const barb_layer = new apgl.PlotLayer('barbs', barbs);

    const svg = apgl.makeColorBar(colormap, {label: "Wind Speed (kts)", fontface: 'Trebuchet MS', 
                                             ticks: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140],
                                             orientation: 'horizontal', tick_direction: 'bottom'});

    return {layers: [ws_layer, hght_layer, barb_layer], colorbar: svg};
}

async function fetchBinary(fname) {
    resp = await fetch(fname);
    const blob = await resp.blob();
    const ary = new Uint8Array(await blob.arrayBuffer());
    const ary_inflated = pako.inflate(ary);
    return new float16.Float16Array(new Float32Array(ary_inflated.buffer));
}

async function makeHREFLayers() {
    const nx_href = 1799;
    const ny_href = 1059;
    const dx_href = 3000;
    const dy_href = 3000;
    const grid_href = new apgl.LambertGrid(nx_href, ny_href, -97.5, 38.5, [38.5, 38.5], 
                                           -nx_href * dx_href / 2, -ny_href * dy_href / 2, nx_href * dx_href / 2, ny_href * dy_href / 2);

    const nh_prob_data = await fetchBinary('data/hrefv3.2023051100.f036.mxuphl5000_2000m.nh_max.086400_p99.85_0040km.bin.gz');
    const nh_prob_field = new apgl.RawScalarField(grid_href, nh_prob_data);
    const nh_prob_contour = new apgl.Contour(nh_prob_field, {'levels': [0.1, 0.3, 0.5, 0.7, 0.9], 'color': '#000000'});
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
        {lat: 35.17, lon: -97.34, ilon: 0, jlat: 0, smu: 0, smv: 20, u: hodo_u, v: hodo_v, z: hodo_z},
        {lat: 35.17, lon: -96.84, ilon: 1, jlat: 0, smu: 0, smv: 20, u: hodo_u, v: hodo_v, z: hodo_z},
        {lat: 35.67, lon: -97.34, ilon: 0, jlat: 1, smu: 0, smv: 20, u: hodo_u, v: hodo_v, z: hodo_z},
        {lat: 35.67, lon: -96.84, ilon: 1, jlat: 1, smu: 0, smv: 20, u: hodo_u, v: hodo_v, z: hodo_z},
    ];
    const hodo_grid = new apgl.PlateCarreeGrid(2, 2, -97.34, 35.17, -96.84, 35.67);
    const raw_prof_field = new apgl.RawProfileField(hodo_grid, profs);
    const hodos = new apgl.Hodographs(raw_prof_field, {bgcolor: '#000000', thin_fac: 64});
    const hodo_layer = new apgl.PlotLayer('hodos', hodos);

    return {layers: [hodo_layer]};
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
    'hodo': {
        name: "Hodographs",
        makeLayers: makeHodoLayers,
        maxZoom: 7,
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