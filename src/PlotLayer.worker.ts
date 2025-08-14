
import { getMinZoom } from "./utils";
import { LineData, Polyline } from "./AutumnTypes";

import * as Comlink from 'comlink';
import { LngLat } from "./Map";

function makeBBElements(field_lats: Float32Array, field_lons: Float32Array, min_zoom: Uint8Array, field_ni: number, field_nj: number, map_max_zoom: number) {
        
    const n_coords_per_pt_pts = 2;
    const n_coords_per_pt_tc = 2;

    const field_n_access = min_zoom.filter(mz => mz <= map_max_zoom).length;
    const n_elems_pts = field_n_access * n_coords_per_pt_pts;
    const n_elems_tc = field_n_access * n_coords_per_pt_tc;

    let pts = new Float32Array(n_elems_pts);
    let tex_coords = new Float32Array(n_elems_tc);

    let istart_pts = 0;
    let istart_tc = 0;

    for (let ilat = 0; ilat < field_nj; ilat++) {
        for (let ilon = 0; ilon < field_ni; ilon++) {
            const idx = ilat * field_ni + ilon;
            const lat = field_lats[idx];
            const lon = field_lons[idx];
            const zoom = min_zoom[idx];

            if (zoom > map_max_zoom || lon === undefined || lat === undefined) continue; // TAS: Adding the checks for lat/lon here may be a bug waiting to happen? Not sure.

            const pt_ll = new LngLat(lon, lat).toMercatorCoord();

            pts[istart_pts + 0] = pt_ll.x; 
            pts[istart_pts + 1] = pt_ll.y; 

            // Pack the min zoom in with the texture coordinates; only works because the min zoom is always an integer
            // Another gotcha is that if the i texcoord is 1, then that bump up the zoom that gets unpacked on the GPU, which causes may cause the last column of billboards to
            //  disappear. To fix this, cap the texcoord at 0.99999, which should be good for textures up to 10^5 pixels in size.
            tex_coords[istart_tc + 0] = Math.min(ilon / (field_ni - 1), 0.99999) + zoom;
            tex_coords[istart_tc + 1] = ilat / (field_nj - 1);

            istart_pts += n_coords_per_pt_pts;
            istart_tc += n_coords_per_pt_tc;
        }
    }

    return {'pts': pts, 'tex_coords': tex_coords};
}

function makeDomainVerticesAndTexCoords(field_lats: Float32Array, field_lons: Float32Array, field_ni: number, field_nj: number, texcoord_margin_r: number, texcoord_margin_s: number) {
    const verts = new Float32Array(2 * 2 * (field_ni - 1) * (field_nj + 1)).fill(0);
    const tex_coords = new Float32Array(2 * 2 * (field_ni - 1) * (field_nj + 1)).fill(0);

    let ivert = 0
    let itexcoord = 0;

    for (let i = 0; i < field_ni - 1; i++) {
        for (let j = 0; j < field_nj; j++) {
            const idx = i + j * field_ni;

            const pt = new LngLat(field_lons[idx], field_lats[idx]).toMercatorCoord();
            const pt_ip1 = new LngLat(field_lons[idx + 1], field_lats[idx + 1]).toMercatorCoord();

            const r = i / (field_ni - 1) * (1 - 2 * texcoord_margin_r) + texcoord_margin_r;
            const rp1 = (i + 1) / (field_ni - 1) * (1 - 2 * texcoord_margin_r) + texcoord_margin_r;
            const s = j / (field_nj - 1) * (1 - 2 * texcoord_margin_s) + texcoord_margin_s;

            if (j == 0) {
                verts[ivert] = pt.x; verts[ivert + 1] = pt.y;
                ivert += 2

                tex_coords[itexcoord] = r; tex_coords[itexcoord + 1] = s;
                itexcoord += 2;
            }

            verts[ivert    ] = pt.x;     verts[ivert + 1] = pt.y;
            verts[ivert + 2] = pt_ip1.x; verts[ivert + 3] = pt_ip1.y;
            ivert += 4;

            tex_coords[itexcoord    ] = r; tex_coords[itexcoord + 1] = s;
            tex_coords[itexcoord + 2] = rp1; tex_coords[itexcoord + 3] = s;
            itexcoord += 4;

            if (j == field_nj - 1) {
                verts[ivert] = pt_ip1.x; verts[ivert + 1] = pt_ip1.y;
                ivert += 2;

                tex_coords[itexcoord] = rp1; tex_coords[itexcoord + 1] = s;
                itexcoord += 2;
            }
        }
    }

    return {'vertices': verts, 'tex_coords': tex_coords};
}

