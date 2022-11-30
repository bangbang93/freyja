import {Module} from '@nestjs/common'
import {AdminModule} from './admin/admin.module'
import {ArticleModule} from './article/article.module'
import {AttachmentModule} from './attachment/attachment.module'
import {CategoryModule} from './category/category.module'
import {CommentModule} from './comment/comment.module'
import {LinkModule} from './link/link.module'
import {PageModule} from './page/page.module'

@Module({
  imports: [
    AdminModule,
    ArticleModule,
    AttachmentModule,
    CategoryModule,
    CommentModule,
    PageModule,
    LinkModule,
  ],
})
export class FreyjaModule {}
