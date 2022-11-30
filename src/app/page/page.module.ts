import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {forNestModule} from 'mongoose-typescript'
import {PageAdminController} from './page-admin.controller'
import {PageController} from './page.controller'
import {Page} from './page.model'
import {PageService} from './page.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      forNestModule(Page),
    ]),
  ],
  controllers: [
    PageController,
    PageAdminController,
  ],
  providers: [
    PageService,
  ],
})
export class PageModule {}
