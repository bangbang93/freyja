/**
 * Created by bangbang93 on 16/10/12.
 */
'use strict';

// https://github.com/shelljs/shelljs
const shell = require('shelljs');
process.env.NODE_ENV = 'production';

const path = require('path');
const config = require('../client/webpack');
const ora = require('ora');
const webpack = require('webpack');
const webpackConfig = require('../client/webpack.conf');

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
);

const spinner = ora('building for production...');
spinner.start();

const assetsPath = path.join(config.assetsRoot, config.assetsSubDirectory);
shell.rm('-rf', assetsPath);
shell.mkdir('-p', assetsPath);
shell.cp('-R', 'client/static/', assetsPath);

webpack(webpackConfig, function (err, stats) {
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
