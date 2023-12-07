const path = require('path');

module.exports = {
    entry: './src/index.ts',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            // GLSL Shaders
            {
                test: [/\.glsl$/],
                loader: 'webpack-glsl-loader',
                exclude: /node_modules/,
            },
            // WASM
            {
                test: /\.wasm$/,
                type: "asset/resource",
                generator: {
                    filename: "[name].wasm"
                }
            },
        ],
    },

    resolve: {
        extensions: ['.ts', '.js'],
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'autumnplot-gl.js',
        clean: true,
        globalObject: 'this',
        library: {
            name: 'apgl',
            type: 'umd',
        }
    },

    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },

        compress: true,
        port: 9000,
    }
};