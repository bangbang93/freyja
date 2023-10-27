import {Module} from '@nestjs/common'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {MongooseModule} from '@nestjs/mongoose'
import * as Mongoose from 'mongoose'
import {BunyanLoggerModule} from 'nestjs-bunyan'
import {FreyjaModule} from './app/freyja.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [() => {
        // eslint-disable-next-line no-useless-concat,@typescript-eslint/no-unsafe-return
        return require('../../../config')
      }],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (configService.get('NODE_ENV') === 'development') {
          Mongoose.set('debug', true)
        }
        return {
          uri: configService.getOrThrow<string>('database.mongodb.uri'),
        }
      },
    }),
    BunyanLoggerModule.forRoot({
      isGlobal: true,
      bunyan: {
        name: 'freyja',
      },
    }),

    FreyjaModule,
  ],
})
export class AppModule {}
