/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict';
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const path = require('path')

module.exports = merge(baseConfig, {
  entry: path.join(__dirname, './src/entries/entry-server.js'),
  target: 'node',
  output: {
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new VueSSRServerPlugin(),
  ],
})