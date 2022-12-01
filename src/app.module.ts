import {Module} from '@nestjs/common'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {MongooseModule} from '@nestjs/mongoose'
import {BunyanLogger, BunyanLoggerModule} from 'nestjs-bunyan'
import {FreyjaModule} from './app/freyja.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [() => {
        // eslint-disable-next-line no-useless-concat
        return require('../config' + '')
      }],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.getOrThrow('database.mongodb.uri'),
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