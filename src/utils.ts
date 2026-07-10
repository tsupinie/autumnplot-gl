import { TypedArray, TypedArrayStr } from "./AutumnTypes";

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

function mergeShaderCode(snippet: string, main: string) {
    const ES3_SHADER_MAGIC = '#version 300 es\n';
    const is_es3_shader = main.startsWith(ES3_SHADER_MAGIC);

    if (is_es3_shader) {
        return ES3_SHADER_MAGIC + snippet + "\n" + main.slice(ES3_SHADER_MAGIC.length);
    }
    
    return snippet + "\n" + main;
}

function getSamplerCode(function_name: string, sampler_names: string[], sampler_expression: string, dtypes: TypedArrayStr[], return_type: TypedArrayStr) {
    // TAS: find a better place for this to live.
    const SAMPLER_DTYPES = {
        'float16': 'sampler2D', 'float32': 'sampler2D', 
        'uint8': 'lowp usampler2D', 'uint16': 'mediump usampler2D', 'uint32': 'highp usampler2D',
        'int16': 'mediump isampler2D', 'int32': 'highp isampler2D',
    };

    const SHADER_DTYPES = {
        'float16': 'highp float', 'float32': 'highp float',
        'uint8': 'uint', 'uint16': 'uint', 'uint32': 'uint',
        'int16': 'int', 'int32': 'int',
    }

    const shader_dtypes = dtypes.map(v => SHADER_DTYPES[v]);
    const return_shader_type = SHADER_DTYPES[return_type];
    const conversion = return_shader_type == 'highp float' ? 'float' : return_shader_type;

    const samplers = sampler_names.map((v, i) => `uniform ${SAMPLER_DTYPES[dtypes[i]]} ${v};`).join("\n");
    const sampler_get = sampler_names.map((v, i) => `    ${shader_dtypes[i]} ${v}_val = texture(${v}, tex_coord).r;`).join("\n");
    const sampler_missing_check = sampler_names.map((v, i) => {
        const nan_check = ['float16', 'float32'].includes(dtypes[i]) ? `isnan(${v}_val) && isnan(u_missing)` : 'false';
        return `(${nan_check} || ${conversion}(${v}_val) == u_missing)`;
    }).join(' || ');

    sampler_names.forEach(v => sampler_expression = sampler_expression.replaceAll(v, `${conversion}(${v}_val)`));

    const sampler_code = `
uniform ${return_shader_type} u_missing;
${samplers}

${return_shader_type} ${function_name}(lowp vec2 tex_coord) {
${sampler_get}
    if (${sampler_missing_check}) {
        return u_missing;
    }

    return ${sampler_expression};
}`;
    return sampler_code;
}

function applySamplerCodeScalar(src: string, sampler_names: string[], sampler_expression: string, dtypes: TypedArrayStr[], return_type: TypedArrayStr) {
    const sampler_code = getSamplerCode('get_field_value', sampler_names, sampler_expression, dtypes, return_type);

    return mergeShaderCode(sampler_code, src);
}

function applySamplerCodeVector(src: string, sampler_names: {u: string[], v: string[]}, sampler_expressions: {u: string, v: string}, 
                                data_types: {u: TypedArrayStr[], v: TypedArrayStr[]}, return_type: {u: TypedArrayStr, v: TypedArrayStr}) {
    const sampler_code_u = getSamplerCode('get_field_value_u', sampler_names.u, sampler_expressions.u, data_types.u, return_type.u);
    const sampler_code_v = getSamplerCode('get_field_value_v', sampler_names.v, sampler_expressions.v, data_types.v, return_type.v);

    // The v sampler code will contain a duplicate u_missing, so we need to remove that
    const sampler_code = sampler_code_u + '\n' + sampler_code_v.split('\n').slice(2).join('\n');

    return mergeShaderCode(sampler_code, src);
}

function argMin<T>(ary: T[] | TypedArray) {
    if (ary.length === 0) {
        return -1;
    }

    let min = ary[0];
    let minIndex = 0;

    for (let i = 1; i < ary.length; i++) {
        if (ary[i] < min) {
            minIndex = i;
            min = ary[i];
        }
    }

    return minIndex;
}

export {zip, getMinZoom, getOS, Cache, normalizeOptions, getArrayConstructor, mergeShaderCode, applySamplerCodeScalar, applySamplerCodeVector, argMin};
