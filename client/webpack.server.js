/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict'
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')

let config = merge(baseConfig, {
  entry: path.join(__dirname, './src/entries/entry-server.js'),
  target: 'node',
  output: {
    libraryTarget: 'commonjs2',
  },
  externals: nodeExternals({
    whitelist: /\.(css|scss)$/,
  }),
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'client/src/html/index.html',
      inject  : true,
      chunks  : ['main', 'vendor.js'],
    }),
    new VueSSRServerPlugin(),
  ],
})

config.module.rules.forEach((rule) => {
  switch (rule.test.toString()) {
    case '/\\.css$/':
      rule.use = ['vue-style-loader', 'css-loader']
      break
    case '/\\.s[ca]ss$/':
      rule.use = ['vue-style-loader', 'css-loader', 'sass-loader']
  }
})

module.exports = config
