import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [() => {
        // eslint-disable-next-line no-useless-concat
        return require('../../config' + '')
      }],
    }),
  ],
})
export class AppModule {}
