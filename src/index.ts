import {ConfigService} from '@nestjs/config'
import {NestFactory} from '@nestjs/core'
import {NestExpressApplication} from '@nestjs/platform-express'
import bodyParser from 'body-parser'
import cacheControl from 'cache-control'
import connectRedis from 'connect-redis'
import cookieParser from 'cookie-parser'
import * as express from 'express'
import {Application, NextFunction, Request, Response} from 'express'
import session from 'express-session'
import fs from 'fs'
import helmet from 'helmet'
import Redis, {RedisOptions} from 'ioredis'
import mongoose from 'mongoose'
import morgan from 'morgan'
import path from 'path'
import favicon from 'serve-favicon'
import {BundleRenderer, BundleRendererOptions, createBundleRenderer} from 'vue-server-renderer'
import {AppModule} from './app.module'
import serverRender from './middleware/server-render'
import {setupDevServer} from './setup-dev-server'

export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)

  await mongoose.connect(configService.getOrThrow('database.mongodb.uri'))

  const redis = new Redis(configService.get('redis') as RedisOptions)

  const eApp = app.getHttpAdapter() as unknown as Application

  app.set('trust proxy', 'loopback')

  if (configService.get('NODE_ENV') === 'development') {
    app.use(morgan('dev'))
  } else {
    app.use(morgan('combined'))
  }
  const RedisStore = connectRedis(session)

  app.use(cookieParser())
  const sessionConfig = configService.get('session')
  app.use(session({
    store: new RedisStore({
      client: redis,
      prefix: 'freyja:session:',
    }),
    secret: sessionConfig.secret,
  }))

  app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(helmet({
    contentSecurityPolicy: false,
  }))


  // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
  app.use('/', require('./route/index'))

  // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
  require('express-simple-route')(path.join(__dirname, 'route'), app)
  app.use(express.static(path.join(__dirname, 'public')))

  const port = parseInt(configService.get('PORT', '3000'), 10)

  const template = fs.readFileSync(path.join(__dirname, '../client/src/html/index.html'), 'utf-8')
  function createRenderer(bundle: string | object, options: BundleRendererOptions): BundleRenderer {
    return createBundleRenderer(bundle, {...options,
      template,
      runInNewContext: false})
  }

  /* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
  if (configService.get('NODE_ENV') === 'production') {
    // In production: create server renderer using built server bundle.
    // The server bundle is generated by vue-ssr-webpack-plugin.
    const bundle = require('./client/dist/vue-ssr-server-bundle.json')
    // The client manifests are optional, but it allows the renderer
    // to automatically infer preload/prefetch links and directly add <script>
    // tags for any async chunks used during render, avoiding waterfall requests.
    const clientManifest = require('./client/dist/vue-ssr-client-manifest.json')
    const LRU = require('lru-cache')
    const renderer = createRenderer(bundle, {
      clientManifest,
      cache: new LRU({
        max: 10000,
      }),
    })
    app.use(cacheControl({
      '/': 3600,
      '/article/**': 3600,
    }))
    eApp.get('*', (req, res, next) => serverRender(renderer, port)(req, res, next))

    app.use(express.static(path.join(__dirname, 'client/dist')))
  } else {
    const renderPromise = await setupDevServer(eApp)
    const renderer = serverRender(createRenderer(renderPromise.bundle, renderPromise.options), port)
    eApp.get('*', (req, res, next) => {
      renderer(req, res, next)
    })
  }

  if (configService.get('freyja.fundebug.enable')) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
    const fundebug = require('fundebug-nodejs')
    fundebug.apikey = configService.get('freyja.fundebug.apikey')
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500)
      next(err)
    })
    app.use(fundebug.ExpressErrorHandler)
  }
  app.use((err: Record<string, unknown>, req: Request, res: Response, next: NextFunction) => {
    if (!err.status) {
      // eslint-disable-next-line no-console
      console.error(err)
      err.status = 500
    }
    if (res.headersSent) return
    res.status((err.status as number) || 500)
      .json({
        message: err.message,
      })
  })

  await app.listen(configService.get('PORT', '3000'))
}
