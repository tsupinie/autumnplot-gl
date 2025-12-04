

// Stub in required method and property types for the mapping library. God help me if these start to diverge between Mapbox and MapLibre.
type StyleSpecification = {
    glyphs?: string;
}

/** Type with the required methods for mapping libraries */
type MapLikeType = {
    triggerRepaint: () => void;
    getCanvas: () => HTMLCanvasElement;
    getStyle: () => StyleSpecification;

    getZoom: () => number;
    getMaxZoom: () => number;
    getBearing: () => number;
    getPitch: () => number;
};

interface LambertConformalConicParameters {
    lon_0: number,
    lat_0: number,
    lat_std: [number, number] | number;
    a: number;
    b: number;
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
    const semimajor = params.a;
    const semiminor = params.b;
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

interface RotateSphereParams {
    np_lon: number,
    np_lat: number,
    lon_shift: number,
}

function rotateSphere(params: RotateSphereParams) {
    const radians = Math.PI / 180;
    const np_lat = params.np_lat * radians;
    const np_lon = params.np_lon * radians;
    const lon_shift = params.lon_shift * radians;

    const sin_np_lat = Math.sin(np_lat);
    const cos_np_lat = Math.cos(np_lat);

    const compute_rotation = (lon: number, lat: number) : [number, number] => {
        lon *= radians;
        lat *= radians;

        const sin_lat = Math.sin(lat);
        const cos_lat = Math.cos(lat);
        const sin_lon_diff = Math.sin(lon - lon_shift);
        const cos_lon_diff = Math.cos(lon - lon_shift);

        const lat_p = Math.asin(sin_np_lat * sin_lat - cos_np_lat * cos_lat * cos_lon_diff);
        let lon_p = np_lon + Math.atan2((cos_lat * sin_lon_diff), (sin_np_lat * cos_lat * cos_lon_diff + cos_np_lat * sin_lat));

        if (lon_p > Math.PI) lon_p -= 2 * Math.PI;

        return [lon_p / radians, lat_p / radians];
    }

    const compute_rotation_inverse = (lon_p: number, lat_p: number) : [number, number] => {
        lon_p *= radians;
        lat_p *= radians;

        const sin_lat_p = Math.sin(lat_p);
        const cos_lat_p = Math.cos(lat_p);
        const sin_lon_p_diff = Math.sin(lon_p - np_lon);
        const cos_lon_p_diff = Math.cos(lon_p - np_lon);

        const lat = Math.asin(sin_np_lat * sin_lat_p + cos_np_lat * cos_lat_p * cos_lon_p_diff);
        let lon = lon_shift + Math.atan2((cos_lat_p * sin_lon_p_diff), (sin_np_lat * cos_lat_p * cos_lon_p_diff - cos_np_lat * sin_lat_p));

        if (lon_p > Math.PI) lon_p -= 2 * Math.PI;

        return [lon / radians, lat / radians];
    }

    return (a: number, b: number, opts?: {inverse: boolean}) => {
        opts = opts === undefined ? {inverse: false} : opts;
        return opts.inverse ? compute_rotation_inverse(a, b) : compute_rotation(a, b);
    }
}

interface VerticalPerspectiveParams {
    lat_0: number,
    lon_0: number,
    alt: number,
    a: number,
    b: number,
}

function verticalPerspective(params: VerticalPerspectiveParams) {
    // WGS 84 spheroid
    const semimajor = params.a;
    const semiminor = params.b;
    const eccen = Math.sqrt(1 - (semiminor * semiminor) / (semimajor * semimajor));
    const radians = Math.PI / 180;

    let {lat_0, lon_0, alt} = params;
    const alt_0 = 0;
    const alt_00 = 0;
    const eccen2 = eccen * eccen;

    lat_0 *= radians;
    lon_0 *= radians;

    const sin_lat_0 = Math.sin(lat_0);
    const cos_lat_0 = Math.cos(lat_0);

    const N1 = semimajor / Math.sqrt(1 - (eccen * sin_lat_0) ** 2);
    let lat_g = lat_0, P = 0;

    for (let i = 0; i < 2; i++) {
        P = Math.cos(lat_0) / Math.cos(lat_g) * (alt + N1 + alt_00) / semimajor;
        lat_g = lat_0 - Math.asin(N1 * eccen * eccen * sin_lat_0 * cos_lat_0 / (P * semimajor));
    }

    const compute_perspective = (lon: number, lat: number) : [number, number] => {
        lon *= radians;
        lat *= radians;

        const sin_lat = Math.sin(lat);
        const cos_lat = Math.cos(lat);

        const N = semimajor / Math.sqrt(1 - (eccen * sin_lat) ** 2);
        const C = (N + alt_0) / semimajor * cos_lat;
        const S = ((N * (1 - eccen * eccen) + alt_0) / semimajor) * sin_lat;
        const K = alt / (P * Math.cos(lat_0 - lat_g) - S * sin_lat_0 - C * cos_lat_0 * Math.cos(lon - lon_0));
        const x = K * C * Math.sin(lon - lon_0);
        const y = K * (P * Math.sin(lat_0 - lat_g) + S * cos_lat_0 - C * sin_lat_0 * Math.cos(lon - lon_0));

        return [x, y];
    }

    const B = P * Math.cos(lat_0 - lat_g);
    const D = P * Math.sin(lat_0 - lat_g);
    const L = 1 - eccen2 * cos_lat_0 * cos_lat_0;
    const G = 1 - eccen2 * sin_lat_0 * sin_lat_0;
    const J = 2 * eccen2 * sin_lat_0 * cos_lat_0;
    const E = 1; // If alt_0 = 0, set E = 1
    const t = P * P * (1 - (eccen * Math.cos(lat_g)) ** 2) - E * (1 - eccen2);

    const compute_perspective_inverse = (x: number, y: number) : [number, number] => {
        const u = -2 * B * L * alt - 2 * D * G * y + B * J * y + D * J * alt;
        const v = L * alt * alt + G * y * y - alt * J * y + (1 - eccen2) * x * x;
        const K_prime = (-u + Math.sqrt(u * u - 4 * t * v)) / (2 * t);
        const X = semimajor * ((B - alt / K_prime) * cos_lat_0 - (y / K_prime - D) * sin_lat_0);
        const Y = semimajor * x / K_prime;
        const S = (y / K_prime - D) * cos_lat_0 + (B - alt / K_prime) * sin_lat_0;
        const lon = lon_0 + Math.atan2(Y, X);
        const lat = Math.atan2(S, Math.sqrt((1 - eccen2) * (1 - eccen2 - S * S)));

        return [lon / radians, lat / radians];
    }

    return (a: number, b: number, opts?: {inverse: boolean}) => {
        opts = opts === undefined ? {inverse: false} : opts;
        return opts.inverse ? compute_perspective_inverse(a, b) : compute_perspective(a, b);
    }
}

function mercatorXfromLng(lng: number) {
    return (180 + lng) / 360;
}

function lngFromMercatorX(x: number) {
    return 360 * x - 180;
}

function mercatorYfromLat(lat: number) {
    const sin_lat = Math.sin(lat * Math.PI / 180);
    const y = (180 - (90 / Math.PI * Math.log((1 + sin_lat) / (1 - sin_lat)))) / 360;
    return Math.min(1.5, Math.max(-0.5, y));
}

function latFromMercatorY(y: number) {
    return Math.atan(Math.sinh((180 - y * 360) * Math.PI / 180)) * 180 / Math.PI;
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
    public lng: number;
    public lat: number;

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

    public toMercatorCoord() {
        return {x: mercatorXfromLng(this.lng), y: mercatorYfromLat(this.lat)};
    }

    public static fromMercatorCoord(x: number, y: number) {
        return new LngLat(lngFromMercatorX(x), latFromMercatorY(y));
    }
}

export {LngLat, lambertConformalConic, rotateSphere, verticalPerspective};
export type {MapLikeType};