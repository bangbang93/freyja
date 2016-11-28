/**
 * Created by bangbang93 on 16/9/30.
 */
'use strict';

var config = require('./webpack');
var webpack = require('webpack');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin');


if (process.env.NODE_ENV == 'development'){

// add hot-reload related code to entry chunks
  Object.keys(config.entry).forEach(function (name) {
    config.entry[name] = ['./client/dev-client'].concat(config.entry[name])
  });
  var plugins = [
    new webpack.DefinePlugin({
      'process.env': `'${process.env}'`
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ];
  let entries = Object.keys(config.entry);
  entries.forEach((entry)=>{
    plugins.push(new HtmlWebpackPlugin({
      filename: `${entry}.html`,
      template: `client/src/${entry}.html`,
      inject: true,
      chunks: [entry]
    }))
  })
} else {
  console.log('production webpack');
  plugins = [
    new webpack.DefinePlugin({
      'process.env': `'${process.env}'`
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['$super', '$', 'exports', 'require']
      }
    }),
    new CleanPlugin(config.output.path, {
      root: require('path').resolve('..'),
      exclude: ['.gitkeep']
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor.js'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
  ];
  let entries = Object.keys(config.entry);
  entries.forEach((entry)=>{
    plugins.push(new HtmlWebpackPlugin({
      filename: `${entry}.html`,
      template: `client/src/${entry}.html`,
      inject: true,
      chunks: [entry, 'vendor.js']
    }))
  })
}

module.exports = merge(config, {
  module: {
    loaders: styleLoaders({ sourceMap: config.cssSourceMap })
  },
  plugins
});



function styleLoaders (options) {
  var output = [];
  var loaders = config.cssLoaders(options);
  for (var extension in loaders) {
    var loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      loader: loader
    })
  }
  return output
}