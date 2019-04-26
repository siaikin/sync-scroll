const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: './src/demo.js',
    mode: "development",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "demo.js"
    },
    devServer: {
        contentBase: './dist'
    },
    // devtool: "eval-source-map",
    module:  {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: "> 0.25%, not dead",
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }
                            ]
                        ],
                        plugins: [
                            require('@babel/plugin-proposal-class-properties'),
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                exclude: /(node_modules|bower_components)/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: "./index.html"
        }),
        new ExtractTextPlugin('styles.css')
    ]
};
