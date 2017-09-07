/**
 * Created by bangbang93 on 16/9/30.
 */
'use strict';

const config = require('./webpack.base.config');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const langs = require('highlight.js-async-webpack/src/file.lang.hljs.js');

const entry = {
  index: path.resolve(__dirname, '../client/src/entries/entry-admin.js'),
  login: path.resolve(__dirname, '../client/src/entries/entry-admin-login.js'),
}
const entries = Object.keys(entry);

for (const lang of langs) {
  entry[`hljs/${lang}`] = [`mavon-editor/dist/js/${lang}.js`]
}

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
    new webpack.optimize.CommonsChunkPlugin('vendor'),
    new ExtractTextPlugin('style.css'),
  ]
  entries.forEach((entry) => {
    plugins.push(new HtmlWebpackPlugin({
      filename: `${entry}.html`,
      template: `client/src/html/admin.html`,
      inject  : true,
      chunks  : [entry, 'vendor']
    }))
  })
} else {

// add hot-reload related code to entry chunks
  entries.forEach(function (name) {
    entry[name] = ['webpack-hot-middleware/client?name=admin'].concat(entry[name])
  })
  plugins     = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${process.env.NODE_ENV}'`
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]
  entries.forEach((entry) => {
    plugins.push(new HtmlWebpackPlugin({
      filename: `${entry}.html`,
      template: `client/src/html/admin.html`,
      inject  : true,
      chunks  : [entry]
    }))
  })
}

module.exports = merge(config, {
  name: 'admin',
  entry,
  plugins,
  output: {
    path: path.resolve(__dirname, './dist/admin'),
    publicPath: '/admin/',
    filename: 'js/[name].[hash].js'
  },
});
