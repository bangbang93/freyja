/**
 * Created by bangbang93 on 2017/9/24.
 */
'use strict'
import {Feed} from 'feed'
import {ArticleModel} from '../model/article'

export const FeedService = {
  async getFeed(baseUrl: string) {
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
    const articles = await ArticleModel.listByPage({page: 1})
    for (const article of articles) {
      article.populate('author')
      await article.execPopulate()
      feed.addItem({
        title: article.title,
        id: `${baseUrl}/article/${article._id}`,
        link: `${baseUrl}/article/${article._id}`,
        description: article.summary,
        content: article.html,
        author: [
          {
            name: article.author['username'],
            email: article.author['email'],
          },
        ],
        date: article.createdAt,
      })
    }

    return feed.rss2()
  },
}
