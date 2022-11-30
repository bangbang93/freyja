import {IdType} from '@bangbang93/utils/mongodb'
import {InjectModel} from '@bangbang93/utils/nest-mongo'
import {Injectable, NotFoundException} from '@nestjs/common'
import Bluebird from 'bluebird'
import htmlSubstring from 'html-substring'
import {ObjectId} from 'mongoose-typescript'
import {render} from '../../helper/markdown'
import {CategoryModel} from '../category/category.model'
import {CommentModel} from '../comment/comment.model'
import {Article, IArticleDocument, IArticleModel, IArticleSchema} from './article.model'

interface IArticleListItem extends IArticleSchema {
  commentCount: number
}

interface IArticleWordpressOptions {
  id?: number
  postName?: number
  guid?: string
}

interface ICreate {
  author: IdType
  title: string
  content: string
  tags: string[]
}

interface IUpdate {
  title: string
  content: string
  tags: string[]
}

const SUMMARY_LENGTH = 200

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article) private readonly articleModel: IArticleModel,
  ) {}

  public async create(data: ICreate): Promise<IArticleDocument> {
    const html = render(data.content)
    const summary = htmlSubstring(html, SUMMARY_LENGTH)
    return this.articleModel.create({
      title: data.title, content: data.content, tags: data.tags, author: data.author, summary, html,
    })
  }

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

  public async listByPage(page: number, limit = 20): Promise<IArticleDocument[]> {
    const skip = (page - 1) * limit
    const articles = await this.articleModel.listByPage({skip, limit})
    return Bluebird.map(articles, async (article) => article.populate('author'))
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

  public async update(id: IdType, data: IUpdate): Promise<IArticleDocument> {
    const article = await this.articleModel.findById(id)
    if (!article) throw new NotFoundException('article not found')
    const html = render(data.content)
    const summary = htmlSubstring(html, SUMMARY_LENGTH)
    article.html = html
    article.summary = summary
    return article.save()
  }

  public async delete(id: IdType): Promise<void> {
    await this.articleModel.deleteOne({_id: id})
  }

  public async count(): Promise<number> {
    return this.articleModel.countDocuments()
  }

  public async renderAll(): Promise<void> {
    const articles = this.articleModel.find().cursor()
    for await (const article of articles) {
      const html = render(article.content)
      const summary = htmlSubstring(html, SUMMARY_LENGTH)
      article.html = html
      article.summary = summary
      await article.save()
    }
  }
}
