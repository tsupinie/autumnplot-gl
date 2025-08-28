
const fs = require('fs');

module.exports = function (context, options) {
    return {
        name: 'my-loaders',
        configureWebpack(config, isServer) {
            return {
                mergeStrategy: {
                    'module.rules': 'prepend',
                    'resolve.extensions': 'replace',
                    'plugins': 'replace',
                },
                // This ChunkAssetPlugin was injecting __webpack_require__ code into the autumnplot-gl webworker during production builds, which broke the 
                //  webworker. So my fix is to take the plugin out of production builds. Is this brittle? Very probably!
                plugins: config.plugins.filter(plugin => process.env.NODE_ENV != 'production' || plugin.constructor.name != 'ChunkAssetPlugin'),
                resolve: {
                    extensions: config.resolve.extensions.filter(e => e != '.wasm'),
                },
                module: {
                    rules: [
                        {
                            test: /cpp\/marchingsquares\.wasm$/,
                            type: "asset/resource",
                            generator: {
                                filename: "[name].wasm"
                            }
                        },
                    ],
                },
            };
        },
    };
};