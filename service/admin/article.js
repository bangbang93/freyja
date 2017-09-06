/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict';
const ArticleModel = require('../../model/article')
const SummarizeMarkdown = require('summarize-markdown')

exports.create = function ({title, content, tags, author, createdAt = new Date()}) {
  const summary = SummarizeMarkdown(content).substr(0, 200)
  return ArticleModel.create({title, content, tags, author, createdAt, summary})
}

exports.list = async function (lastId, limit = 20) {
  let list = await ArticleModel.list(lastId, limit)
  let promises = list.map((article) => article.populate('author').execPopulate())
  await Promise.all(promises)
  return list
}

exports.listByPage = async function (page = 1, limit = 20) {
  const skip = (page - 1) * 20
  let list = await ArticleModel.listByPage({skip, limit})
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
  newArticle.summary = SummarizeMarkdown(newArticle.content).substr(0, 200)
  return article.update(newArticle)
}

exports.del = async function (id) {
  return ArticleModel.del(id)
}

exports.count = function () {
  return ArticleModel.count()
}
