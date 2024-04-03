const path = require('path');

module.exports = function override(config, env) {
    // Add the resolve fallback configuration
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
        stream: require.resolve('readable-stream'),
        util: require.resolve('util/'),
        crypto: require.resolve('crypto-browserify'),
        querystring: require.resolve('querystring-es3'),
        http: require.resolve('stream-http'),
        net: require.resolve('net'),
        tls: require.resolve('tls'),
        https: require.resolve('https-browserify'),
        path: require.resolve('path-browserify'),
        zlib: require.resolve('browserify-zlib'),
        os: require.resolve('os-browserify/browser'),
        fs: false,

    };

    return config;
};