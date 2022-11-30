import {Paged} from '@bangbang93/utils'
import {findAndCount, IdType} from '@bangbang93/utils/mongodb'
import {InjectModel} from '@bangbang93/utils/nest-mongo'
import {Injectable, NotFoundException} from '@nestjs/common'
import Bluebird from 'bluebird'
import {ObjectId} from 'mongoose-typescript'
import {CategoryModel} from '../../model/category'
import {CommentModel} from '../../model/comment'
import {Article, IArticleDocument, IArticleModel, IArticleSchema} from './article.model'

interface IArticleListItem extends IArticleSchema {
  commentCount: number
}

interface IArticleWordpressOptions {
  id?: number
  postName?: number
  guid?: string
}

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article) private readonly articleModel: IArticleModel,
  ) {}

  public async getById(id: IdType): Promise<IArticleDocument | null> {
    return this.articleModel.findById(id)
  }

  public async list(page: number, limit = 20): Promise<IArticleListItem[]> {
    const skip = (page - 1) * limit
    const articles = await this.articleModel.listByPage({skip, limit})
    return Bluebird.map(articles, async (article) => {
      return {
        ...article.toJSON(),
        categories: article.categories as ObjectId[],
        author: article.author as ObjectId,
        attachments: article.attachments as ObjectId[],
        commentCount: await CommentModel.countByArticle(article._id),
      } as IArticleListItem
    })
  }

  public async getByWordpress(options: IArticleWordpressOptions): Promise<IArticleDocument | null> {
    if (options.id) {
      return this.articleModel.getByWordpress({id: options.id})
    }
    if (options.postName) {
      return this.articleModel.getByWordpress('postName', encodeURIComponent(options.postName).toLowerCase())
    }
    if (options.guid) {
      const url = new URL(options.guid)
      return this.articleModel.getByWordpress('guid', new RegExp(url.pathname))
    }
    return null
  }

  public async findByTag(tag: string, page: number, limit = 20): Promise<IArticleDocument[]> {
    const skip = (page - 1) * limit
    return this.articleModel.findByTag({tag, skip, limit})
  }

  public async findByCategory(categoryName: string, page: number, limit = 20): Promise<IArticleDocument[]> {
    const skip = (page - 1) * limit
    const category = await CategoryModel.getByName(categoryName)
    if (!category) {
      throw new NotFoundException('category not found')
    }
    return this.findByCategoryId(category._id, page, limit)
  }

  public async findByCategoryId(categoryId: IdType, page: number, limit = 20): Promise<IArticleDocument[]> {
    const skip = (page - 1) * limit
    return this.articleModel.findByCategoryId({categoryId, skip, limit})
  }

  public async search(keyword: string, page: number, limit = 20): Promise<IArticleDocument[]> {
    const skip = (page - 1) * limit
    return this.articleModel.search(keyword, skip, limit)
  }
}
