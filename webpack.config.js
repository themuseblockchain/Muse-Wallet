var webpack = require('webpack');
var path = require("path");

var config = {
    entry: {
        app: ['./main.js']
    },

    output: {
        path: path.resolve(__dirname, "/"),
        filename: 'index.js',
    },

    devServer: {
        historyApiFallback: true,
        inline: true,
        port: 8080
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',

                query: {
                    presets: ['es2015', 'react'],
                    plugins: ['transform-object-assign']
                }
            }
        ],
        exprContextCritical: false
    },

    node: {
        fs: "empty",
        net: 'empty',
        tls: 'empty',
        dns: 'empty'
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                //'NODE_ENV': JSON.stringify('development')
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
}

module.exports = config;