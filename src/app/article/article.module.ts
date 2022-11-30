import {Controller, Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {forNestModule} from 'mongoose-typescript'
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
  ],
  providers: [
    ArticleService,
  ],
})
export class ArticleModule {}
