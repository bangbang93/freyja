import {Module} from '@nestjs/common'
import {AdminModule} from './admin/admin.module'
import {ArticleModule} from './article/article.module'
import {AttachmentModule} from './attachment/attachment.module'
import {CategoryModule} from './category/category.module'
import {CommentModule} from './comment/comment.module'

@Module({
  imports: [
    AdminModule,
    ArticleModule,
    AttachmentModule,
    CategoryModule,
    CommentModule,
  ],
})
export class FreyjaModule {}
