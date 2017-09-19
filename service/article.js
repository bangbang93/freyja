/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict';
const ArticleModel = require('../model/article')
const CommentModel = require('../model/comment')
const nurl = require('url')

exports.getById = function (id) {
  return ArticleModel.getById(id)
}

exports.list = async function (page, limit = 20) {
  const skip = (page - 1) * limit
  const list = await ArticleModel.listByPage({skip, limit})
  return Promise.all(list.map(async (article) => {
    article = article.toJSON()
    article.commentCount = await CommentModel.countByArticle(article._id)
    return article
  }))
}

exports.getByWordpress = function ({id, postName, guid}) {
  if (id) {
    return ArticleModel.getByWordpress({id})
  }
  if (postName) {
    console.log(postName)
    return ArticleModel.getByWordpress({postName: encodeURIComponent(postName).toLowerCase()})
  }
  if (guid) {
    const url = nurl.parse(guid)
    return ArticleModel.getByWordpress({guid: new RegExp(url.path)})
  }
}
