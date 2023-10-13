import {Application} from 'express'
import {join} from 'path'
import {App} from 'vue'
import webpack from 'webpack'


export async function setupDevServer(app: Application): Promise<(args: unknown) => Promise<App>> {
  const wdm = require('webpack-dev-middleware')
  const [clientConfig, adminConfig, serverConfig] = await Promise.all([
    import('./webpack/webpack.conf').then((m) => m.default),
    import('./webpack/webpack.admin').then((m) => m.default),
    import('./webpack/webpack.server').then((m) => m.default),
  ])

  return new Promise((resolve, reject) => {
    const clientCompiler = webpack([clientConfig, adminConfig])
    const devMiddleware = wdm(clientCompiler, {
      publicPath: clientConfig.output?.publicPath,
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

    // server renderer
    const serverCompiler = webpack(serverConfig)
    serverCompiler.watch({}, (err, stats) => {
      if (err) return reject(err)
      const statJson = stats?.toJson()
      // eslint-disable-next-line no-console
      statJson?.errors?.forEach((err) => console.error(err))
      // eslint-disable-next-line no-console
      statJson?.warnings?.forEach((err) => console.warn(err))
      if (statJson?.errors?.length) return reject(statJson.errors)

      import(join(clientConfig.output?.path ?? '', 'server/server.js'))
        .then((e) => resolve(e.default))
        .catch(reject)
    })
  })
}
