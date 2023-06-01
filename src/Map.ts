
import mapboxgl from 'mapbox-gl';
import maplibregl from 'maplibre-gl';

type MapType = mapboxgl.Map | maplibregl.Map;

interface LambertConformalConicParameters {
    lon_0: number,
    lat_0: number,
    lat_std: [number, number] | number;
}

function lambertConformalConic(params: LambertConformalConicParameters) {
    // Formulas from https://pubs.usgs.gov/pp/1395/report.pdf

    const compute_t = (lat: number) => {
        const sin_lat = Math.sin(lat);
        return Math.tan(Math.PI / 4 - lat / 2) * Math.pow((1 + eccen * sin_lat) / (1 - eccen * sin_lat), eccen / 2);
    };
    const compute_m = (lat: number) => {
        const sin_lat = Math.sin(lat);
        return Math.cos(lat) / Math.sqrt(1 - eccen * eccen * sin_lat * sin_lat);
    }

    // WGS 84 spheroid
    const semimajor = 6378137.0;
    const semiminor = 6356752.314245;
    const eccen = Math.sqrt(1 - (semiminor * semiminor) / (semimajor * semimajor));
    const radians = Math.PI / 180;

    let {lon_0, lat_0, lat_std} = params;
    lat_std = Array.isArray(lat_std) && lat_std[0] == lat_std[1] ? lat_std[0] : lat_std;

    lon_0 *= radians;
    lat_0 *= radians;

    let F: number, n: number;
    const t_0 = compute_t(lat_0);

    if (Array.isArray(lat_std)) {
        let [lat_1, lat_2] = lat_std;
        lat_1 *= radians;
        lat_2 *= radians;

        const t_1 = compute_t(lat_1);
        const t_2 = compute_t(lat_2);
        const m_1 = compute_m(lat_1);
        const m_2 = compute_m(lat_2);

        n = Math.log(m_1 / m_2) / Math.log(t_1 / t_2);
        F = m_1 / (n * Math.pow(t_1, n));
    }
    else {
        let lat_1 = lat_std;
        lat_1 *= radians;

        const t_1 = compute_t(lat_1);
        const m_1 = compute_m(lat_1);
        n = Math.sin(lat_1);
        F = m_1 / (n * Math.pow(t_1, n));
    }

    const rho_0 = semimajor * F * Math.pow(t_0, n);

    const compute_lcc = (lon: number, lat: number) : [number, number] => {
        lon *= radians;
        lat *= radians;

        const t = compute_t(lat);
        const rho = semimajor * F * Math.pow(t, n);
        const theta = n * (lon - lon_0);
        const x = rho * Math.sin(theta);
        const y = rho_0 - rho * Math.cos(theta);

        return [x, y];
    }

    const eccen2 = eccen * eccen;
    const eccen4 = eccen2 * eccen2;
    const eccen6 = eccen4 * eccen2;
    const eccen8 = eccen6 * eccen2;

/*
    const A = eccen2 / 2 + 5 * eccen4 / 24 + eccen6 / 12 + 13 * eccen8 / 360;
    const B = 7 * eccen4 / 48 + 29 * eccen6 / 240 + 811 * eccen8 / 11520;
    const C = 7 * eccen6 / 120 + 81 * eccen8 / 1120;
    const D = 4279 * eccen8 / 161280;
    const Ap = A - C;
    const Bp = 2 * B - 4 * D;
    const Cp = 4 * C;
    const Dp = 8 * D;
*/

    const Ap = eccen2 / 2 + 5 * eccen4 / 24 + 3 * eccen6 / 120 - 73 * eccen8 / 2016;
    const Bp = 7 * eccen4 / 24 + 29 * eccen6 / 120 + 233 * eccen8 / 6720;
    const Cp = 7 * eccen6 / 30 + 81 * eccen8 / 280;
    const Dp = 4729 * eccen8 / 20160;

    const compute_lcc_inverse = (x: number, y: number) : [number, number] => {
        const theta = Math.atan2(x, rho_0 - y); // These arguments are backwards from what I'd expect ...
        const lon = theta / n + lon_0;
        const rho = Math.hypot(x, rho_0 - y) * Math.sign(n);
        const t = Math.pow(rho / (semimajor * F), 1 / n);

        const chi = Math.PI / 2 - 2 * Math.atan(t);
        const sin_2chi = Math.sin(2 * chi);
        const cos_2chi = Math.cos(2 * chi);

        const lat = chi + sin_2chi * (Ap + cos_2chi * (Bp + cos_2chi * (Cp + Dp * cos_2chi)));

        return [lon / radians, lat / radians];
    }

    return (a: number, b: number, opts?: {inverse: boolean}) : [number, number] => {
        opts = opts === undefined ? {inverse: false} : opts;
        return opts.inverse ? compute_lcc_inverse(a, b) : compute_lcc(a, b);
    }
}

function mercatorXfromLng(lng: number) {
    return (180 + lng) / 360;
}

function mercatorYfromLat(lat: number) {
    return (180 - (180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)))) / 360;
}

/**
 * A `LngLat` object represents a given longitude and latitude coordinate, measured in degrees.
 * These coordinates are based on the [WGS84 (EPSG:4326) standard](https://en.wikipedia.org/wiki/World_Geodetic_System#WGS84).
 *
 * MapLibre GL uses longitude, latitude coordinate order (as opposed to latitude, longitude) to match the
 * [GeoJSON specification](https://tools.ietf.org/html/rfc7946).
 *
 * @param {number} lng Longitude, measured in degrees.
 * @param {number} lat Latitude, measured in degrees.
 * @example
 * var ll = new LngLat(-123.9749, 40.7736);
 * ll.lng; // = -123.9749
 */
 class LngLat {
    lng: number;
    lat: number;

    constructor(lng: number, lat: number) {
        if (isNaN(lng) || isNaN(lat)) {
            throw new Error(`Invalid LngLat object: (${lng}, ${lat})`);
        }
        this.lng = +lng;
        this.lat = +lat;
        if (this.lat > 90 || this.lat < -90) {
            throw new Error('Invalid LngLat latitude value: must be between -90 and 90');
        }
    }

    toMercatorCoord() {
        return {x: mercatorXfromLng(this.lng), y: mercatorYfromLat(this.lat)};
    }
}

export {LngLat, lambertConformalConic};
export type {MapType};