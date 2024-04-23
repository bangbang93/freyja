import {IdType} from '@bangbang93/utils/mongodb'
import {
  array, DocumentType, getModel, id, model, ObjectId, prop, Ref, ref, refArray, required, RichModelType, statics,
  subModel,
  unique,
} from 'mongoose-typescript'
import {Admin} from '../admin/admin.model'
import {Attachment} from '../attachment/attachment.model'
import {Category} from '../category/category.model'

export interface IArticleSchema {
  _id: ObjectId
  slug: string
  title: string
  content: string
  html: string
  summary: string
  categories: Ref<Category>[]
  tags: string[]
  author: Ref<Admin>
  createdAt: Date
  attachments: Ref<Attachment>[]
  wordpress?: ArticleWordpress
}

@subModel()
export class ArticleWordpress {
  @prop() public postName!: string
  @prop() public id!: number
  @prop() public guid!: string
}

@model('article', {timestamps: true})
export class Article implements IArticleSchema {
  @id() public _id!: ObjectId
  @prop() @required() @unique() public slug!: string
  @prop() @required() public title!: string
  @prop() @required() public content!: string
  @prop() @required() public html!: string
  @prop() @required() public summary!: string
  @refArray(Category, ObjectId) public categories!: Ref<Category>[]
  @array(String) public tags!: string[]
  @prop() @ref(Admin) public author!: Ref<Admin>
  @refArray(Attachment, ObjectId) public attachments!: Ref<Attachment>[]
  @prop() public wordpress?: ArticleWordpress

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
    await this.deleteOne({_id: id})
  }

  @statics()
  public static async getByWordpress(this: IArticleModel, key: string | Record<string, unknown>,
    value?: unknown): Promise<IArticleDocument | null> {
    if (typeof key === 'object') {
      const keys = Object.keys(key)
      value = key[keys[0]]
      key = keys[0]
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
}

export type IArticleDocument = DocumentType<Article>
export type IArticleModel = RichModelType<typeof Article>

export const ArticleModel: IArticleModel = getModel(Article)
