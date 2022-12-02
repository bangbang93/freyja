import {Application} from 'express'
import MemoryFileSystem from 'memory-fs'
import webpack from 'webpack'

const path = require('path')

export async function setupDevServer(app: Application): Promise<any> {
  let bundle: any
  let clientManifest: any
  const [clientConfig, adminConfig, serverConfig] = await Promise.all([
    eval('import("../client/webpack.conf.ts").then((e) => e.default)'),
    eval('import("../client/webpack.admin.ts").then((e) => e.default)'),
    eval('import("../client/webpack.server.ts").then((e) => e.default)'),
  ])
  const readFile = (fs: MemoryFileSystem, file: string) => {
    return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
  }
  return new Promise((resolve, reject) => {
    const clientCompiler = webpack([clientConfig, adminConfig])
    const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
      publicPath: clientConfig.output.publicPath,
      hot: true,
      serverSideRender: true,
      index: false,
      stats: {
        colors: true,
        excludeAssets: [/^js\/hljs\//, /^static\//],
      },
    })
    const hotMiddleware = require('webpack-hot-middleware')(clientCompiler)
    app.use(devMiddleware)
    app.use(hotMiddleware)
    clientCompiler.hooks.done.tap('done', (stats) => {
      const statJson = stats.toJson()
      app.set('bundleHash', statJson.children?.[1].hash)
      // eslint-disable-next-line no-console
      statJson?.errors?.forEach((err) => console.error(err))
      // eslint-disable-next-line no-console
      statJson?.warnings?.forEach((err) => console.warn(err))
      if (statJson?.errors?.length) return

      clientManifest = JSON.parse(readFile(
        devMiddleware.fileSystem,
        'vue-ssr-client-manifest.json',
      ))
      if (bundle) {
        resolve({
          bundle,
          options: {
            clientManifest,
          },
        })
      }
    })

    // server renderer
    const serverCompiler = webpack(serverConfig)
    const mfs = new MemoryFileSystem()
    serverCompiler.outputFileSystem = mfs
    serverCompiler.watch({}, (err, stats) => {
      if (err) throw err
      const statJson = stats?.toJson()
      // eslint-disable-next-line no-console
      statJson?.errors?.forEach((err) => console.error(err))
      // eslint-disable-next-line no-console
      statJson?.warnings?.forEach((err) => console.warn(err))
      if (statJson?.errors?.length) return

      bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'))
      if (clientManifest) {
        resolve(app)
      }
    })
  })
}
