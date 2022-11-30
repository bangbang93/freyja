import {IdType} from '@bangbang93/utils/mongodb'
import {
  array, DocumentType, getModel, id, index, model, ModelType, ObjectId, prop, Ref, ref, RichModelType, statics,
  subModel,
} from 'mongoose-typescript'
import {Admin} from '../admin/admin.model'
import {Attachment} from '../attachment/attachment.model'
import {Category} from '../category/category.model'

export interface IArticleSchema {
  _id: ObjectId
  title: string
  content: string
  html: string
  summary: string
  categories: Ref<Category>[]
  tags: string[]
  author: Ref<Admin>
  createdAt: Date
  attachments: Ref<Attachment>[]
  wordpress: ArticleWordpress
  slug: string
}

@subModel()
export class ArticleWordpress {
  @prop() public postName!: string
  @prop() public id!: number
  @prop() public guid!: string
}

@model('article', {timestamps: true})
// eslint-disable-next-line camelcase
@index({content: 'text'}, {default_language: 'ngram'})
export class Article implements IArticleSchema {
  @id() public _id!: ObjectId
  @prop() public title!: string
  @prop() public content!: string
  @prop() public html!: string
  @prop() public summary!: string
  @array() @ref(Category) public categories!: Ref<Category>[]
  @array(String) public tags!: string[]
  @prop() @ref(Admin) public author!: Ref<Admin>
  @array() @ref(Attachment) public attachments!: Ref<Attachment>[]
  @prop() public wordpress!: ArticleWordpress
  @prop() public slug!: string

  public createdAt!: Date

  public updatedAt!: Date

  @statics()
  public static async list(
    this: IArticleModel,
    {lastId, limit = 20, select = {content: 0, html: 0}}:
    {lastId?: ObjectId; limit?: number; select?: Record<string, number>},
  ): Promise<IArticleDocument[]> {
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

  @statics()
  public static async listByPage(
    this: IArticleModel,
    {skip = 0, page = 1, limit = 20}: {skip?: number; page?: number; limit?: number},
  ): Promise<IArticleDocument[]> {
    if (!skip) {
      skip = (page - 1) * limit
    }
    return this.find({})
      .select({content: 0, html: 0})
      .sort({_id: -1})
      .skip(skip)
      .limit(limit)
  }

  @statics()
  public static async del(
    this: IArticleModel,
    id: ObjectId,
  ): Promise<void> {
    await this.remove({_id: id})
  }

  @statics()
  public static async getByWordpress(this: IArticleModel, key: string | Record<string, unknown>,
    value?: unknown): Promise<IArticleDocument | null> {
    if (arguments.length === 1) {
      const keys = Object.keys(key as Record<string, unknown>)
      value = (key as Record<string, unknown>)[keys[0]]
    }
    return this.findOne({
      [`wordpress.${key}`]: value,
    })
  }

  @statics()
  public static async findByTag(
    this: IArticleModel,
    {tag, skip = 0, limit = 20}: {tag: string; skip?: number; limit?: number},
  ): Promise<IArticleDocument[]> {
    return this.find({
      tags: tag,
    })
      .skip(skip)
      .limit(limit)
      .exec()
  }

  @statics()
  public static async findByCategoryId(
    this: IArticleModel,
    {categoryId, skip, limit}: {categoryId: IdType; skip: number; limit: number},
  ): Promise<IArticleDocument[]> {
    return this.find({
      category: categoryId,
    })
      .skip(skip)
      .limit(limit)
  }

  @statics()
  public static async search(this: IArticleModel, keyword: string, skip: number,
    limit: number): Promise<IArticleDocument[]> {
    return this.find({
      $text: {
        $search: keyword,
      },
    })
      .sort({_id: -1})
      .skip(skip)
      .limit(limit)
  }
}

export type IArticleDocument = DocumentType<Article>
export type IArticleModel = RichModelType<typeof Article>

export const ArticleModel: IArticleModel = getModel(Article)