/*
function makePolylinesMiter(lines) {
    const n_points_per_vert = Object.fromEntries(Object.entries(lines[0]).map(([k, v]) => {
        let n_verts;
        if (v.length === undefined) {
            n_verts = 1;
        }
        else {
            n_verts = k == 'verts' ? v[0].length : v.length;
        }
        return [k, n_verts];
    }));
    n_points_per_vert['extrusion'] = 2;

    const n_verts = lines.map(l => l['verts'].length).reduce((a, b) => a + b);
    const ary_lens = Object.fromEntries(Object.entries(n_points_per_vert).map(([k, nppv]) => [k, (n_verts * 2 + lines.length * 2) * nppv]));

    let ret = Object.fromEntries(Object.entries(ary_lens).map(([k, v]) => [k, new Float32Array(v)]));

    let ilns = Object.fromEntries(Object.keys(ary_lens).map(k => [k, 0]));

    const is_cw_winding = (pt_prev, pt_this, pt_next) => {
        const winding = (pt_this[0] - pt_prev[0]) * (pt_this[1] + pt_prev[1]) 
                      + (pt_next[0] - pt_this[0]) * (pt_next[1] + pt_this[1]) 
                      + (pt_prev[0] - pt_next[0]) * (pt_prev[1] + pt_next[1]);

        return winding > 0;
    }

    const calculate_extrusion = (pt_prev, pt_this, pt_next) => {
        let line_vec_x_prev, line_vec_y_prev, line_vec_mag_prev, 
            line_vec_x_next, line_vec_y_next, line_vec_mag_next;
        let ext_x, ext_y;

        if (pt_prev !== null) {
            line_vec_x_prev = pt_this[0] - pt_prev[0];
            line_vec_y_prev = pt_this[1] - pt_prev[1];
            line_vec_mag_prev = Math.hypot(line_vec_x_prev, line_vec_y_prev);
            line_vec_x_prev /= line_vec_mag_prev;
            line_vec_y_prev /= line_vec_mag_prev;
        }

        if (pt_next !== null) {
            line_vec_x_next = pt_next[0] - pt_this[0];
            line_vec_y_next = pt_next[1] - pt_this[1];
            line_vec_mag_next = Math.hypot(line_vec_x_next, line_vec_y_next);
            line_vec_x_next /= line_vec_mag_next;
            line_vec_y_next /= line_vec_mag_next;
        }

        if (pt_prev === null) {
            // First point in the line gets just the normal for the first segment
            ext_x = line_vec_y_next; ext_y = -line_vec_x_next;
        }
        else if (pt_this === null) {
            // Last point in the line gets just the normal for the last segment
            ext_x = line_vec_y_prev; ext_y = -line_vec_x_prev;
        }
        else {
            // Miter join: compute the extrusion vector halfway between the next and previous normal
            const dot = line_vec_x_prev * line_vec_x_next + line_vec_y_prev * line_vec_y_next;
            const ext_fac = Math.sqrt((1 - dot) / (1 + dot));
            const sign = is_cw_winding(pt_prev, pt_this, pt_this) ? -1 : 1;
            ext_x = line_vec_y_prev                  + sign * line_vec_x_prev * ext_fac;
            ext_y = sign * line_vec_y_prev * ext_fac - line_vec_x_prev;
        }

        return [ext_x, ext_y];
    }

    lines.forEach(line => {
        const verts = line['verts'];
        let ext_x, ext_y;

        let ivt = 0;
        ret['verts'][ilns['verts']] = verts[ivt][0]; ret['verts'][ilns['verts'] + 1] = verts[ivt][1];

        [ext_x, ext_y] = calculate_extrusion(null, verts[ivt], verts[ivt + 1]);
        ret['extrusion'][ilns['extrusion']] = ext_x; ret['extrusion'][ilns['extrusion'] + 1] = ext_y;

        for (ivt = 0; ivt < verts.length; ivt++) {
            const ary_ivt = ilns['verts'] + 2 * (2 * ivt + 1);
            ret['verts'][ary_ivt + 0] = verts[ivt][0]; ret['verts'][ary_ivt + 1] = verts[ivt][1];
            ret['verts'][ary_ivt + 2] = verts[ivt][0]; ret['verts'][ary_ivt + 3] = verts[ivt][1];

            if (ivt == 0) {
                [ext_x, ext_y] = calculate_extrusion(null, verts[ivt], verts[ivt + 1]);
            }
            else if (ivt == verts.length - 1) {
                [ext_x, ext_y] = calculate_extrusion(verts[ivt - 1], verts[ivt], null);
            }
            else {
                [ext_x, ext_y] = calculate_extrusion(verts[ivt - 1], verts[ivt], verts[ivt + 1]);
            }

            ret['extrusion'][ary_ivt + 0] =  ext_x; ret['extrusion'][ary_ivt + 1] =  ext_y;
            ret['extrusion'][ary_ivt + 2] = -ext_x; ret['extrusion'][ary_ivt + 3] = -ext_y;
        }

        ivt = verts.length - 1;
        ret['verts'][ilns['verts'] + 2 * (2 * ivt + 1) + 4] = verts[ivt][0]; 
        ret['verts'][ilns['verts'] + 2 * (2 * ivt + 1) + 5] = verts[ivt][1];
        
        [ext_x, ext_y] = calculate_extrusion(verts[ivt - 1], verts[ivt], null);

        ret['extrusion'][ilns['extrusion'] + 2 * (2 * ivt + 1) + 4] = -ext_x; 
        ret['extrusion'][ilns['extrusion'] + 2 * (2 * ivt + 1) + 5] = -ext_y;

        for (let key in ret) {
            if (key == 'verts' || key == 'extrusion') continue;

            for (ivt = 0; ivt < (verts.length * 2 + 2) * n_points_per_vert[key]; ivt += n_points_per_vert[key]) {
                if (line[key].length !== undefined) {
                    line[key].forEach((cd, icd) => {
                        ret[key][ilns[key] + ivt + icd] = cd;
                    })
                }
                else {
                    ret[key][ilns[key] + ivt] = line[key];
                }
            }
        }

        Object.keys(ilns).forEach(k => {
            ilns[k] += (verts.length * 2 + 2) * n_points_per_vert[k];
        })
    })

    return ret;
}
*/

