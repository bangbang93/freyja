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

const entry = {
  index: path.resolve(__dirname, '../client/src/entries/entry-admin.js'),
  login: path.resolve(__dirname, '../client/src/entries/entry-admin-login.js'),
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
  let entries = Object.keys(entry)
  entries.forEach((entry) => {
    plugins.push(new HtmlWebpackPlugin({
      filename: `${entry}.html`,
      template: `client/src/html/${entry}.html`,
      inject  : true,
      chunks  : [entry, 'vendor']
    }))
  })
} else {

// add hot-reload related code to entry chunks
  Object.keys(entry).forEach(function (name) {
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
  let entries = Object.keys(entry)
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
    filename: '[name].[hash].js'
  },
});
