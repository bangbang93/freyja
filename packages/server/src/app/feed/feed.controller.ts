import {Controller, Get, Req, Res} from '@nestjs/common'
import {Request, Response} from 'express'
import {FeedService} from './feed.service'

@Controller('feed')
export class FeedController {
  constructor(
    private readonly feedService: FeedService,
  ) {}

  @Get()
  public async getFeed(@Req() req: Request, @Res() res: Response): Promise<void> {
    const origin = req.get('origin') ?? `${req.protocol}://${req.hostname}`
    res.type('xml')
    const rss = await this.feedService.getFeed(origin)
    res.send(rss)
  }
}
