import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {forNestModule} from 'mongoose-typescript'
import {MeilisearchModule} from '../meilisearch/meilisearch.module'
import {UtilModule} from '../util/util.module'
import {ArticleAdminController} from './article-admin.controller'
import {ArticleApiController} from './article-api.controller'
import {Article} from './article.model'
import {ArticleService} from './article.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      forNestModule(Article),
    ]),
    UtilModule,
    MeilisearchModule,
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
