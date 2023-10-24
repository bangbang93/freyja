/* eslint-disable no-console,n/no-process-exit */
/**
 * Created by bangbang93 on 16/10/12.
 */
'use strict'
import ora from 'ora'
import webpack from 'webpack'
import webpackServerConfig from '../webpack/webpack.server'

process.env.NODE_ENV = 'production'

const spinner = ora('building for production...')
spinner.start()

webpack([webpackServerConfig], (err, stats) => {
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
