/**
 * Created by bangbang93 on 16/9/30.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const config = require('./webpack.base.config')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const entry = {
  index: path.resolve(__dirname, '../client/src/entries/entry-admin.js'),
  login: path.resolve(__dirname, '../client/src/entries/entry-admin-login.js'),
}
const entries = Object.keys(entry)

let plugins = [
  new VueLoaderPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: `'${process.env.NODE_ENV}'`,
    },
  }),
]
if (IS_PRODUCTION) {
  console.log('production webpack') // eslint-disable-line no-console
  plugins     = [
    ...plugins,
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new MiniCssExtractPlugin({
      filename     : 'css/[name].[hash].css',
      chunkFilename: 'css/[id].css',
    }),
  ]
  entries.forEach((entry) => {
    plugins.push(new HtmlWebpackPlugin({
      filename: `${entry}.html`,
      template: 'client/src/html/admin.html',
      inject  : true,
      chunks  : [entry, 'vendor'],
    }))
  })
} else {
// add hot-reload related code to entry chunks
  entries.forEach((name) => {
    entry[name] = ['webpack-hot-middleware/client?name=admin'].concat(entry[name])
  })
  plugins     = [
    ...plugins,
    new webpack.HotModuleReplacementPlugin(),
  ]
  entries.forEach((entry) => {
    plugins.push(new HtmlWebpackPlugin({
      filename: `${entry}.html`,
      template: 'client/src/html/admin.html',
      inject  : true,
      chunks  : [entry],
    }))
  })
}

module.exports = merge(config, {
  name  : 'admin',
  entry,
  plugins,
  output: {
    path      : path.resolve(__dirname, './dist/admin'),
    publicPath: '/admin/',
    filename  : 'js/[name].[hash].js',
  },
})
