
import { TypedArray, WebGLAnyRenderingContext} from './AutumnTypes';
import { MapType } from './Map';
import { PlotComponent, getGLFormatTypeAlignment } from './PlotComponent';
import { RawScalarField } from './RawField';
import { Cache, hex2rgba } from './utils';
import { WGLBuffer, WGLProgram, WGLTexture } from 'autumn-wgl';
import * as d3 from 'd3-contour';

import Module from './cpp/marchingsquares';
import { MarchingSquaresModule } from './cpp/marchingsquares';

let msm: MarchingSquaresModule | null = null;

const contour_vertex_shader_src = require('./glsl/contour_vertex.glsl');
const contour_fragment_shader_src = require('./glsl/contour_fragment.glsl');
const program_cache = new Cache((gl: WebGLAnyRenderingContext) => new WGLProgram(gl, contour_vertex_shader_src, contour_fragment_shader_src));

interface ContourOptions {
    /** 
     * The color of the contours as a hex color string 
     * @default '#000000'
     */
    color?: string;

    /** 
     * The contour interval for drawing contours at regular intervals
     * @default 1
     */
    interval?: number;

    /**
     * A list of arbitrary levels (up to 40) to contour. This overrides the `interval` option.
     * @default Draw contours at regular intervals given by the `interval` option.
     */
    levels?: number[];

    /** 
     * A function to thin the contours based on zoom level. The function should take a zoom level and return a number `n` that means to only show every 
     * `n`th contour.
     * @default Don't thin the contours on any zoom level
     */
    thinner?: (zoom: number) => number;
}

interface ContourGLElems {
    map: MapType;
    program: WGLProgram;
    vertices: WGLBuffer;
    grid_cell_size: WGLBuffer;
    fill_texture: WGLTexture;
    texcoords: WGLBuffer;
}

function makeContours<ArrayType extends TypedArray>(field: RawScalarField<ArrayType>, opts: Pick<ContourOptions, 'interval' | 'levels'>) {
    const contour = d3.contours()
                      .size([field.grid.ni, field.grid.nj]);

    const data: number[] = new Array(field.data.length);
    let min_data = Infinity, max_data = -Infinity;
    for (let idx = 0; idx < field.data.length; idx++) {
        const elem = field.data[0];

        min_data = Math.min(elem, min_data);
        max_data = Math.max(elem, max_data);
        data[idx] = field.data[idx];
    }

    let contour_levels: number[] = [];
    if (opts.levels !== undefined) {
        contour_levels = opts.levels;
    }
    else if (opts.interval !== undefined) {
        const min_contour = Math.ceil(min_data / opts.interval) * opts.interval;
        const max_contour = Math.floor(max_data / opts.interval) * opts.interval;
        for (let cntr = min_contour; cntr <= max_contour; cntr += opts.interval) {
            contour_levels.push(cntr);
        }
    }
    else {
        throw `Need either 'interval' or 'levels' in Contour()`;
    }

    console.log(contour.contour(data, contour_levels[0]));
}

/** 
 * A field of contoured data. The contours can optionally be thinned based on map zoom level.
 * @example
 * // Create a contoured height field, with black contours every 30 m (assuming the height field is in 
 * // meters) and only using every other contour when the map zoom level is less than 5.
 * const contours = new Contour(height_field, {color: '#000000', interval: 30, 
 *                                                  thinner: zoom => zoom < 5 ? 2 : 1});
 */
class Contour<ArrayType extends TypedArray> extends PlotComponent {
    private readonly field: RawScalarField<ArrayType>;
    public readonly color: [number, number, number];
    public readonly interval: number;
    public readonly levels: number[];
    public readonly thinner: (zoom: number) => number;

    private gl_elems: ContourGLElems | null;

    /**
     * Create a contoured field
     * @param field - The field to contour
     * @param opts  - Options for creating the contours
     */
    constructor(field: RawScalarField<ArrayType>, opts: ContourOptions) {
        super();

        this.field = field;

        this.interval = opts.interval || 1;
        this.levels = opts.levels || [];

        const color = hex2rgba(opts.color || '#000000');
        this.color = [color[0], color[1], color[2]];

        this.thinner = opts.thinner || (() => 1);

        this.gl_elems = null;

        console.time('make contours');
        makeContours(field, opts);
        console.timeEnd('make contours');

        (async () => {
            if (msm === null) {
                msm = await Module();
            }

            console.time('make contours (wasm)');
            const grid = new msm.FloatList();
            grid.resize(field.grid.ni * field.grid.nj, 0);
            field.data.forEach((v, i) => grid.set(i, v));

            [0.1, 0.3, 0.5, 0.7, 0.9].forEach(v => {
                const contours = msm.makeContoursFloat32(grid, field.grid.ni, field.grid.nj, v);
                console.log(contours.size());
            });

            grid.delete();
            console.timeEnd('make contours (wasm)');
        })();
    }

    /**
     * @internal
     * Add the contours to a map
     */
    public async onAdd(map: MapType, gl: WebGLAnyRenderingContext) {
        // Basic procedure for these contours from https://www.shadertoy.com/view/lltBWM
        gl.getExtension("OES_standard_derivatives");
        
        const program = program_cache.getValue(gl);

        const {vertices: verts_buf, texcoords: tex_coords_buf, cellsize: cellsize_buf} = await this.field.grid.getWGLBuffers(gl);
        const vertices = verts_buf;
        const texcoords = tex_coords_buf;
        const grid_cell_size = cellsize_buf;

        const {format, type, row_alignment} = getGLFormatTypeAlignment(gl, this.field.isFloat16());

        const fill_image = {'format': format, 'type': type, 
            'width': this.field.grid.ni, 'height': this.field.grid.nj, 'image': this.field.getTextureData(),
            'mag_filter': gl.LINEAR, 'row_alignment': row_alignment,
        };

        const fill_texture = new WGLTexture(gl, fill_image);
        this.gl_elems = {
            map: map, program: program, vertices: vertices, texcoords: texcoords, grid_cell_size: grid_cell_size, fill_texture: fill_texture
        };
    }

    /**
     * @internal
     * Render the contours
     */
    public render(gl: WebGLAnyRenderingContext, matrix: number[]) {
        if (this.gl_elems === null) return;
        const gl_elems = this.gl_elems;

        const zoom = gl_elems.map.getZoom();
        const intv = this.thinner(zoom) * this.interval;
        const cutoff = 0.3 / intv;
        const step_size = [1 / this.field.grid.ni, 1 / this.field.grid.nj];
        const zoom_fac = Math.pow(2, zoom);

        let uniforms = {'u_contour_interval': intv, 'u_line_cutoff': cutoff, 'u_color': this.color, 'u_step_size': step_size, 'u_zoom_fac': zoom_fac,
                        'u_matrix': matrix, 'u_num_contours': 0, 'u_contour_levels': [0]};

        if (this.levels.length > 0) {
            uniforms = {...uniforms, 'u_num_contours': this.levels.length, 'u_contour_levels': this.levels}
        }

        gl_elems.program.use(
            {'a_pos': gl_elems.vertices, 'a_grid_cell_size': gl_elems.grid_cell_size, 'a_tex_coord': gl_elems.texcoords},
            uniforms,
            {'u_fill_sampler': gl_elems.fill_texture}
        );

        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        gl_elems.program.draw();
    }
}

export default Contour;
export type {ContourOptions};