
import { getMinZoom } from "./utils";
import { BarbDimSpec, PolylineSpec, LineSpec } from "./AutumnFieldTypes";

import * as Comlink from 'comlink';
import { BillboardSpec } from "./BillboardCollection";
import { LngLat } from "./AutumnMap";

function makeBarbElements(field_lats: Float32Array, field_lons: Float32Array, field_u: Float32Array, field_v: Float32Array, thin_fac_base: number, 
    BARB_DIMS: BarbDimSpec) : BillboardSpec {
        
    const BARB_WIDTH = BARB_DIMS['BARB_WIDTH'];
    const BARB_TEX_WIDTH = BARB_DIMS['BARB_TEX_WIDTH'];
    const BARB_HEIGHT = BARB_DIMS['BARB_HEIGHT'];
    const BARB_TEX_HEIGHT = BARB_DIMS['BARB_TEX_HEIGHT'];
    const BARB_TEX_WRAP = BARB_DIMS['BARB_TEX_WRAP'];

    const n_lats = field_lats.length;
    const n_lons = field_lons.length;
    const n_pts_per_poly = 6;
    const n_coords_per_pt_pts = 3;
    const n_coords_per_pt_tc = 2;

    const n_elems_pts = n_lats * n_lons * n_pts_per_poly * n_coords_per_pt_pts;
    const n_elems_tc = n_lats * n_lons * n_pts_per_poly * n_coords_per_pt_tc;

    let pts = new Float32Array(n_elems_pts);
    let offset = new Float32Array(n_elems_tc);
    let tex_coords = new Float32Array(n_elems_tc);

    let istart_pts = 0;
    let istart_tc = 0;

    const barb_width_frac = BARB_WIDTH / BARB_TEX_WIDTH;
    const barb_height_frac = BARB_HEIGHT / BARB_TEX_HEIGHT;

    field_lats.forEach((lat, ilat) => {
        field_lons.forEach((lon, ilon) => {
            const zoom = getMinZoom(ilat, ilon, thin_fac_base);

            const u = field_u[ilat * n_lons + ilon];
            const v = field_v[ilat * n_lons + ilon];
            const barb_mag = Math.round(Math.hypot(u, v) / 5) * 5;
            const barb_ang = 90 - Math.atan2(-v, -u) * 180 / Math.PI;

            const pt_ll = new LngLat(lon, lat).toMercatorCoord();

            // These contain a degenerate triangle on either end to imitate primitive restarting
            //  (see https://groups.google.com/g/webgl-dev-list/c/KLfiwj4jax0/m/cKiezrhRz8MJ?pli=1)
            for (let icrnr = 0; icrnr < n_pts_per_poly; icrnr++) {
                const actual_icrnr = Math.max(0, Math.min(icrnr - 1, 3));

                pts[istart_pts + icrnr * n_coords_per_pt_pts + 0] = pt_ll.x; 
                pts[istart_pts + icrnr * n_coords_per_pt_pts + 1] = pt_ll.y; 
                pts[istart_pts + icrnr * n_coords_per_pt_pts + 2] = zoom;
                offset[istart_tc + icrnr * n_coords_per_pt_tc + 0] = actual_icrnr; 
                offset[istart_tc + icrnr * n_coords_per_pt_tc + 1] = barb_ang;
            }

            const i_barb = (barb_mag % BARB_TEX_WRAP) / 5;
            const j_barb = Math.floor(barb_mag / BARB_TEX_WRAP);

            tex_coords[istart_tc + 0 ] =  i_barb      * barb_width_frac; tex_coords[istart_tc + 1 ] =  j_barb      * barb_height_frac;
            tex_coords[istart_tc + 2 ] =  i_barb      * barb_width_frac; tex_coords[istart_tc + 3 ] =  j_barb      * barb_height_frac;
            tex_coords[istart_tc + 4 ] = (i_barb + 1) * barb_width_frac; tex_coords[istart_tc + 5 ] =  j_barb      * barb_height_frac;
            tex_coords[istart_tc + 6 ] =  i_barb      * barb_width_frac; tex_coords[istart_tc + 7 ] = (j_barb + 1) * barb_height_frac;
            tex_coords[istart_tc + 8 ] = (i_barb + 1) * barb_width_frac; tex_coords[istart_tc + 9 ] = (j_barb + 1) * barb_height_frac;
            tex_coords[istart_tc + 10] = (i_barb + 1) * barb_width_frac; tex_coords[istart_tc + 11] = (j_barb + 1) * barb_height_frac;

            istart_pts += (n_pts_per_poly * n_coords_per_pt_pts);
            istart_tc += (n_pts_per_poly * n_coords_per_pt_tc);
        });
    });

    return {'pts': pts, 'offset': offset, 'tex_coords': tex_coords};
}

