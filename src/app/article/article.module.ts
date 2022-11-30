import {Controller, Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {forNestModule} from 'mongoose-typescript'
import {ArticleAdminController} from './article-admin.controller'
import {ArticleApiController} from './article-api.controller'
import {Article} from './article.model'
import {ArticleService} from './article.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      forNestModule(Article),
    ]),
  ],
  controllers: [
    ArticleApiController,
    ArticleAdminController,
  ],
  providers: [
    ArticleService,
  ],
  exports: [
    ArticleService,
  ],
})
export class ArticleModule {}
