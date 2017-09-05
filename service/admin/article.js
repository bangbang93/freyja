/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict';
const ArticleModel = require('../../model/article')

exports.create = function ({title, content, tags, author, createdAt = new Date()}) {
  return ArticleModel.create({title, content, tags, author, createdAt});
}

exports.list = async function (lastId, limit = 20) {
  let list = await ArticleModel.list(lastId, limit)
  let promises = list.map((article) => article.populate('author').execPopulate())
  await Promise.all(promises)
  return list
}

exports.getById = function (id) {
  return ArticleModel.getById(id)
}

exports.update = async function (id, newArticle) {
  const article = await ArticleModel.getById(id)
  if (!article) {
    throw new Error('no such article')
  }
  return article.update(newArticle)
}

exports.del = async function (id) {
  return ArticleModel.del(id)
}
