/**
 * Created by bangbang93 on 16/10/12.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires,no-console */

process.env.NODE_ENV = 'production'

const ora = require('ora')
const webpack = require('webpack')
const webpackClientConfig = require('../client/webpack.conf')
const webpackServerConfig = require('../client/webpack.server')
const webpackAdminConfig = require('../client/webpack.admin')

console.log('  Tip:\n'
  + '  Built files are meant to be served over an HTTP server.\n'
  + '  Opening index.html over file:// won\'t work.\n')

const spinner = ora('building for production...')
spinner.start()

webpack([webpackClientConfig, webpackServerConfig, webpackAdminConfig], (err, stats) => {
  spinner.stop()
  if (err) throw err
  process.stdout.write(`${stats.toString({
    colors: true,
    env: true,
    entrypoints: false,
    excludeAssets: [/^js\/hljs\//, /^static\//],
  })}\n`)
})
