/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict';
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(baseConfig, {
  entry: path.join(__dirname, './src/entries/entry-server.js'),
  target: 'node',
  output: {
    libraryTarget: 'commonjs2',
  },
  externals: nodeExternals({
    whitelist: /\.(css|scss)$/
  }),
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: `client/src/html/index.html`,
      inject  : true,
      chunks  : ['main', 'vendor.js']
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].css',
    }),
    new VueSSRServerPlugin(),
  ],
})
