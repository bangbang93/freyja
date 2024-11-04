import {MongoIdParam} from '@bangbang93/utils/nest-mongo'
import {PagedDto} from '@bangbang93/utils/nestjs'
import {Body, Controller, Get, Headers, Ip, Post, Query} from '@nestjs/common'
import {AdminId} from '../admin/admin.decorator'
import {CommentCreateBodyDto, CommentTreeDto} from './comment.dto'
import {ICommentDocument, ICommentSchema} from './comment.model'
import {CommentService} from './comment.service'

@Controller('api/comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
  ) {}

  @Get('article/:id(\\w{24})')
  public async getArticleComments(@MongoIdParam('id') id: string, @Query() query: PagedDto): Promise<CommentTreeDto[]> {
    const list = await this.commentService.listByArticle(id, query.page, query.limit)
    return removeEmail(list)


    function removeEmail(comments: ICommentDocument[]): CommentTreeDto[] {
      return comments.map((comment) => {
        const doc = comment.toObject()
        return {
          ...doc,
          publisher: {
            ...doc.publisher,
            email: undefined,
            ip: undefined,
            agent: undefined,
          },
          replies: doc.replies ? removeEmail(doc.replies as ICommentDocument[]) : [],
        } as CommentTreeDto
      })
    }
  }

  @Post('article/:id(\\w{24})')
  public async createArticleComment(
    @MongoIdParam('id') id: string, @Body() body: CommentCreateBodyDto,
      @AdminId() adminId: string | undefined,
      @Ip() ip: string,
      @Headers('user-agent') ua: string,
  ): Promise<ICommentSchema> {
    return this.commentService.create(adminId, {
      content: body.content, article: id, replyTo: body.reply,
      publisher: {
        ...body.publisher,
        ip,
        agent: ua,
      },
    })
  }
}
