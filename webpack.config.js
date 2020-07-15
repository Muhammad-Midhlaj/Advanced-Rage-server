const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    resolve: { 
        extensions: ['.js',] 
    },
    entry: {
        'client_packages': './client_packages',
    },
    output: {
        path: path.resolve(__dirname),
        filename: '[name]/index.js'
    },
    target: 'node', // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    plugins: [
        new CopyWebpackPlugin([
            { from: './client_packages/gamemode/browser/js', to: 'client_packages/RP/Browsers' },
            { from: './client_packages/gamemode/scripts', to: 'client_packages/_rage-console' }
        ])
    ]
};