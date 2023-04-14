import {getModelToken} from '@nestjs/mongoose'
import {MeiliSearch} from 'meilisearch'
import {getModelName} from 'mongoose-typescript'
import {Article, IArticleModel} from '../app/article/article.model'
import {MigrateArguments} from '../script/migrate'

export async function up(args: MigrateArguments): Promise<void> {
  const app = args.context.app

  const articleModel = app.get<IArticleModel>(getModelToken(getModelName(Article)))
  const meilisearch = app.get(MeiliSearch)

  const task = await meilisearch.createIndex('article')
  await meilisearch.waitForTask(task.taskUid)

  const index = await meilisearch.getIndex('article')
  await index.updateSettings({
    searchableAttributes: [
      'content', 'summary', 'title',
    ],
    sortableAttributes: [
      'createdAt',
    ],
  })


  const articles = articleModel.find().lean().cursor()

  const docs = []
  for await (const article of articles) {
    docs.push({
      ...article,
      createdAt: article.createdAt.getTime(),
    })

    if (docs.length >= 1000) {
      await index.addDocuments(docs)
      docs.length = 0
    }
  }
  if (docs.length > 0) {
    await index.addDocuments(docs)
  }
}

export async function down(args: MigrateArguments): Promise<void> {
  const app = args.context.app

  const meilisearch = app.get(MeiliSearch)

  await meilisearch.deleteIndex('article')
}
