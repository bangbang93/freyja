import {IdType} from '@bangbang93/utils/mongodb'
import {Injectable} from '@nestjs/common'
import {Index, MeiliSearch, SearchResponse} from 'meilisearch'
import {IArticleSchema} from '../article/article.model'

@Injectable()
export class ArticleSearchService {
  private readonly index: Index
  constructor(
    private readonly meilisearch: MeiliSearch,
  ) {
    this.index = this.meilisearch.index<IArticleSchema>('article')
  }

  public async search(keyword: string, skip : number, limit: number): Promise<SearchResponse<IArticleSchema>> {
    return await this.index.search(keyword, {
      offset: skip, limit,
      sort: [
        'createdAt:desc',
      ],
    })
  }

  public async add(article: IArticleSchema): Promise<void> {
    const task = await this.index.addDocuments([{
      ...article,
      createdAt: article.createdAt.getTime(),
    }])
    await this.index.waitForTask(task.taskUid)
  }

  public async update(article: IArticleSchema): Promise<void> {
    const task = await this.index.updateDocuments([{
      ...article,
      createdAt: article.createdAt.getTime(),
    }])
    await this.index.waitForTask(task.taskUid)
  }

  public async delete(articleId: IdType): Promise<void> {
    const task = await this.index.deleteDocument(articleId.toString())
    await this.index.waitForTask(task.taskUid)
  }
}
