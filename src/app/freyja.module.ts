import {Module} from '@nestjs/common'
import {AdminModule} from './admin/admin.module'
import {ArticleModule} from './article/article.module'
import {AttachmentModule} from './attachment/attachment.module'
import {CategoryModule} from './category/category.module'

@Module({
  imports: [
    AdminModule,
    ArticleModule,
    AttachmentModule,
    CategoryModule,
  ],
})
export class FreyjaModule {}
