import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {forNestModule} from 'mongoose-typescript'
import {AdminModule} from '../admin/admin.module'
import {ArticleModule} from '../article/article.module'
import {CommentAdminController} from './comment-admin.controller'
import {CommentController} from './comment.controller'
import {Comment} from './comment.model'
import {CommentService} from './comment.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      forNestModule(Comment),
    ]),
    ArticleModule,
    AdminModule,
  ],
  controllers: [
    CommentController,
    CommentAdminController,
  ],
  providers: [
    CommentService,
  ],
})
export class CommentModule {}
