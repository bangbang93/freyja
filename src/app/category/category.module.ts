import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {forNestModule} from 'mongoose-typescript'
import {ArticleModule} from '../article/article.module'
import {CategoryApiController} from './category-api.controller'
import {Category} from './category.model'
import {CategoryService} from './category.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      forNestModule(Category),
    ]),
    ArticleModule,
  ],
  controllers: [
    CategoryApiController,
  ],
  providers: [
    CategoryService,
  ],
})
export class CategoryModule {}
