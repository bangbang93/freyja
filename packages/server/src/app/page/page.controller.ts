import {MongoIdParam} from '@bangbang93/utils/nest-mongo'
import {PagedDto} from '@bangbang93/utils/nestjs'
import {Controller, Get, NotFoundException, Param, Query} from '@nestjs/common'
import {IPageSchema} from './page.model'
import {PageService} from './page.service'

@Controller('api/page')
export class PageController {
  constructor(
    private readonly pageService: PageService,
  ) {}

  @Get(':id(\\w{24})')
  public async getById(@MongoIdParam('id') id: string): Promise<IPageSchema> {
    const page = await this.pageService.getById(id)
    if (!page) {
      throw new NotFoundException('page not found')
    }
    return page
  }

  @Get(':name')
  public async getByName(@Param('name') name: string): Promise<IPageSchema> {
    const page = await this.pageService.getByName(name)
    if (!page) {
      throw new NotFoundException('page not found')
    }
    return page
  }

  @Get()
  public async list(@Query() query: PagedDto): Promise<IPageSchema[]> {
    return await this.pageService.listByPage(query.page, query.limit)
  }
}
