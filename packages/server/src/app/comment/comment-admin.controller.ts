import {MongoIdParam} from '@bangbang93/utils/nest-mongo'
import {PagedDto} from '@bangbang93/utils/nestjs'
import {Controller, Delete, Get, HttpCode, HttpStatus, Query, UseGuards} from '@nestjs/common'
import {AdminGuard} from '../admin/admin.guard'
import {ICommentSchema} from './comment.model'
import {CommentService} from './comment.service'

@Controller('api/admin/comment')
@UseGuards(AdminGuard)
export class CommentAdminController {
  constructor(
    private readonly commentService: CommentService,
  ) {}

  @Get()
  public async list(@Query() query: PagedDto): Promise<ICommentSchema[]> {
    return this.commentService.list(query.page, query.limit)
  }

  @Delete(':id(\\w{24})')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@MongoIdParam('id') id: string): Promise<void> {
    return this.commentService.delete(id)
  }
}
