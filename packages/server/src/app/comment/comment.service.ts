import {IdType} from '@bangbang93/utils/mongodb'
import {InjectModel} from '@bangbang93/utils/nest-mongo'
import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common'
import {createHash} from 'crypto'
import {ObjectId} from 'mongoose-typescript'
import {AdminService} from '../admin/admin.service'
import {ArticleService} from '../article/article.service'
import {MailService} from '../util/mail.service'
import {MarkdownService} from '../util/markdown.service'
import {Comment, ICommentDocument, ICommentModel} from './comment.model'

interface ICreate {
  content: string
  publisher: {
    email: string
    name: string
    ip: string
    agent: string
  }
  article?: IdType
  replyTo?: IdType
}

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment) private readonly commentModel: ICommentModel,
    private readonly articleService: ArticleService,
    private readonly adminService: AdminService,
    private readonly mailService: MailService,
    private readonly markdownService: MarkdownService,
  ) {}

  public async create(admin: IdType | undefined, data: ICreate): Promise<ICommentDocument> {
    let replyComment: ICommentDocument | null = null
    if (data.replyTo) {
      replyComment = await this.commentModel.findById(data.replyTo)
      if (!replyComment) {
        throw new NotFoundException('replyTo comment not found')
      }
    }
    if (!data.article && replyComment) {
      data.article = replyComment.article as ObjectId
    }
    if (!data.article) {
      throw new NotFoundException('article not found')
    }
    const article = await this.articleService.getById(data.article)
    if (!article) {
      throw new NotFoundException('article not found')
    }
    const author = await this.adminService.getById(article.author as ObjectId)
    if (!author) throw new NotFoundException('author not found')
    if (author.email?.toLowerCase() === data.publisher.email.toLowerCase() && !admin) {
      throw new BadRequestException('cannot use author email')
    }
    const commentDoc = await this.commentModel.add({
      content: data.content,
      html: this.markdownService.renderComment(data.content),
      publisher: {
        ...data.publisher,
        hash: createHash('md5').update(data.publisher.email).digest('hex'),
      },
      article: article._id,
      reply: replyComment?._id,
    }, {article: article._id, reply: data.replyTo})
    if (replyComment) {
      await this.commentModel.addReply(replyComment._id, commentDoc._id)

      if (replyComment.publisher.email) {
        await this.mailService.commentReply({
          to: replyComment.publisher.email,
          article,
        })
      }
    }

    if (!data.replyTo) {
      await this.mailService.comment({article})
    }

    return commentDoc
  }

  public async listByArticle(article: IdType, page: number, limit: number): Promise<ICommentDocument[]> {
    const skip = (page - 1) * limit
    const list = await this.commentModel.listByArticle(article, {skip, limit})
    return walkComments(list)
    async function walkComments(comments: ICommentDocument[]): Promise<ICommentDocument[]> {
      for (const comment of comments) {
        if (comment.replies) {
          await comment.populate('replies')
          await walkComments(comment.replies as ICommentDocument[])
        }
      }
      return comments
    }
  }

  public async list(page: number, limit: number): Promise<ICommentDocument[]> {
    const skip = (page - 1) * limit
    return this.commentModel.list({skip, limit})
  }

  public async delete(id: IdType): Promise<void> {
    await this.commentModel.deleteOne({_id: id})
  }
}
