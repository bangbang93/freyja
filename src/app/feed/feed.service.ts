/**
 * Created by bangbang93 on 2017/9/24.
 */
'use strict'
import {Injectable} from '@nestjs/common'
import {Feed} from 'feed'
import {Admin} from '../admin/admin.model'
import {ArticleService} from '../article/article.service'

@Injectable()
export class FeedService {
  constructor(
    private readonly articleService: ArticleService,
  ) {}

  async getFeed(baseUrl: string): Promise<string> {
    const feed = new Feed({
      feed: 'bangbang93.blog()',
      title: 'bangbang93.blog()',
      description: 'the blog of bangbang93',
      id: baseUrl,
      link: baseUrl,
      image: `${baseUrl}/favicon.ico`,
      favicon: `${baseUrl}/favicon.ico`,
      copyright: 'All rights reserved 2017, bangbang93',
      updated: new Date(),
      generator: 'Freyja',
      author: {
        name: 'bangbang93',
        email: 'bangbang93@163.com',
        link: 'https://blog.bangbang93.com',
      },
      feedLinks: {},
    })
    const articles = await this.articleService.listByPage(1)
    for (const article of articles) {
      await article.populate('author')
      feed.addItem({
        title: article.title,
        id: `${baseUrl}/article/${article._id}`,
        link: `${baseUrl}/article/${article._id}`,
        description: article.summary,
        content: article.html,
        author: [
          {
            name: (article.author as Admin)['username'],
            email: (article.author as Admin)['email'],
          },
        ],
        date: article.createdAt,
      })
    }

    return feed.rss2()
  }
}
