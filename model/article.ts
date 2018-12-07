import {Types} from 'mongoose'
import {
  array, DocumentType, getModel, id, model, Model, ModelType, prop, ref, Ref, statics, subModel,
} from 'mongoose-typescript'
import {Admin} from './admin'
import {Attachment} from './attachment'
import {Category} from './category'

export interface IArticleSchema {
  _id: Types.ObjectId
  title: string,
  content: string,
  html: string,
  summary: string,
  categories: Array<Ref<Category>>,
  tags: string[],
  author: Ref<Admin>,
  createdAt: Date,
  attachments: Array<Ref<Attachment>>,
  wordpress: ArticleWordpress
}

@subModel()
export class ArticleWordpress {
  @prop() public postName: string
  @prop() public id: number
  @prop() public guid: string
}

@model('article', {timestamps: true})
export class Article extends Model<Article> implements IArticleSchema {

  @statics
  public static async list({lastId, limit = 20, select = {content: 0, html: 0}}): Promise<IArticleDocument[]> {
    let query
    if (!lastId) {
      query = this.find({})
    } else {
      query = this.find({
        _id: {
          $gt: lastId,
        },
      })
    }
    return query.sort({_id: -1})
      .select(select)
      .limit(limit)
  }

  @statics
  public static async listByPage({skip = 0, page = 1, limit = 20}): Promise<IArticleDocument[]> {
    if (!skip) {
      skip = (page - 1) * limit
    }
    return this.find({})
      .select({content: 0, html: 0})
      .sort({_id: -1})
      .skip(skip)
      .limit(limit)
  }

  @statics
  public static async del(id): Promise<void> {
    return this.remove({_id: id})
  }

  @statics
  public static async getByWordpress(key, value): Promise<IArticleDocument> {
    if (arguments.length === 1) {
      [key] = Object.keys(key)
      value = arguments[0][key]
    }
    return this.findOne({
      [`wordpress.${key}`]: value,
    })
  }

  @statics
  public static async findByTag({tag, skip = 0, limit = 20}): Promise<IArticleDocument[]> {
    return this.find({
      tags: tag,
    })
      .skip(skip)
      .limit(limit)
      .exec()
  }

  @statics
  public static async findByCategoryId({categoryId, skip, limit}): Promise<IArticleDocument[]> {
    return this.find({
      category: categoryId,
    })
      .skip(skip)
      .limit(limit)
  }

  @statics
  public static async search(keyword, skip, limit): Promise<IArticleDocument[]> {
    return this.find({
      $text: {
        $search: keyword,
      },
    })
      .skip(skip)
      .limit(limit)
  }

  @id
  public _id: Types.ObjectId
  @prop()
  public title: string
  @prop({index: 'text'})
  public content: string
  @prop()
  public html: string
  @prop()
  public summary: string
  @array() @ref(Category)
  public categories: Array<Ref<Category>>
  @array(String)
  public tags: string[]
  @prop() @ref(Admin)
  public author: Ref<Admin>
  @array() @ref(Attachment)
  public attachments: Array<Ref<Attachment>>
  @prop()
  public wordpress: ArticleWordpress

  public createdAt: Date
  public updatedAt: Date
}

export type IArticleDocument = DocumentType<Article>
export type IArticleModel = ModelType<Article> & typeof Article

export const ArticleModel: IArticleModel = getModel(Article)
