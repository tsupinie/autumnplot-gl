import { isWebGL2Ctx, WebGLAnyRenderingContext } from "./AutumnTypes";
import { Color } from "./Color";
import { LngLat } from "./Map";
import { Cache, normalizeOptions } from "./utils";

import { WGLBuffer, WGLProgram, WGLTexture } from "autumn-wgl";

import Protobuf from 'pbf';
import potpack, {PotpackBox} from "potpack";

const text_vertex_shader_src = require('./glsl/text_vertex.glsl');
const text_fragment_shader_src = require('./glsl/text_fragment.glsl');

const PADDING = 3

interface PBFGlyph {
    id: number;
    data: Uint8Array;
    width: number;
    height: number;
    left: number;
    top: number;
    advance: number;
}

interface Glyph {
    id: number;
    width: number;
    height: number;
    left: number;
    top: number;
    atlas_i: number;
    atlas_j: number;
    advance: number;
}

function parseFontPBF(data: Uint8Array) {
    const readGlyph = (tag: number, glyph: any, pbf?: Protobuf) => {
        if (pbf === undefined)
            return;

        switch (tag) {
            case 1:
                glyph.id = pbf.readVarint();
                break;
            case 2:
                glyph.data = pbf.readBytes();
                break;
            case 3:
                glyph.width = pbf.readVarint() + 2 * PADDING;
                break;
            case 4:
                glyph.height = pbf.readVarint() + 2 * PADDING;
                break;
            case 5:
                glyph.left = pbf.readSVarint();
                break;
            case 6:
                glyph.top = pbf.readSVarint();
                break;
            case 7:
                glyph.advance = pbf.readVarint();
                break;
        }
    }

    const readFontStack = (tag: number, glyphs?: PBFGlyph[], pbf?: Protobuf) => {
        if (glyphs === undefined || pbf === undefined)
            return;
        
        if (tag == 3) {
            const glyph = pbf.readMessage(readGlyph, {} as PBFGlyph);
            glyphs.push(glyph);
        }
    }

    const readFontStacks = (tag: number, glyphs?: PBFGlyph[], pbf?: Protobuf) => {
        if (pbf === undefined) 
            return;

        if (tag == 1) {
            pbf.readMessage(readFontStack, glyphs);
        }
    }

    return new Protobuf(data).readFields(readFontStacks, []);
}

interface FontAtlas {
    atlas: Uint8Array;
    atlas_width: number;
    atlas_height: number;
    baseline: number;
    top: number;
    glyph_info: Record<number, Glyph>;
}

function createAtlas(pbf_glyphs: PBFGlyph[]): FontAtlas {
    const pbf_glyphs_filtered = pbf_glyphs.filter(glyph => glyph.data !== undefined);

    const glyph_bins: {glyph: PBFGlyph, bin: PotpackBox}[] = [];

    const bins = pbf_glyphs_filtered.map(glyph => {
        const bin = {x: 0, y: 0, w: glyph.width, h: glyph.height} as PotpackBox;
        glyph_bins.push({glyph: glyph, bin: bin});

        return bin;
    });

    const {w: img_width, h: img_height} = potpack(bins);

    const atlas_data = new Uint8Array(img_width * img_height);
    const glyphs: Record<number, Glyph> = {}
    let max_glyph_height = 0;

    glyph_bins.forEach(glyph_bin => {
        const {bin, glyph} = glyph_bin;

        if (bin.x === undefined || bin.y === undefined)
            throw `Potpack couldn't pack this pot, I guess?`;

        glyphs[glyph.id] = {
            id: glyph.id, width: glyph.width, height: glyph.height, left: glyph.left, top: glyph.top,
            atlas_i: bin.x, atlas_j: bin.y, advance: glyph.advance
        };

        max_glyph_height = Math.max(max_glyph_height, glyph.height);

        for (let i = 0; i < glyph.width; i++) {
            for (let j = 0; j < glyph.height; j++) {
                const glyph_idx = i + glyph.width * j;
                const atlas_idx = (i + bin.x) + img_width * (j + bin.y);
                atlas_data[atlas_idx] = glyph.data[glyph_idx];
            }
        }
    });

    const glyph_M = glyphs['M'.charCodeAt(0)];
    const baseline = glyph_M === undefined ? max_glyph_height : glyph_M.height - glyph_M.top;
    const top = glyph_M === undefined ? 0 : -glyph_M.top;

    return {atlas: atlas_data, atlas_width: img_width, atlas_height: img_height, baseline: baseline, top: top, glyph_info: glyphs};
}

