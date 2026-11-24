import {IdType} from '@bangbang93/utils/mongodb'
import {InjectModel} from '@bangbang93/utils/nest-mongo'
import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common'
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
  private readonly logger = new Logger(CommentService.name)

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
    if (replyComment && String(replyComment.article as ObjectId) !== String(article._id)) {
      throw new BadRequestException('reply does not belong to this article')
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
        await this.sendMail(() => this.mailService.commentReply({
          to: replyComment.publisher.email as string,
          article,
        }))
      }
    }

    if (!data.replyTo) {
      await this.sendMail(() => this.mailService.comment(article, author))
    }

    return commentDoc
  }

  public async listByArticle(article: IdType, page: number, limit: number): Promise<ICommentDocument[]> {
    const skip = (page - 1) * limit
    const list = await this.commentModel.listByArticle(article, {skip, limit})
    return await walkComments(list)
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
    return await this.commentModel.list({skip, limit})
  }

  public async delete(id: IdType): Promise<void> {
    const comment = await this.commentModel.findById(id)
    if (!comment) return
    // 删除整棵回复子树，并从父评论的 replies 中移除引用，避免留下不可见但被计数的孤儿
    const ids = await this.collectDescendants([comment._id])
    await this.commentModel.deleteMany({_id: {$in: ids}})
    await this.commentModel.updateMany({replies: comment._id}, {$pull: {replies: comment._id}})
  }

  // 评论文档已落库，通知邮件失败不应让接口报错（客户端重试会产生重复评论）
  private async sendMail(op: () => Promise<unknown>): Promise<void> {
    try {
      await op()
    } catch (err) {
      this.logger.warn(`comment notify mail failed: ${(err as Error).message}`)
    }
  }

  private async collectDescendants(ids: ObjectId[]): Promise<ObjectId[]> {
    const children = await this.commentModel.find({reply: {$in: ids}}).select({_id: 1})
    if (!children.length) return ids
    const childIds = children.map((child) => child._id)
    return [...ids, ...await this.collectDescendants(childIds)]
  }
}
