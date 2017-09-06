/**
 * Created by bangbang93 on 16/10/12.
 */
'use strict';

// https://github.com/shelljs/shelljs
const shell = require('shelljs');
process.env.NODE_ENV = 'production';

const path = require('path');
const config = require('../client/webpack.base.config');
const ora = require('ora');
const webpack = require('webpack');
const webpackClientConfig = require('../client/webpack.conf');
const webpackServerConfig = require('../client/webpack.server');
const webpackAdminConfig = require('../client/webpack.admin');

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
);

const spinner = ora('building for production...');
spinner.start();

// const assetsPath = path.join(__dirname, '../public')
// shell.rm('-rf', assetsPath);
// shell.mkdir('-p', assetsPath);
// shell.cp('-R', path.join(__dirname, '../client/static/'), assetsPath);

webpack([webpackClientConfig, webpackServerConfig, webpackAdminConfig], function (err, stats) {
  spinner.stop();
  if (err) throw err;
  process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
});
