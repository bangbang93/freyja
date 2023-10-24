import {MongoIdParam} from '@bangbang93/utils/nest-mongo'
import {PagedDto} from '@bangbang93/utils/nestjs'
import {Body, Controller, Delete, Get, Post, Put, Query, UseGuards} from '@nestjs/common'
import {AdminId} from '../admin/admin.decorator'
import {AdminGuard} from '../admin/admin.guard'
import {ArticleCreateBody} from './article.dto'
import {IArticleDocument, IArticleSchema} from './article.model'
import {ArticleService} from './article.service'

@Controller('/api/admin/article')
@UseGuards(AdminGuard)
export class ArticleAdminController {
  constructor(
    private readonly articleService: ArticleService,
  ) {}

  @Post()
  public async create(@Body() body: ArticleCreateBody, @AdminId() adminId: string): Promise<IArticleDocument> {
    return this.articleService.create({
      ...body, author: adminId,
    })
  }

  @Get()
  public async list(@Query() query: PagedDto): Promise<IArticleSchema[]> {
    return this.articleService.listByPage(query.page, query.limit)
  }

  @Get(':id(\\w{24})')
  public async getById(@MongoIdParam('id') id: string): Promise<IArticleDocument | null> {
    return this.articleService.getById(id)
  }

  @Put(':id(\\w{24})')
  public async update(@MongoIdParam('id') id: string, @Body() body: ArticleCreateBody): Promise<IArticleDocument> {
    return this.articleService.update(id, body)
  }

  @Delete(':id(\\w{24})')
  public async delete(@MongoIdParam('id') id: string): Promise<void> {
    await this.articleService.delete(id)
  }

  @Get('count')
  public async count(): Promise<{ count: number }> {
    return {
      count: await this.articleService.count(),
    }
  }

  @Get('rerender-all')
  public async rerenderAll(): Promise<void> {
    await this.articleService.renderAll()
  }
}