function makeDomainVerticesAndTexCoords(field_lats: Float32Array, field_lons: Float32Array, tex_width: number, tex_height: number) {
    const ni = field_lons.length;
    const lbi = 0, ubi = ni - 1;

    const corners = [...field_lats].map(lat => {
        return [{'lng': field_lons[lbi], 'lat': lat},
                {'lng': field_lons[ubi], 'lat': lat}]
    }).flat().map(pt => new LngLat(pt.lng, pt.lat).toMercatorCoord());
    const verts = corners.map(cd => [cd.x, cd.y]).flat();

    const tex_coords = [...field_lats].map((lat, ilat) => {
        return [{'s': ilat / (tex_height), 'r': 0}, 
                {'s': ilat / (tex_height), 'r': ni / (tex_width + 1)}];
    }).flat().map(tc => [tc['r'], tc['s']]).flat();

    return {'vertices': new Float32Array(verts), 'tex_coords': new Float32Array(tex_coords)}
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

function makePolylines(lines: LineSpec[]) : PolylineSpec {
    const n_points_per_vert = Object.fromEntries(Object.entries(lines[0]).map(([k, v]) => {
        let n_verts: number;
        if (v.length === undefined) {
            n_verts = 1;
        }
        else if (v[0].length === undefined) {
            n_verts = v.length;
        }
        else {
            n_verts = v[0].length;
        }
        return [k, n_verts];
    }));
    n_points_per_vert['extrusion'] = 2;

    const n_verts = lines.map(l => l['verts'].length).reduce((a, b) => a + b);
    const n_out_verts = (n_verts - lines.length) * 6;
    const ary_lens = Object.fromEntries(Object.entries(n_points_per_vert).map(([k, nppv]) => [k, n_out_verts * nppv]));

    let ret: PolylineSpec = {
        'verts': new Float32Array(ary_lens['verts']),
        'origin': new Float32Array(ary_lens['origin']),
        'extrusion': new Float32Array(ary_lens['extrusion']),
        'zoom': new Float32Array(ary_lens['zoom']),
        'texcoords': new Float32Array(ary_lens['texcoords']),
    }

    let ilns = Object.fromEntries(Object.keys(ary_lens).map(k => [k, 0]));

    const compute_normal_vec = (pt1: [number, number], pt2: [number, number]) => {
        const line_vec_x = pt2[0] - pt1[0];
        const line_vec_y = pt2[1] - pt1[1];
        const line_vec_mag = Math.hypot(line_vec_x, line_vec_y);

        return [line_vec_y / line_vec_mag, -line_vec_x / line_vec_mag];
    }

    lines.forEach(line => {
        const verts = line['verts'];
        const texcoords = line['texcoords'];

        let ary_ivt = ilns['verts'];
        let pt_prev: [number, number], pt_this = verts[0], pt_next = verts[1];
        let tc_prev: [number, number], tc_this = texcoords[0], tc_next = texcoords[1];
        let [ext_x, ext_y] = compute_normal_vec(pt_this, pt_next);

        ret['verts'][ary_ivt + 0] = pt_this[0]; ret['verts'][ary_ivt + 1] = pt_this[1];
        ret['texcoords'][ary_ivt + 0] = tc_this[0]; ret['texcoords'][ary_ivt + 1] = tc_this[1];
        ret['extrusion'][ary_ivt + 0] = ext_x; ret['extrusion'][ary_ivt + 1] = ext_y;

        for (let ivt = 1; ivt < verts.length; ivt++) {
            pt_this = verts[ivt]; pt_prev = verts[ivt - 1];
            tc_this = texcoords[ivt]; tc_prev = texcoords[ivt - 1];
            [ext_x, ext_y] = compute_normal_vec(pt_prev, pt_this);

            ary_ivt = ilns['verts'] + (1 + (ivt - 1) * 4) * n_points_per_vert['verts'];

            ret['verts'][ary_ivt + 0] = pt_prev[0]; ret['verts'][ary_ivt + 1] = pt_prev[1];
            ret['verts'][ary_ivt + 2] = pt_prev[0]; ret['verts'][ary_ivt + 3] = pt_prev[1];

            ret['verts'][ary_ivt + 4] = pt_this[0]; ret['verts'][ary_ivt + 5] = pt_this[1];
            ret['verts'][ary_ivt + 6] = pt_this[0]; ret['verts'][ary_ivt + 7] = pt_this[1];

            ret['texcoords'][ary_ivt + 0] = tc_prev[0]; ret['texcoords'][ary_ivt + 1] = tc_prev[1];
            ret['texcoords'][ary_ivt + 2] = tc_prev[0]; ret['texcoords'][ary_ivt + 3] = tc_prev[1];

            ret['texcoords'][ary_ivt + 4] = tc_this[0]; ret['texcoords'][ary_ivt + 5] = tc_this[1];
            ret['texcoords'][ary_ivt + 6] = tc_this[0]; ret['texcoords'][ary_ivt + 7] = tc_this[1];

            ret['extrusion'][ary_ivt + 0 ] =  ext_x; ret['extrusion'][ary_ivt + 1 ] =  ext_y;
            ret['extrusion'][ary_ivt + 2 ] = -ext_x; ret['extrusion'][ary_ivt + 3 ] = -ext_y;

            ret['extrusion'][ary_ivt + 4 ] =  ext_x; ret['extrusion'][ary_ivt + 5 ] =  ext_y;
            ret['extrusion'][ary_ivt + 6 ] = -ext_x; ret['extrusion'][ary_ivt + 7 ] = -ext_y;
        }

        ret['verts'][ary_ivt + 8] = pt_this[0]; ret['verts'][ary_ivt + 9] = pt_this[1];
        ret['texcoords'][ary_ivt + 8] = tc_this[0]; ret['texcoords'][ary_ivt + 9] = tc_this[1];
        ret['extrusion'][ary_ivt + 8] = -ext_x; ret['extrusion'][ary_ivt + 9] = -ext_y;

        for (let ivt = 0; ivt < (verts.length - 1) * 6 * n_points_per_vert['origin']; ivt += n_points_per_vert['origin']) {
            line['origin'].forEach((cd, icd) => {
                ret['origin'][ilns['origin'] + ivt + icd] = cd;
            })
        }
        
        for (let ivt = 0; ivt < (verts.length - 1) * 6 * n_points_per_vert['zoom']; ivt += n_points_per_vert['zoom']) {
            ret['zoom'][ilns['zoom'] + ivt] = line['zoom'];
        }

        Object.keys(ilns).forEach(k => {
            ilns[k] += (verts.length - 1) * 6 * n_points_per_vert[k];
        })
    })

    return ret;
}

const ep_interface = {
    'makeBarbElements': makeBarbElements, 
    'makeDomainVerticesAndTexCoords': makeDomainVerticesAndTexCoords,
    'makePolyLines': makePolylines
}

type AutumnFieldLayerWorker = typeof ep_interface;

Comlink.expose(ep_interface);

export type {AutumnFieldLayerWorker}