import {PagedDto} from '@bangbang93/utils/nestjs'
import {Controller, Get, Param, Query} from '@nestjs/common'
import {IArticleSchema} from '../article/article.model'
import {ArticleService} from '../article/article.service'
import {ICategorySchema} from './category.model'
import {CategoryService} from './category.service'

@Controller('api/category')
export class CategoryApiController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly articleService: ArticleService,
  ) {}

  @Get()
  public async listAll(): Promise<ICategorySchema[]> {
    return this.categoryService.listAll()
  }

  @Get('tree')
  public async listTree(): Promise<ICategorySchema[]> {
    return this.categoryService.listTree()
  }

  @Get(':category')
  public async listArticlesByCategory(@Param('category') category: string,
    @Query() query: PagedDto): Promise<IArticleSchema[]> {
    return this.articleService.findByCategory(category, query.page)
  }
}
