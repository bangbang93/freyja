import {HttpExceptionFilter} from '@bangbang93/utils/nestjs/http-exception.filter'
import {ValidationPipe} from '@nestjs/common'
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
import {createServerRender} from './middleware/create-server-render'

export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }))
  app.useGlobalFilters(app.get(HttpExceptionFilter))

  await mongoose.connect(configService.getOrThrow('database.mongodb.uri'))

  const redis = new Redis(configService.get('database.redis') as RedisOptions)

  const eApp = app.getHttpAdapter() as unknown as Application

  app.set('trust proxy', true)

  if (configService.get('NODE_ENV') === 'development') {
    app.use(morgan('dev'))
  } else {
    app.use(morgan('combined'))
  }
  const redisStore = connectRedis(session)

  app.use(cookieParser())
  const sessionConfig = configService.get('session') as Record<string, string>
  app.use(session({
    name: 'freyja.sid',
    store: new redisStore({
      client: redis,
      prefix: 'freyja:session:',
    }),
    secret: sessionConfig.secret,
  }))

  app.use(favicon(path.join(__dirname, '../../../public', 'favicon.ico')))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(helmet({
    contentSecurityPolicy: false,
  }))

  app.use('/admin', historyApiFallback())

  const port = parseInt(configService.get('PORT', '3000'), 10)

  const homeRoot = join(__dirname, '..', '..', 'home')
  const adminRoot = join(__dirname, '..', '..', 'admin')
  const publicRoot = path.join(__dirname, '..', '..', '..', 'public')

  if (configService.get('NODE_ENV') === 'production') {
    app.use(cacheControl({
      '/': 3600,
      '/article/**': 3600,
    }))
    eApp.get('/admin', express.static(path.join(adminRoot, 'dist')))
    eApp.get('*', express.static(path.join(homeRoot, 'dist', 'client')))
  } else {
    const vite = await import('vite')
    const homeViteDevMiddleware = (
      await vite.createServer({
        root: homeRoot,
        server: {middlewareMode: true},
      })
    ).middlewares
    // const adminViteDevMiddleware = (
    //   await vite.createServer({
    //     root: adminRoot,
    //     server: {middlewareMode: true},
    //   })
    // ).middlewares
    // app.use('/admin', adminViteDevMiddleware)
    app.use(homeViteDevMiddleware)
  }

  const serverRender = await createServerRender(port, configService.get('NODE_ENV'))
  eApp.get(/^(?!\/api|admin\/)./, (req, res, next) => {
    serverRender(req, res, next).catch(next)
  })

  app.use(express.static(publicRoot))

  await app.listen(port)
}
