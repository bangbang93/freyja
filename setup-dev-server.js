/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict';
const MFS = require('memory-fs')
const webpack = require('webpack')
const clientConfig = require('./client/webpack.conf')
const adminConfig = require('./client/webpack.admin')
const serverConfig = require('./client/webpack.server')
const path = require('path')
const Promise = require('bluebird')

const readFile = (fs, file) => {
  return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
}

module.exports = function (app) {
  let bundle, clientManifest
  let resolve
  const readyPromise = new Promise(r => { resolve = r })

  let clientCompiler = webpack([clientConfig, adminConfig]);
  let devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    hot: true,
    serverSideRender: true,
    index: false,
  });
  let hotMiddleware = require('webpack-hot-middleware')(clientCompiler);
  app.use(devMiddleware);
  app.use(hotMiddleware);
  clientCompiler.plugin('done', stats => {
    stats = stats.toJson()
    app.set('bundleHash', stats.children[1].hash)
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    if (stats.errors.length) return

    clientManifest = JSON.parse(readFile(
      devMiddleware.fileSystem,
      'vue-ssr-client-manifest.json'
    ))
    if (bundle) {
      resolve({
        bundle,
        options: {
          clientManifest
        }
      })
    }
  })

// server renderer
  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    if (stats.errors.length) return

    bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'))
    if (clientManifest) {
      resolve({
        bundle,
        options: {
          clientManifest
        }
      })
    }
  })

  return readyPromise
}
