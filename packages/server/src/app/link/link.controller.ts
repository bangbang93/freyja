import {Controller, Get} from '@nestjs/common'
import {ILinkSchema} from './link.model'
import {LinkService} from './link.service'

@Controller('api/link')
export class LinkController {
  constructor(
    private readonly linkService: LinkService,
  ) {}

  @Get()
  public async listAll(): Promise<ILinkSchema[]> {
    return await this.linkService.listAll()
  }
}
