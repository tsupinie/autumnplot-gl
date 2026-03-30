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

function applySamplerCodeScalar(src: string, sampler_names: string[], sampler_expression: string, dtypes: TypedArrayStr[]) {
    // TAS: find a better place for this to live.
    const sampler_dtypes = dtypes.map(dt => dt.includes('uint') ? 'highp usampler2D' : 'sampler2D');
    const shader_dtypes = dtypes.map(dt => dt.includes('uint') ? 'uint' : 'highp float');

    const samplers = sampler_names.map((v, i) => `uniform ${sampler_dtypes[i]} ${v};`).join("\n");
    const sampler_get = sampler_names.map((v, i) => `    ${shader_dtypes[i]} ${v}_val = texture(${v}, tex_coord).r;`).join("\n");

    sampler_names.forEach(v => sampler_expression = sampler_expression.replaceAll(v, `${v}_val`));

    // TAS: This assumes that the return type of the expression is the same as the type of the inputs. May need to revisit this later.
    const sampler_code = `
${samplers}

${shader_dtypes[0]} get_field_value(lowp vec2 tex_coord) {
${sampler_get}
    return ${sampler_expression};
}`;

    return mergeShaderCode(sampler_code, src);
}

function applySamplerCodeVector(src: string, sampler_names: {u: string[], v: string[]}, sampler_expressions: {u: string, v: string}) {
    const samplers = sampler_names.u.map(v => `uniform sampler2D ${v};`).join("\n") + "\n" +
                     sampler_names.v.map(v => `uniform sampler2D ${v};`).join("\n");
    const sampler_u_get = sampler_names.u.map(v => `    highp float ${v}_val = texture(${v}, tex_coord).r;`).join("\n");
    const sampler_v_get = sampler_names.v.map(v => `    highp float ${v}_val = texture(${v}, tex_coord).r;`).join("\n");

    let sampler_expression_u = sampler_expressions.u;
    sampler_names.u.forEach(v => sampler_expression_u = sampler_expression_u.replaceAll(v, `${v}_val`));
    let sampler_expression_v = sampler_expressions.v;
    sampler_names.v.forEach(v => sampler_expression_v = sampler_expression_v.replaceAll(v, `${v}_val`));

    const sampler_code = `
${samplers}

highp float get_field_value_u(lowp vec2 tex_coord) {
${sampler_u_get}
    return ${sampler_expression_u};
}

highp float get_field_value_v(lowp vec2 tex_coord) {
${sampler_v_get}
    return ${sampler_expression_v};
}`;

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