function makePolylines(lines: LineData[]) : Polyline {
    if (lines.length == 0 || lines[0].vertices.length == 0) {
        return {vertices: new Float32Array([]), extrusion: new Float32Array([])};
    }

    const n_points_per_vert = Object.fromEntries(Object.entries(lines[0]).map(([k, v]) => {
        let n_verts: number;
        if (typeof v === 'number') {
            n_verts = 1;
        }
        else if (typeof v[0] === 'number') {
            n_verts = 1;
        }
        else {
            n_verts = v[0].length;
        }
        return [k, n_verts];
    }));
    n_points_per_vert['extrusion'] = 2;
    n_points_per_vert['vertices'] += 1;

    const n_verts = lines.map(l => l.vertices.length).reduce((a, b) => a + b);
    const n_out_verts = n_verts * 4 - lines.length * 2;
    const ary_lens = Object.fromEntries(Object.entries(n_points_per_vert).map(([k, nppv]) => [k, n_out_verts * nppv]));

    let ret: Polyline = {
        vertices: new Float32Array(ary_lens['vertices']),
        extrusion: new Float32Array(ary_lens['extrusion']),
    }

    if ('offsets' in lines[0]) {
        ret.offsets = new Float32Array(ary_lens['offsets']);
    }

    if ('data' in lines[0]) {
        ret.data = new Float32Array(ary_lens['data']);
    }

    if ('zoom' in lines[0]) {
        ret.zoom = new Float32Array(ary_lens['zoom']);
    }

    let ilns = Object.fromEntries(Object.keys(ary_lens).map(k => [k, 0]));

    const compute_normal_vec = (pt1: [number, number], pt2: [number, number], flip_y_coord: boolean) => {
        const line_vec_x = pt2[0] - pt1[0];
        const line_vec_y = pt2[1] - pt1[1];
        const line_vec_mag = Math.hypot(line_vec_x, line_vec_y);

        const ext_x = line_vec_y / line_vec_mag;
        const ext_y = -line_vec_x / line_vec_mag;

        return [ext_x, flip_y_coord ? -ext_y : ext_y];
    }

    lines.forEach(line => {
        const verts = line.vertices.map(v => {
            const v_ll = new LngLat(...v).toMercatorCoord();
            return [v_ll.x, v_ll.y] as [number, number];
        });

        const has_offsets = line.offsets !== undefined;
        const extrusion_verts = line.offsets !== undefined ? line.offsets : verts;

        let pt_prev: [number, number], pt_this = verts[0], pt_next = verts[1];
        let ept_prev: [number, number], ept_this = extrusion_verts[0], ept_next = extrusion_verts[1];
        let len_prev: number, len_this = 0.0001;
        let [ext_x, ext_y] = compute_normal_vec(ept_this, ept_next, !has_offsets);

        ret.vertices[ilns.vertices++] = pt_this[0]; ret.vertices[ilns.vertices++] = pt_this[1]; ret.vertices[ilns.vertices++] = len_this;
        ret.extrusion[ilns.extrusion++] = ext_x; ret.extrusion[ilns.extrusion++] = ext_y;

        for (let ivt = 1; ivt < verts.length; ivt++) {
            pt_this = verts[ivt]; pt_prev = verts[ivt - 1];
            ept_this = extrusion_verts[ivt]; ept_prev = extrusion_verts[ivt - 1];

            [ext_x, ext_y] = compute_normal_vec(ept_prev, ept_this, !has_offsets);
            len_prev = len_this; len_this += Math.hypot(verts[ivt - 1][0] - verts[ivt][0], verts[ivt - 1][1] - verts[ivt][1]);

            ret.vertices[ilns.vertices++] = pt_prev[0]; ret.vertices[ilns.vertices++] = pt_prev[1]; ret.vertices[ilns.vertices++] = -len_prev;
            ret.vertices[ilns.vertices++] = pt_prev[0]; ret.vertices[ilns.vertices++] = pt_prev[1]; ret.vertices[ilns.vertices++] = len_prev;

            ret.vertices[ilns.vertices++] = pt_this[0]; ret.vertices[ilns.vertices++] = pt_this[1]; ret.vertices[ilns.vertices++] = -len_this;
            ret.vertices[ilns.vertices++] = pt_this[0]; ret.vertices[ilns.vertices++] = pt_this[1]; ret.vertices[ilns.vertices++] = len_this;

            ret.extrusion[ilns.extrusion++] =  ext_x; ret.extrusion[ilns.extrusion++] =  ext_y;
            ret.extrusion[ilns.extrusion++] = -ext_x; ret.extrusion[ilns.extrusion++] = -ext_y;

            ret.extrusion[ilns.extrusion++] =  ext_x; ret.extrusion[ilns.extrusion++] =  ext_y;
            ret.extrusion[ilns.extrusion++] = -ext_x; ret.extrusion[ilns.extrusion++] = -ext_y;
        }

        ret.vertices[ilns.vertices++] = pt_this[0]; ret.vertices[ilns.vertices++] = pt_this[1]; ret.vertices[ilns.vertices++] = len_this;
        ret.extrusion[ilns.extrusion++] = -ext_x; ret.extrusion[ilns.extrusion++] = -ext_y;

        if (ret.offsets !== undefined && line.offsets !== undefined) {
            const offsets = line.offsets;
            let off_prev: [number, number], off_this = offsets[0];

            ret.offsets[ilns.offsets++] = off_this[0]; ret.offsets[ilns.offsets++] = off_this[1];

            for (let ivt = 1; ivt < offsets.length; ivt++) {
                off_this = offsets[ivt]; off_prev = offsets[ivt - 1];

                ret.offsets[ilns.offsets++] = off_prev[0]; ret.offsets[ilns.offsets++] = off_prev[1];
                ret.offsets[ilns.offsets++] = off_prev[0]; ret.offsets[ilns.offsets++] = off_prev[1];
                ret.offsets[ilns.offsets++] = off_this[0]; ret.offsets[ilns.offsets++] = off_this[1];
                ret.offsets[ilns.offsets++] = off_this[0]; ret.offsets[ilns.offsets++] = off_this[1];
            }

            ret.offsets[ilns.offsets++] = off_this[0]; ret.offsets[ilns.offsets++] = off_this[1];
        }

        if (ret.data !== undefined && line.data !== undefined) {
            const data = line.data;
            let data_prev: number, data_this = data[0];

            ret.data[ilns.data++] = data_this;
            
            for (let ivt = 1; ivt < data.length; ivt++) {
                data_this = data[ivt]; data_prev = data[ivt - 1];

                ret.data[ilns.data++] = data_prev;
                ret.data[ilns.data++] = data_prev;
                ret.data[ilns.data++] = data_this;
                ret.data[ilns.data++] = data_this;
            }

            ret.data[ilns.data++] = data_this;
        }
        
        if (ret.zoom !== undefined && line.zoom !== undefined) {
            for (let ivt = 0; ivt < verts.length * 4 - 2; ivt++) {
                ret.zoom[ilns.zoom++] = line['zoom'];
            }
        }
    })

    return ret;
}

const ep_interface = {
    'makeBBElements': makeBBElements, 
    'makeDomainVerticesAndTexCoords': makeDomainVerticesAndTexCoords,
    'makePolyLines': makePolylines
}

type PlotLayerWorker = typeof ep_interface;

Comlink.expose(ep_interface);

export type {PlotLayerWorker}