import {Controller, Get, Param, Put, UseGuards} from '@nestjs/common'
import {AdminGuard} from '../admin/admin.guard'
import {ITagSchema} from './tag.model'
import {TagService} from './tag.service'

@Controller('api/admin/tag')
@UseGuards(AdminGuard)
export class TagAdminController {
  constructor(
    private readonly tagService: TagService,
  ) {}

  @Get()
  public async listAll(): Promise<ITagSchema[]> {
    return await this.tagService.listAll()
  }

  @Put(':title')
  public async create(@Param('title') title: string): Promise<ITagSchema> {
    return await this.tagService.create(title)
  }
}
