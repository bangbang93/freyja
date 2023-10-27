import {IdType} from '@bangbang93/utils/mongodb'
import {InjectModel} from '@bangbang93/utils/nest-mongo'
import {Injectable, NotFoundException} from '@nestjs/common'
import {MarkdownService} from '../util/markdown.service'
import {IPageDocument, IPageModel, IPageSchema, Page} from './page.model'

interface ICreate {
  title: string
  content: string
  author: IdType
  name: string
}

interface IUpdate {
  title: string
  content: string
  name: string
}

@Injectable()
export class PageService {
  constructor(
    @InjectModel(Page) private readonly pageModel: IPageModel,
    private readonly markdownService: MarkdownService,
  ) {}

  public async create(data: ICreate): Promise<IPageSchema> {
    const html = this.markdownService.render(data.content)
    return this.pageModel.create({
      ...data,
      html,
    })
  }

  public async list(lastId: IdType, limit: number): Promise<IPageDocument[]> {
    let query
    if (!lastId) {
      query = this.pageModel.find({})
    } else {
      query = this.pageModel.find({
        _id: {
          $gt: lastId,
        },
      })
    }
    return query.sort({_id: -1})
      .select({content: 0, html: 0})
      .populate('author')
      .limit(limit)
      .exec()
  }

  public async listByPage(page: number, limit: number): Promise<IPageDocument[]> {
    const skip = (page - 1) * limit
    return this.pageModel.find({})
      .select({content: 0, html: 0})
      .populate('author')
      .sort({_id: -1})
      .skip(skip)
      .limit(limit)
      .exec()
  }

  public async getById(id: IdType): Promise<IPageDocument | null> {
    return this.pageModel.findById(id)
  }

  public async getByName(name: string): Promise<IPageDocument | null> {
    return this.pageModel.findOne({name})
  }

  public async update(id: IdType, update: IUpdate): Promise<IPageDocument> {
    const page = await this.pageModel.findById(id)
    if (!page) {
      throw new NotFoundException('page not found')
    }
    const html = this.markdownService.render(update.content)
    page.title = update.title
    page.content = update.content
    page.name = update.name
    page.html = html
    return page.save()
  }

  public async renderAll(): Promise<void> {
    const pages = this.pageModel.find()
    for await (const page of pages) {
      page.html = this.markdownService.render(page.content)
      await page.save()
    }
  }

  public async delete(id: IdType): Promise<void> {
    await this.pageModel.deleteOne({_id: id})
  }

  public async count(): Promise<number> {
    return this.pageModel.countDocuments()
  }
}
