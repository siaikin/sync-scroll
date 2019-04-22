const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/demo.js',
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: './dist'
    },
    devtool: "eval-source-map",
    module:  {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ],
                        plugins: [require('@babel/plugin-proposal-class-properties')]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: "./index.html"
        })
    ]
};
