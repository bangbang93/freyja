/**
 * Created by bangbang93 on 16/9/30.
 */
'use strict';

const config = require('./webpack.base.config');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const langs = require('highlight.js-async-webpack/src/file.lang.hljs.js');
const entry = {
  index: path.resolve(__dirname, '../client/src/entries/entry-client.js'),
}
const entries = Object.keys(entry)

// for (const lang of langs) {
//   entry[`hljs/${lang}`] = [`mavon-editor/dist/js/${lang}.js`]
// }

let plugins;
if (IS_PRODUCTION) {
  console.log('production webpack')
  plugins     = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${process.env.NODE_ENV}'`
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except   : ['$super', '$', 'exports', 'require'],
        sourceMap: true,
      }
    }),
    new CleanPlugin(config.output.path, {
      root   : require('path').resolve('..'),
      exclude: ['.gitkeep']
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor.js'),
    new ExtractTextPlugin('style.css'),
    new VueSSRClientPlugin(),
  ]
  entries.forEach((entry) => {
    plugins.push(new HtmlWebpackPlugin({
      filename: `${entry}.html`,
      template: `client/src/html/${entry}.html`,
      inject  : true,
      chunks  : [entry, 'vendor.js']
    }))
  })
} else {

// add hot-reload related code to entry chunks
  Object.keys(entry).forEach(function (name) {
    entry[name] = ['webpack-hot-middleware/client?name=freyja'].concat(entry[name])
  })
  plugins     = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${process.env.NODE_ENV}'`
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new VueSSRClientPlugin(),
  ]
  entries.forEach((entry) => {
    plugins.push(new HtmlWebpackPlugin({
      filename: `index.html`,
      template: `client/src/html/index.html`,
      inject  : true,
      chunks  : [entry]
    }))
  })
}

module.exports = merge(config, {
  entry,
  plugins
});
