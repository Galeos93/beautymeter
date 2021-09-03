const webpack = require('webpack');
const resolve = require('path').resolve;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

const config = {
    //devtool: 'eval-source-map',
    entry: {
        index: __dirname + '/static/js/index.js',
        app: __dirname + '/static/js/app.js',
        about: __dirname + '/static/js/about.js',
    },
    output: {
        path: resolve('public'),
        filename: "./[name].bundle.js",
        publicPath: resolve('public')
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }]
    },
};
module.exports = config;
