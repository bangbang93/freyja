import {Types} from 'mongoose'
import {
  array, DocumentType, getModel, id, Model, model, ModelType, ObjectId, prop, Ref, ref, required, RichModelType,
  statics, subModel,
} from 'mongoose-typescript'
import {Admin} from '../app/admin/admin.model'
import {Article} from '../app/article/article.model'

export interface ICommentSchema {
  _id: Types.ObjectId
  content: string
  html: string
  article: Ref<Article>
  publisher: CommentPublisher
  reply: Ref<Comment>
  replies: Ref<Comment>[]
  wordpress: CommentWordpress

  createdAt?: Date
  updatedAt?: Date
}

@subModel()
class CommentPublisher {
  @prop() public email!: string

  @prop() public name!: string

  @prop() public website!: string

  @prop() public hash!: string

  @prop() public ip!: string

  @prop() public agent!: string
}

@subModel()
class CommentWordpress {
  @prop() public id!: number

  @prop() public commentParent!: number
}

@model('comment', {timestamps: true})
export class Comment implements ICommentSchema {
  @id()
  public _id!: Types.ObjectId

  @prop() @required()
  public content!: string

  @prop() @required()
  public html!: string

  @prop() @ref(Article) @required()
  public article!: Ref<Article>

  @prop() @ref(() => Comment, ObjectId)
  public reply!: Ref<Comment>

  @array(ObjectId) @ref(() => Comment, [ObjectId])
  public replies!: Ref<Comment>[]

  @prop() @required()
  public publisher!: CommentPublisher

  @prop() @ref(Admin)
  public admin!: Ref<Admin>

  @prop()
  public wordpress!: CommentWordpress

  public createdAt!: Date

  public updatedAt!: Date

  @statics()
  public static async add(
    this: ICommentModel,
    comment: ICommentSchema,
    {article, reply}: { article: ObjectId; reply?: ObjectId },
  ): Promise<ICommentDocument> {
    if (!comment.article && article) {
      comment.article = article
    }
    if (!comment.reply && reply) {
      comment.reply = reply
    }
    if (!comment.createdAt) {
      comment.createdAt = new Date()
    }
    return this.create(comment)
  }

  @statics()
  public static async listByArticle(
    this: ICommentModel,
    articleId: ObjectId,
    {skip, limit}: { skip: number; limit: number },
  ): Promise<ICommentDocument[]> {
    return this.find({
      article: articleId,
      reply: null,
    })
      .select({content: 0})
      .sort({_id: -1})
      .skip(skip)
      .limit(limit)
  }

  @statics()
  public static async getByWordpress(this: ICommentModel, key: string,
    value: unknown): Promise<ICommentDocument | null> {
    return this.findOne({
      [`wordpress.${key}`]: value,
    })
  }

  @statics()
  public static async countByArticle(this: ICommentModel, articleId: ObjectId): Promise<number> {
    return this.count({
      article: articleId,
    })
  }

  @statics()
  public static async list(this: ICommentModel,
    {skip, limit}: {skip: number; limit: number}): Promise<ICommentDocument[]> {
    return this.find({})
      .sort({_id: -1})
      .skip(skip)
      .limit(limit)
  }

  @statics()
  public static async deleteById(this: ICommentModel, id: string) {
    return this.remove({
      _id: id,
    })
  }

  @statics()
  public static async addReply(this: ICommentModel, commentId: ObjectId, replyId: ObjectId) {
    return this.update({
      _id: commentId,
    }, {
      $push: {
        replies: replyId,
      },
    })
      .exec()
  }
}

export type ICommentDocument = DocumentType<Comment>
export type ICommentModel = RichModelType<typeof Comment>

export const CommentModel: ICommentModel = getModel(Comment)
