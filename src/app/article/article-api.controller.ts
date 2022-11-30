import {MongoIdParam} from '@bangbang93/utils/nest-mongo'
import {Controller, Get, NotFoundException, ParseIntPipe, Query} from '@nestjs/common'
import {NotFound} from 'http-errors'
import {IArticleDocument, IArticleSchema} from './article.model'
import {ArticleService} from './article.service'

@Controller('api/article')
export class ArticleApiController {
  constructor(
    private readonly articleService: ArticleService,
  ) {}

  @Get(':id(\\w{24})')
  public async getById(@MongoIdParam('id') id: string): Promise<IArticleDocument | null> {
    const article = await this.articleService.getById(id)
    if (!article) {
      throw new NotFoundException('article not found')
    }
    return article
  }

  @Get()
  public async list(@Query('page', ParseIntPipe) page: number): Promise<IArticleSchema[]> {
    return this.articleService.list(page)
  }

  @Get('search')
  public async search(@Query('keyword') keyword: string,
    @Query('page', ParseIntPipe) page: number): Promise<IArticleSchema[]> {
    return this.articleService.search(keyword, page)
  }
}
