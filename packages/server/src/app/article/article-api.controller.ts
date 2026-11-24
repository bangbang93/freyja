import {isMongoId} from 'class-validator'
import {
  BadRequestException, Controller, DefaultValuePipe, Get, NotFoundException, Param, ParseIntPipe, Query,
} from '@nestjs/common'
import {IArticleDocument, IArticleSchema} from './article.model'
import {ArticleService} from './article.service'

@Controller('api/article')
export class ArticleApiController {
  constructor(
    private readonly articleService: ArticleService,
  ) {}

  // Express 5（path-to-regexp v8）不支持 :id(\w{24}) 内联正则；
  // 字面量路由须先于动态路由注册，:id 与 :slug 用 isMongoId 运行时分派

  @Get()
  public async list(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<IArticleSchema[]> {
    if (page < 1) {
      throw new BadRequestException('page must be greater than or equal to 1')
    }
    return await this.articleService.list(page)
  }

  @Get('search')
  public async search(@Query('keyword') keyword: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number): Promise<IArticleSchema[]> {
    if (page < 1) {
      throw new BadRequestException('page must be greater than or equal to 1')
    }
    return await this.articleService.search(keyword, page)
  }

  @Get(':idOrSlug')
  public async getByIdOrSlug(@Param('idOrSlug') idOrSlug: string): Promise<IArticleDocument> {
    const article = isMongoId(idOrSlug)
      ? await this.articleService.getById(idOrSlug)
      : await this.articleService.getBySlug(idOrSlug)
    if (!article) {
      throw new NotFoundException('article not found')
    }
    return article
  }
}