async function getFontAtlas(urls: string[]) {
    const promises = urls.map(async url => {
        const resp = await fetch(url);
        const blob = await resp.blob();
        const data_buffer = await blob.arrayBuffer();
    
        // Parse the PBF and get the glyph data
        return parseFontPBF(new Uint8Array(data_buffer));
    });

    const glyphs = (await Promise.all(promises)).flat();

    // Create an atlas for the glyphs
    return createAtlas(glyphs);
}

interface TextSpec {
    lat: number;
    lon: number;
    text: string;
    min_zoom?: number;
}

type HorizontalAlign = 'left' | 'center' | 'right';
type VerticalAlign = 'baseline' | 'middle' | 'top';

interface TextCollectionOptions {
    horizontal_align?: HorizontalAlign;
    vertical_align?: VerticalAlign;
    font_size?: number;
    text_color?: Color;
    halo_color?: Color;
    halo?: boolean;
    offset_x?: number;
    offset_y?: number;
}

const text_collection_opt_defaults: Required<TextCollectionOptions> = {
    horizontal_align: 'left',
    vertical_align: 'baseline',
    font_size: 12,
    text_color: new Color([0, 0, 0, 1]),
    halo_color: new Color([0, 0, 0, 1]),
    halo: false,
    offset_x: 0,
    offset_y: 0
}

class TextCollection {
    readonly program: WGLProgram;
    readonly anchors: WGLBuffer;
    readonly offsets: WGLBuffer;
    readonly texcoords: WGLBuffer;
    readonly texture: WGLTexture;

    readonly opts: Required<TextCollectionOptions>;

