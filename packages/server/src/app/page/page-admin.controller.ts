import {MongoIdParam} from '@bangbang93/utils/nest-mongo'
import {PagedDto} from '@bangbang93/utils/nestjs'
import {Body, Controller, Delete, Get, NotFoundException, Post, Put, Query, UseGuards} from '@nestjs/common'
import {AdminId} from '../admin/admin.decorator'
import {AdminGuard} from '../admin/admin.guard'
import {PageCreateBodyDto} from './page.dto'
import {IPageSchema} from './page.model'
import {PageService} from './page.service'

@Controller('api/admin/page')
@UseGuards(AdminGuard)
export class PageAdminController {
  constructor(
    private readonly pageService: PageService,
  ) {}

  @Post()
  public async create(@Body() body: PageCreateBodyDto, @AdminId() adminId: string): Promise<IPageSchema> {
    return await this.pageService.create({
      ...body,
      author: adminId,
    })
  }

  @Get()
  public async list(@Query() query: PagedDto): Promise<IPageSchema[]> {
    return await this.pageService.listByPage(query.page, query.limit)
  }

  @Get(':id(\\w{24})')
  public async getById(@MongoIdParam('id') id: string): Promise<IPageSchema> {
    const page = await this.pageService.getById(id)
    if (!page) {
      throw new NotFoundException('page not found')
    }
    return page
  }

  @Put(':id(\\w{24})')
  public async update(@MongoIdParam('id') id: string, @Body() body: PageCreateBodyDto): Promise<IPageSchema> {
    const page = await this.pageService.getById(id)
    if (!page) {
      throw new NotFoundException('page not found')
    }
    return await this.pageService.update(id, {
      ...body,
    })
  }

  @Delete(':id(\\w{24})')
  public async delete(@MongoIdParam('id') id: string): Promise<void> {
    const page = await this.pageService.getById(id)
    if (!page) {
      throw new NotFoundException('page not found')
    }
    return await this.pageService.delete(id)
  }

  @Get('count')
  public async count(): Promise<{ count: number }> {
    return {
      count: await this.pageService.count(),
    }
  }

  @Get('rerender-all')
  public async rerenderAll(): Promise<void> {
    return await this.pageService.renderAll()
  }
}
