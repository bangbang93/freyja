import {Controller, Get, HttpStatus, Next, Param, Query, Redirect, Res} from '@nestjs/common'
import {isNumberString} from 'class-validator'
import {NextFunction, Response} from 'express'
import {ArticleService} from './article.service'

@Controller()
export class ArticleWpController {
  constructor(
    private readonly articleService: ArticleService,
  ) {}

  @Get('/:year(\\d+)/:mouth(\\d+)/:day(\\d+)/:postName.:suffix')
  public async postName(@Param('postname') postName: string, @Next() next: NextFunction,
    @Res() res: Response): Promise<void> {
    const article = await this.articleService.getByWordpress({postName})
    if (!article) return next()
    res.redirect(HttpStatus.PERMANENT_REDIRECT, `/article/${article._id.toString()}`)
  }

  @Get()
  public async index(@Query() query: Record<string, string>, @Next() next: NextFunction,
    @Res() res: Response): Promise<void> {
    if (!query.p) return next()
    if (!isNumberString(query.p)) return next()

    const article = await this.articleService.getByWordpress({id: parseInt(query.p, 10)})
    if (!article) return next()
    res.redirect(HttpStatus.PERMANENT_REDIRECT, `/article/${article._id.toString()}`)
  }

  @Get('about')
  @Redirect('/page/i', HttpStatus.PERMANENT_REDIRECT)
  public about(): void {
    //noop
  }
}
