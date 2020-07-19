'use strict'

const path = require('path')
// const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    hot: true,
    historyApiFallback: {
      disableDotRule: true,
    },
  },
  devtool: 'inline-source-map',
  entry: {
    main: ['react-hot-loader/patch', './src/main.hot.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: path.resolve(__dirname, 'tsconfig.json'),
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      react: require.resolve('react'),
      'react-dom': require.resolve('@hot-loader/react-dom'),
      'styled-components': require.resolve('styled-components'),
    },
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({template: path.join(__dirname, './src/template.html')}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
}
