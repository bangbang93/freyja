import {ConfigService} from '@nestjs/config'
import {NestFactory} from '@nestjs/core'
import {NestExpressApplication} from '@nestjs/platform-express'
import bodyParser from 'body-parser'
import cacheControl from 'cache-control'
import historyApiFallback from 'connect-history-api-fallback'
import connectRedis from 'connect-redis'
import cookieParser from 'cookie-parser'
import * as express from 'express'
import {Application} from 'express'
import session from 'express-session'
import helmet from 'helmet'
import Redis, {RedisOptions} from 'ioredis'
import mongoose from 'mongoose'
import morgan from 'morgan'
import path, {join} from 'path'
import favicon from 'serve-favicon'
import {AppModule} from './app.module'
import serverRender from './middleware/server-render'

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
    name: 'freyja.sid',
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

  app.use('/admin', historyApiFallback())
  app.use(express.static(path.join(__dirname, '..', 'public')))

  const port = parseInt(configService.get('PORT', '3000'), 10)

  /* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
  if (configService.get('NODE_ENV') === 'production') {
    const appPath = join(__dirname, '../client/dist/server/entry-server.js')
    const app = await import(appPath)
    app.use(cacheControl({
      '/': 3600,
      '/article/**': 3600,
    }))
    eApp.get('*', (req, res, next) => serverRender(app, port)(req, res, next))

    app.use(express.static(path.join(__dirname, 'client/dist')))
  } else {
    // const renderPromise = await setupDevServer(eApp)
    // const renderer = serverRender(createRenderer(renderPromise.bundle, renderPromise.options), port)
    // eApp.get('*', (req, res, next) => {
    //   renderer(req, res, next)
    // })
  }

  if (configService.get('freyja.fundebug.enable')) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
    const fundebug = require('fundebug-nodejs')
    fundebug.apikey = configService.get('freyja.fundebug.apikey')
    app.use(fundebug.ExpressErrorHandler)
  }

  await app.listen(port)
}
