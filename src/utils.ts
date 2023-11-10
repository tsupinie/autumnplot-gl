
const hex2rgba = (hexstr: string, out_type?: string) : [number, number, number, number] => {
    out_type = out_type === undefined ? 'float' : out_type;

    const match = hexstr.match(/#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?/i);
    if (match === null) {
        throw `Got '${hexstr}' in hex2rgba, which does not look like a hex color`;
    }

    let rgba = match.slice(1).filter(c => c !== undefined).map(c => parseInt(c, 16));

    if (out_type == 'float') {
        rgba = rgba.map(c => c / 255);
    }

    return rgba[3] === undefined ? [rgba[0], rgba[1], rgba[2], 1] : [rgba[0], rgba[1], rgba[2], rgba[3]];
}

const rgba2hex = (rgba: [number, number, number, number], in_type?: string) : string => {
    in_type = in_type === undefined ? 'float' : in_type;

    let rgba_ = rgba as number[];
    if (in_type == 'float') {
        rgba_ = rgba_.map(c => Math.round(c * 255));
    }

    return '#' + rgba_.map(c => c.toString(16).padStart(2, '0').toUpperCase()).join('');
}

const hex2rgb = (hexstr: string, out_type?: string) : [number, number, number] => {
    const[r, g, b, a] = hex2rgba(hexstr, out_type);
    return [r, g, b];
}

const rgb2hex = (rgb: [number, number, number], in_type?: string) : string => {
    const [r, g, b] = rgb;
    return rgba2hex([r, g, b, 0], in_type).slice(0, -2);
}

const rgb2hsv = (rgb: [number, number, number]) : [number, number, number] => {
    const [r, g, b] = rgb;

    const Cmax = Math.max(r, g, b);
    const Cmin = Math.min(r, g, b);
    const Delta = Cmax - Cmin;
    
    let H: number;
    if (Delta == 0) {
        H = 0;
    }
    else if (Cmax == r) {
        H = 60 * ((g - b) / Delta) % 6;
    }
    else if (Cmax == g) {
        H = 60 * ((b - r) / Delta + 2);
    }
    else if (Cmax == b) {
        H = 60 * ((r - g) / Delta + 4);
    }

    let S = Cmax == 0 ? 0 : Delta / Cmax;
    let V = Cmax;

    return [H, S, V];
}

const hsv2rgb = (hsv: [number, number, number]) : [number, number, number] => {
    const [H, S, V] = hsv;

    const C = V * S;
    const X = C * (1 - Math.abs(H / 60 % 2 - 1));
    const m = V - C;

    let r_prime, g_prime, b_prime;
    if (0 <= H && H < 60) {
        r_prime = C; g_prime = X, b_prime = 0;
    }
    else if (60 <= H && H < 120) {
        r_prime = X; g_prime = C, b_prime = 0;
    }
    else if (120 <= H && H < 180) {
        r_prime = 0; g_prime = C, b_prime = X;
    }
    else if (180 <= H && H < 240) {
        r_prime = 0; g_prime = X, b_prime = C;
    }
    else if (240 <= H && H < 300) {
        r_prime = X; g_prime = 0, b_prime = C;
    }
    else if (300 <= H && H < 360) {
        r_prime = C; g_prime = 0, b_prime = X;
    }

    return [r_prime + m, g_prime + m, b_prime + m];
}

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
    private cached_value: R | null;
    private readonly compute_value: (...args: A) => R;

    constructor(compute_value: (...args: A) => R) {
        this.cached_value = null;
        this.compute_value = compute_value;
    }

    public getValue(...args: A) {
        if (this.cached_value === null) {
            this.cached_value = this.compute_value(...args);
        }

        return this.cached_value;
    }
}

export {hex2rgba, rgba2hex, hex2rgb, rgb2hex, rgb2hsv, hsv2rgb, zip, getMinZoom, getOS, Cache};