    private constructor(gl: WebGLAnyRenderingContext, text_locs: TextSpec[], font_atlas: FontAtlas, opts?: TextCollectionOptions) {
        this.program = new WGLProgram(gl, text_vertex_shader_src, text_fragment_shader_src);

        this.opts = normalizeOptions(opts, text_collection_opt_defaults);
        
        const is_webgl2 = isWebGL2Ctx(gl);
        const format = is_webgl2 ? gl.R8 : gl.LUMINANCE;
        const type = gl.UNSIGNED_BYTE;
        const row_alignment = 1;

        const empty_atlas = font_atlas.atlas_width == 0 || font_atlas.atlas_height == 0 || font_atlas.atlas.length == 0;
        const atlas_width = empty_atlas ? 1 : font_atlas.atlas_width;
        const atlas_height = empty_atlas ? 1 : font_atlas.atlas_height
        const atlas_data = empty_atlas ? new Uint8Array([0, 0, 0, 0]) : font_atlas.atlas;

        const image = {
            'format': format, 'type': type, 'width': atlas_width, 'height': atlas_height, 
            'image': atlas_data, 'row_alignment': row_alignment, 'mag_filter': gl.LINEAR
        };

        this.texture = new WGLTexture(gl, image);

        const n_verts = text_locs.map(tl => tl.text.length).reduce((a, b) => a + b, 0) * 6;

        const anchor_data = new Float32Array(n_verts * 3);
        const offset_data = new Float32Array(n_verts * 2);
        const tc_data = new Float32Array(n_verts * 2);

        let i_anch = 0, i_off = 0, i_tc = 0;

        text_locs.forEach(loc => {
            const {lat, lon, text} = loc;
            const min_zoom = loc.min_zoom === undefined ? 0 : loc.min_zoom;
            const {x: anchor_x, y: anchor_y} = new LngLat(lon, lat).toMercatorCoord();
            
            let x_offset = this.opts.offset_x;
            let y_offset = this.opts.offset_y;
            const init_i_off = i_off;

            for (let i = 0; i < text.length; i++) {
                const glyph_code = text.charCodeAt(i);
                const glyph_info = font_atlas.glyph_info[glyph_code];

                if (glyph_info === undefined) {
                    x_offset += 7;
                    continue;
                }

                x_offset += glyph_info.left;

                anchor_data[i_anch++] = anchor_x; anchor_data[i_anch++] = anchor_y; anchor_data[i_anch++] = min_zoom;
                anchor_data[i_anch++] = anchor_x; anchor_data[i_anch++] = anchor_y; anchor_data[i_anch++] = min_zoom;
                anchor_data[i_anch++] = anchor_x; anchor_data[i_anch++] = anchor_y; anchor_data[i_anch++] = min_zoom;
                anchor_data[i_anch++] = anchor_x; anchor_data[i_anch++] = anchor_y; anchor_data[i_anch++] = min_zoom;
                anchor_data[i_anch++] = anchor_x; anchor_data[i_anch++] = anchor_y; anchor_data[i_anch++] = min_zoom;
                anchor_data[i_anch++] = anchor_x; anchor_data[i_anch++] = anchor_y; anchor_data[i_anch++] = min_zoom;
                
                offset_data[i_off++] = x_offset;                    offset_data[i_off++] = y_offset + font_atlas.baseline + glyph_info.top - glyph_info.height;
                offset_data[i_off++] = x_offset;                    offset_data[i_off++] = y_offset + font_atlas.baseline + glyph_info.top - glyph_info.height;
                offset_data[i_off++] = x_offset + glyph_info.width; offset_data[i_off++] = y_offset + font_atlas.baseline + glyph_info.top - glyph_info.height;
                offset_data[i_off++] = x_offset;                    offset_data[i_off++] = y_offset + font_atlas.baseline + glyph_info.top;
                offset_data[i_off++] = x_offset + glyph_info.width; offset_data[i_off++] = y_offset + font_atlas.baseline + glyph_info.top;
                offset_data[i_off++] = x_offset + glyph_info.width; offset_data[i_off++] = y_offset + font_atlas.baseline + glyph_info.top;
                
                tc_data[i_tc++] = glyph_info.atlas_i / font_atlas.atlas_width;                      tc_data[i_tc++] = (glyph_info.atlas_j + glyph_info.height) / font_atlas.atlas_height;
                tc_data[i_tc++] = glyph_info.atlas_i / font_atlas.atlas_width;                      tc_data[i_tc++] = (glyph_info.atlas_j + glyph_info.height) / font_atlas.atlas_height;
                tc_data[i_tc++] = (glyph_info.atlas_i + glyph_info.width) / font_atlas.atlas_width; tc_data[i_tc++] = (glyph_info.atlas_j + glyph_info.height) / font_atlas.atlas_height;
                tc_data[i_tc++] = glyph_info.atlas_i / font_atlas.atlas_width;                      tc_data[i_tc++] = glyph_info.atlas_j / font_atlas.atlas_height;
                tc_data[i_tc++] = (glyph_info.atlas_i + glyph_info.width) / font_atlas.atlas_width; tc_data[i_tc++] = glyph_info.atlas_j / font_atlas.atlas_height;
                tc_data[i_tc++] = (glyph_info.atlas_i + glyph_info.width) / font_atlas.atlas_width; tc_data[i_tc++] = glyph_info.atlas_j / font_atlas.atlas_height;

                x_offset += glyph_info.advance - glyph_info.left;
            }

            if (this.opts.horizontal_align == 'center') {
                for (let i = init_i_off; i < init_i_off + text.length * 12; i += 2) {
                    offset_data[i] -= (x_offset - this.opts.offset_x) / 2;
                }
            }
            else if (this.opts.horizontal_align == 'right') {
                for (let i = init_i_off; i < init_i_off + text.length * 12; i += 2) {
                    offset_data[i] -= (x_offset - this.opts.offset_x);
                }
            }

            if (this.opts.vertical_align == 'top') {
                for (let i = init_i_off + 1; i < init_i_off + text.length * 12; i += 2) {
                    offset_data[i] -= (font_atlas.baseline - font_atlas.top);
                }
            }
            else if (this.opts.vertical_align == 'middle') {
                for (let i = init_i_off + 1; i < init_i_off + text.length * 12; i += 2) {
                    offset_data[i] -= (font_atlas.baseline - font_atlas.top) / 2;
                }
            }
        });

        this.anchors = new WGLBuffer(gl, anchor_data, 3, gl.TRIANGLE_STRIP);
        this.offsets = new WGLBuffer(gl, offset_data, 2, gl.TRIANGLE_STRIP);
        this.texcoords = new WGLBuffer(gl, tc_data, 2, gl.TRIANGLE_STRIP);
    }

