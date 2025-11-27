import {PagedDto} from '@bangbang93/utils/nestjs'
import {Controller, Get, Param, Query} from '@nestjs/common'
import {IArticleSchema} from '../article/article.model'
import {ArticleService} from '../article/article.service'

@Controller('api/tag')
export class TagController {
  constructor(
    private readonly articleService: ArticleService,
  ) {}

  @Get(':tag')
  public async listByTag(@Param('tag') tag: string, @Query() query: PagedDto): Promise<IArticleSchema[]> {
    return await this.articleService.findByTag(tag, query.page, query.limit)
  }
}
