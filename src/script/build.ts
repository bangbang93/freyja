/**
 * Created by bangbang93 on 16/10/12.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires,no-console */

import ora from 'ora'
import webpack from 'webpack'
import webpackClientConfig from '../webpack/webpack.conf'
import webpackServerConfig from '../webpack/webpack.server'

process.env.NODE_ENV = 'production'

console.log('  Tip:\n'
  + '  Built files are meant to be served over an HTTP server.\n'
  + '  Opening index.html over file:// won\'t work.\n')

const spinner = ora('building for production...')
spinner.start()

webpack([webpackClientConfig, webpackServerConfig], (err, stats) => {
  spinner.stop()
  if (err) {
    console.log(err)
    process.exit(1)
  }
  process.stdout.write(`${stats?.toString({
    colors: true,
    env: true,
    entrypoints: false,
    excludeAssets: [/^js\/hljs\//, /^static\//],
  })}\n`)
  process.exit(0)
})
