import {isMongoId} from 'class-validator'
import {Controller, Get, NotFoundException, Param, Query} from '@nestjs/common'
import {PagedDto} from '@bangbang93/utils/nestjs'
import {IPageSchema} from './page.model'
import {PageService} from './page.service'

@Controller('api/page')
export class PageController {
  constructor(
    private readonly pageService: PageService,
  ) {}

  @Get()
  public async list(@Query() query: PagedDto): Promise<IPageSchema[]> {
    return await this.pageService.list(query.page, query.limit)
  }

  // :id 与 :name 无法用路径模式区分，用 isMongoId 运行时分派
  @Get(':idOrName')
  public async getByIdOrName(@Param('idOrName') idOrName: string): Promise<IPageSchema> {
    const page = isMongoId(idOrName)
      ? await this.pageService.getById(idOrName)
      : await this.pageService.getByName(idOrName)
    if (!page) {
      throw new NotFoundException('page not found')
    }
    return page
  }
}
