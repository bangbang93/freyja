import {Schema, Types} from 'mongoose'
import {
  array, DocumentType, getModel, id, Model, model, ModelType, prop, Ref, ref, statics, subModel,
} from 'mongoose-typescript'
import {Admin} from './admin'
import {Article} from './article'

export interface ICommentSchema {
  _id: Types.ObjectId
  content: string
  html: string
  article: Ref<Article>
  publisher: CommentPublisher
  reply: Ref<Comment>
  replies: Array<Ref<Comment>>
  wordpress: CommentWordpress

  createdAt?: Date
  updatedAt?: Date
}

@subModel()
class CommentPublisher {
  @prop() public email: string
  @prop() public name: string
  @prop() public website: string
  @prop() public hash: string
  @prop() public ip: string
  @prop() public agent: string
}

@subModel()
class CommentWordpress {
  @prop() public id: number
  @prop() public commentParent: number
}

@model('comment', {timestamps: true})
export class Comment extends Model<Comment> implements ICommentSchema {

  @statics
  public static async add(comment, {article, reply}): Promise<ICommentDocument> {
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

  @statics
  public static async listByArticle(articleId, {skip, limit}): Promise<ICommentDocument[]> {
    return this.find({
      article: articleId,
      reply: null,
    })
      .select({content: 0})
      .sort({_id: -1})
      .skip(skip)
      .limit(limit)
  }

  @statics
  public static async getByWordpress(key, value): Promise<ICommentDocument> {
    return this.findOne({
      [`wordpress.${key}`]: value,
    })
  }

  @statics
  public static async countByArticle(articleId): Promise<number> {
    return this.count({
      article: articleId,
    })
  }

  @statics
  public static async list({skip, limit}): Promise<ICommentDocument[]> {
    return this.find({})
      .sort({_id: -1})
      .skip(skip)
      .limit(limit)
  }

  @statics
  public static async deleteById(id: string) {
    return this.remove({
      _id: id,
    })
  }

  @statics
  public static async addReply(commentId, replyId) {
    return this.update({
      _id: commentId,
    }, {
      $push: {
        replies: replyId,
      },
    })
      .exec()
  }

  @id
  public _id: Types.ObjectId
  @prop()
  public content: string
  @prop()
  public html: string
  @prop() @ref(Article)
  public article: Ref<Article>
  @prop(Schema.Types.ObjectId) @ref('comment')
  public reply: Ref<Comment>
  @array(Schema.Types.ObjectId) @ref('comment')
  public replies: Array<Ref<Comment>>
  @prop()
  public publisher: CommentPublisher
  @prop() @ref(Admin)
  public admin: Ref<Admin>
  @prop()
  public wordpress: CommentWordpress

  public createdAt: Date
  public updatedAt: Date

}

export type ICommentDocument = DocumentType<Comment>
export type ICommentModel = ModelType<Comment> & typeof Comment

export const CommentModel: ICommentModel = getModel(Comment)
