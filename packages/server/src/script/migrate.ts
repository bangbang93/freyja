import {INestApplicationContext} from '@nestjs/common'
import {NestFactory} from '@nestjs/core'
import {getConnectionToken} from '@nestjs/mongoose'
import Logger from 'bunyan'
import mongoose, {Connection} from 'mongoose'
import {Bunyan} from 'nestjs-bunyan'
import {MigrationParams, MongoDBStorage, Umzug} from 'umzug'
import {AppModule} from '../app.module'

mongoose.set('debug', true)

export type MigrateArguments = MigrationParams<IMigrateContext>

export interface IMigrateContext {
  app: INestApplicationContext
  logger: Bunyan
}

async function main(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule)
  const logger = app.get(Logger).child({context: 'migration'})
  const connection = await app.get<Connection>(getConnectionToken()).asPromise()
  const umzug = new Umzug<IMigrateContext>({
    storage: new MongoDBStorage({
      collection: connection.collection('__migrations'),
    }),
    migrations: {
      glob: 'dist/migrations/*.js',
    },
    context: {
      app,
      logger,
    },
    create: {
      folder: 'src/migrations',
    },
    logger,
  })

  await umzug.runAsCLI()
  await app.close()
}

void main()
