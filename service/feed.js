/**
 * Created by bangbang93 on 2017/9/24.
 */
'use strict';
const Feed = require('feed')
const ArticleModel = require('../model/article').ArticleModel

exports.getFeed = async function (baseUrl) {
  const feed = new Feed({
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
    }
  })
  const articles = await ArticleModel.listByPage({page: 1})
  for(const article of articles) {
    article.populate('author')
    await article.execPopulate()
    feed.addItem({
      title: article.title,
      id: `${baseUrl}/article/${article._id}`,
      link: `${baseUrl}/article/${article._id}`,
      description: article.summary,
      content: article.html,
      author: article.author,
      date: article.createdAt,
    })
  }

  return feed.rss2()
}
