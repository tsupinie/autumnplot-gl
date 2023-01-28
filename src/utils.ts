
const hex2rgba = (hexstr: string, out_type?: string) : [number, number, number, number?] => {
    out_type = out_type === undefined ? 'float' : out_type;

    const match = hexstr.match(/#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?/i);
    if (match === null) {
        throw `Got '${hexstr}' in hex2rgba, which does not look like a hex color`;
    }

    let rgba = match.slice(1).filter(c => c !== undefined).map(c => parseInt(c, 16));

    if (out_type == 'float') {
        rgba = rgba.map(c => c / 255);
    }

    return rgba[3] === undefined ? [rgba[0], rgba[1], rgba[2]] : [rgba[0], rgba[1], rgba[2], rgba[3]];
}

const rgba2hex = (rgba: [number, number, number, number?], in_type?: string) : string => {
    in_type = in_type === undefined ? 'float' : in_type;

    let rgba_ = rgba as number[];
    if (in_type == 'float') {
        rgba_ = rgba_.filter((c: number | undefined) : c is number => c !== undefined).map(c => Math.round(c * 255));
    }

    return '#' + rgba_.map(c => c.toString(16).padStart(2, '0').toUpperCase()).join('');
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

export {hex2rgba, rgba2hex, zip, getMinZoom};