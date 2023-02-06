
import mapboxgl from 'mapbox-gl';
import maplibregl from 'maplibre-gl';

type MapType = mapboxgl.Map | maplibregl.Map;

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

export {LngLat};
export type {MapType};