    static async make(gl: WebGLAnyRenderingContext, text_locs: TextSpec[], fontstack_url_template: string, opts?: TextCollectionOptions) {
        const FONT_GROUP_SIZE = 256;
        const characters = text_locs.map(tl => [...tl.text]).flat().map(c => c.charCodeAt(0)).filter((c, i, ary) => ary.indexOf(c) == i);
        const char_code_min = Math.min(...characters);
        const char_code_max = Math.max(...characters);

        const stack_start = Math.floor(char_code_min / FONT_GROUP_SIZE) * FONT_GROUP_SIZE;
        const stack_end = Math.floor(char_code_max / FONT_GROUP_SIZE) * FONT_GROUP_SIZE;

        const fontstack_urls = [];
        for (let istack = stack_start; istack <= stack_end; istack += FONT_GROUP_SIZE) {
            fontstack_urls.push(fontstack_url_template.replace('{range}', `${istack}-${istack + FONT_GROUP_SIZE - 1}`));
        }

        const atlas = await getFontAtlas(fontstack_urls);
        if (atlas.atlas_height == 0 || atlas.atlas_width == 0 || atlas.atlas.length == 0) console.warn(`No font data from '${fontstack_url_template}'`);

        return new TextCollection(gl, text_locs, atlas, opts);
    }

    render(gl: WebGLAnyRenderingContext, matrix: number[], [map_width, map_height]: [number, number], map_zoom: number) {
        const uniforms: Record<string, any> = {
            'u_matrix': matrix, 'u_map_width': map_width, 'u_map_height': map_height, 'u_map_zoom': map_zoom, 'u_font_size': this.opts.font_size,
            'u_text_color': this.opts.text_color.toRGBATuple(), 'u_halo_color': this.opts.halo_color.toRGBATuple(), 'u_offset': 0
        }

        uniforms['u_is_halo'] = this.opts.halo ? 1 : 0;

        this.program.use(
            {'a_pos': this.anchors, 'a_offset': this.offsets, 'a_tex_coord': this.texcoords},
            uniforms,
            {'u_sdf_sampler': this.texture}
        );

        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        this.program.draw();

        if (this.opts.halo) {
            this.program.setUniforms({'u_is_halo': 0});
            this.program.draw();
        }

        this.program.setUniforms({'u_offset': -2, 'u_is_halo': this.opts.halo ? 1 : 0});
        this.program.draw();

        if (this.opts.halo) {
            this.program.setUniforms({'u_is_halo': 0});
            this.program.draw();
        }

        this.program.setUniforms({'u_offset': -1, 'u_is_halo': this.opts.halo ? 1 : 0});
        this.program.draw();

        if (this.opts.halo) {
            this.program.setUniforms({'u_is_halo': 0});
            this.program.draw();
        }

        this.program.setUniforms({'u_offset': 1, 'u_is_halo': this.opts.halo ? 1 : 0});
        this.program.draw();

        if (this.opts.halo) {
            this.program.setUniforms({'u_is_halo': 0});
            this.program.draw();
        }
    }
}

export {TextCollection};
export type {TextSpec, TextCollectionOptions, HorizontalAlign, VerticalAlign};