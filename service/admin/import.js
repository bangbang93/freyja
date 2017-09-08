/**
 * Created by bangbang93 on 2017/9/8.
 */
'use strict';
const ArticleModel = require('../../model/article')
const AttachmentModel = require('../../model/attachment')
const Knex = require('knex')
const MarkdownHelper = require('../../helper/markdown')
const path = require('path')
const url = require('url')
const fs = require('fs-extra')
const rp = require('request-promise')
const Bluebird = require('bluebird')
const publicPath = path.join(__dirname, '../../public')


exports.wordpress = async function ({host, user, password, database, port, prefix = 'wp_'}, userId) {
  const knex = new Knex({
    client: 'mysql2',
    connection: {
      host,
      user,
      password,
      database,
      port,
    }
  })
  let posts = await knex(`${prefix}posts`)
    .where({
      post_status: 'publish',
      post_type: 'post',
    })
  const articles = posts.map((post) => ({
    title: post['post_title'],
    content: post['post_content'],
    html: MarkdownHelper.render(post['post_content']),
    summary: MarkdownHelper.render(post['post_content'].substr(0, 200)),
    tags: [],
    author: userId,
    createdAt: new Date(post['post_date']),
    attachments: [],
    wordpress: {
      postName: post['post_name'],
      id: post['id'],
    }
  }))
  await ArticleModel._Model.create(articles)

  posts = await knex(`${prefix}posts`)
    .where({
      post_type: 'attachment',
    })

  const attachments = posts.map((post) => ({
    filename: path.basename(post['guid']),
    path: url.parse(post['guid']).path,
    mimeType: post['post_mime_type'],
    createdAt: post['post_date'],
  }))
  await AttachmentModel._Model.create(attachments)

  await Bluebird.each(posts, async(post) => {
    const resp = await rp(post['guid'], {encoding: null})
    const filepath = path.join(publicPath, url.parse(post['guid']).path)
    await fs.outputFile(filepath, resp)
  })

  return {
    articles: articles.length,
    attachments: attachments.length,
  }
}


function decodePostName(postName, title) {
  try {
    return decodeURIComponent(postName)
  } catch (e) {
    return title
  }
}
