import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {forNestModule} from 'mongoose-typescript'
import {ArticleModule} from '../article/article.module'
import {TagAdminController} from './tag-admin.controller'
import {TagController} from './tag.controller'
import {Tag} from './tag.model'
import {TagService} from './tag.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      forNestModule(Tag),
    ]),
    ArticleModule,
  ],
  controllers: [
    TagController,
    TagAdminController,
  ],
  providers: [
    TagService,
  ],
})
export class TagModule {}
