import {Module} from '@nestjs/common'
import {ArticleModule} from '../article/article.module'
import {FeedController} from './feed.controller'
import {FeedService} from './feed.service'

@Module({
  imports: [
    ArticleModule,
  ],
  controllers: [
    FeedController,
  ],
  providers: [
    FeedService,
  ],
})
export class FeedModule {}
