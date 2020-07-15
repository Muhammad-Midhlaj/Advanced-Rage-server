const path = require("path");
const webpack = require('webpack');

let NODE_ENV = 'production'
if (process.env.NODE_ENV) {
    NODE_ENV = process.env.NODE_ENV.replace(/^\s+|\s+$/g, "")
}

var config = {
    entry: `${__dirname}/src/index.js`,

    node: {
        fs: "empty"
    },
     
    output: {
         path: __dirname,
         publicPath: "/",
         filename: '../client_packages/gamemode/browser/js/build.js',
    },

    watch: NODE_ENV == 'production',
     
    devServer: {
         inline: true,
         port: 8080
    },

    resolve: {
        extensions: [".js", ".jsx"]
    },
     
    module: {
         rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015', 'stage-0', 'react']
                    },
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                    use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
                }
         ]
    }
}

module.exports = config;