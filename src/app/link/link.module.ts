import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {forNestModule} from 'mongoose-typescript'
import {LinkController} from './link.controller'
import {Link} from './link.model'
import {LinkService} from './link.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      forNestModule(Link),
    ]),
  ],
  controllers: [
    LinkController,
  ],
  providers: [
    LinkService,
  ],
})
export class LinkModule {}
