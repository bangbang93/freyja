/**
 * Created by bangbang93 on 16/9/30.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const config = require('./webpack.base.config')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const path = require('path')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const entry = {
  index: path.resolve(__dirname, '../client/src/entries/entry-client.js'),
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
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash:8].css',
      chunkFilename: 'css/[id].[chunkhash:8].css',
    }),
    new VueSSRClientPlugin(),
  ]
  entries.forEach((entry) => {
    plugins.push(new HtmlWebpackPlugin({
      filename: `${entry}.html`,
      template: `client/src/html/${entry}.html`,
      inject: true,
      chunks: [entry],
    }), new PreloadWebpackPlugin({
      rel: 'preload',
      include: [entry],
    }))
  })
} else {
// add hot-reload related code to entry chunks
  for (const name of Object.keys(entry)) {
    entry[name] = ['webpack-hot-middleware/client?name=freyja'].concat(entry[name])
  }
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new VueSSRClientPlugin(),
  )

  entries.forEach((entry) => {
    plugins.push(new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'client/src/html/index.html',
      inject: true,
      chunks: [entry],
    }))
  })
}

module.exports = merge(config, {
  entry,
  plugins,
})
