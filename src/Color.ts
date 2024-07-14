
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
    else {
        throw "You've messed something up in rgb2hsv()";
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
    else {
        throw "H is out of bounds in hsv2rgb";
    }

    return [r_prime + m, g_prime + m, b_prime + m];
}

class Color {
    private rgba: [number, number, number, number];

    /**
     * Create a new color object
     * @param rgba - An RGBA tuple of floats between 0 and 1
     */
    constructor(rgba: [number, number, number, number]) {
        this.rgba = rgba;
    }

    /**
     * The red component of the color as a float value between 0 and 1
     */
    get r() {
        return this.rgba[0];
    }

    /**
     * The green component of the color as a float value between 0 and 1
     */
    get g() {
        return this.rgba[1];
    }

    /**
     * The blue component of the color as a float value between 0 and 1
     */
    get b() {
        return this.rgba[2];
    }

    /**
     * The alpha component (opacity) of the color as a float value between 0 and 1
     */
    get a() {
        return this.rgba[3];
    }

    /**
     * @param opacity - The new alpha component (opacity)
     * @returns A new color with the alpha component set to opacity.
     */
    withOpacity(opacity: number) {
        return new Color([this.r, this.g, this.b, opacity]);
    }

    /**
     * @returns The color as an RGB hex string (e.g., '#dedbef')
     */
    toRGBHex() {
        return this.toRGBAHex().slice(0, -2);
    }

    /**
     * @returns The color as an RGBA hex string (e.g., '#dedbefff')
     */
    toRGBAHex() {
        return rgba2hex(this.rgba);
    }

    /**
     * @returns The color as an RGBA float tuple
     */
    toRGBATuple() {
        return this.rgba;
    }

    /**
     * @returns The color as a tuple of HSV values
     */
    toHSVTuple() {
        return rgb2hsv([this.r, this.g, this.b]);
    }

    /**
     * @param hex - An RGB or RGBA hex string to parse
     * @returns a new Color object
     */
    static fromHex(hex: string) {
        return new Color(hex2rgba(hex));
    }

    /**
     * @param hsv - A tuple of HSV values
     * @returns a new Color object
     */
    static fromHSVTuple(hsv: [number, number, number]) {
        const rgb = hsv2rgb(hsv);
        return new Color([rgb[0], rgb[1], rgb[2], 1]);
    }
}

export {Color};