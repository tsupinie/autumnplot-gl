import { TypedArray } from "./AutumnTypes";

function getMinZoom(jlat: number, ilon: number, thin_fac_base: number) {
    const zoom_base = 1;

    let zoom = zoom_base;
    let thin_fac = thin_fac_base;

    while (((jlat % thin_fac) != 0) || ((ilon % thin_fac) != 0)) {
        zoom += 1;
        thin_fac /= 2;
    }

    return zoom;
}

function* zip(...args: any[]) {
	const iterators = args.map(x => x[Symbol.iterator]());
	while (true) {
		const current = iterators.map(x => x.next());
		if (current.some(x => x.done)) {
			break;
		}
		yield current.map(x => x.value);
	}
}

function getOS() {
    const userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    let os = null;

    if (macosPlatforms.indexOf(platform) !== -1 && navigator.maxTouchPoints <= 1) {
        os = 'Mac OS';
    } 
    else if (iosPlatforms.indexOf(platform) !== -1 || (macosPlatforms.indexOf(platform) !== -1 && navigator.maxTouchPoints > 1)) { 
        os = 'iOS';
    } 
    else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } 
    else if (/Android/.test(userAgent)) {
        os = 'Android';
    } 
    else if (/Linux/.test(platform)) {
        os = 'Linux';
    }

    return os;
}

class Cache<A extends unknown[], R> {
    private cached_values: Record<string, R>;
    private readonly compute_value: (...args: A) => R;
    private readonly make_key: (...args: A) => string;

    constructor(compute_value: (...args: A) => R, make_key?: (...args: A) => string) {
        this.cached_values = {};
        this.compute_value = compute_value;
        this.make_key = make_key === undefined ? (...args: A) => JSON.stringify(args) : make_key;
    }

    public getValue(...args: A) {
        const key = this.make_key(...args);

        if (!(key in this.cached_values)) {
            this.cached_values[key] = this.compute_value(...args);
        }

        return this.cached_values[key];
    }
}


function normalizeOptions<Type extends Record<string, any>>(opts: Type | undefined, defaults: Required<Type>) {
    const ret = {...defaults} as Required<Type>;

    if (opts !== undefined) {
        Object.entries(opts).forEach(([k, v]: [keyof Type, any]) => {
            ret[k] = v;
        });
    }

    return ret;
}

function getArrayConstructor<ArrayType extends TypedArray>(ary: ArrayType) : new(...args: any[]) => ArrayType {
    return ary.constructor as new(...args: any[]) => ArrayType;
}

export {zip, getMinZoom, getOS, Cache, normalizeOptions, getArrayConstructor};
