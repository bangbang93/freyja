import {Module} from '@nestjs/common'
import {AdminModule} from './admin/admin.module'
import {ArticleModule} from './article/article.module'

@Module({
  imports: [
    AdminModule,
    ArticleModule,
  ],
})
export class FreyjaModule {}
