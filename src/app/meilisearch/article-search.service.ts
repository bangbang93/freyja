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
    return this.index.search(keyword, {
      offset: skip, limit,
    })
  }

  public async add(article: IArticleSchema): Promise<void> {
    await this.index.addDocuments([{
      id: article._id,
      ...article,
    }])
  }

  public async update(article: IArticleSchema): Promise<void> {
    await this.index.updateDocuments([{
      id: article._id,
      ...article,
    }])
  }

  public async delete(articleId: IdType): Promise<void> {
    await this.index.deleteDocument(articleId.toString())
  }
}
