/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict';
const ArticleModel = require('../../model/article')
const MarkdownHelper = require('../../helper/markdown')

const SUMMARY_LENGTH = 1000;

exports.create = function ({title, content, tags, author, createdAt = new Date()}) {
  const summary = MarkdownHelper.render(content.substr(0, SUMMARY_LENGTH))
  const html = MarkdownHelper.render(content)
  return ArticleModel.create({title, content, tags, author, createdAt, summary, html})
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
  newArticle.summary = MarkdownHelper.render(newArticle.content.substr(0, SUMMARY_LENGTH))
  newArticle.html = MarkdownHelper.render(newArticle.content)
  return article.update(newArticle)
}

exports.reRenderAll = async function () {
  let list = await ArticleModel.list({select: {}})
  while (list.length) {
    const promises = list.map((article) => {
      article.html = MarkdownHelper.render(article.content)
      article.summary = MarkdownHelper.render(article.content.substr(0, SUMMARY_LENGTH))
      return article.save()
    })
    await Promise.all(promises)
    list = await ArticleModel.list({lastId: list.pop()._id, select: {}})
  }
}

exports.del = async function (id) {
  return ArticleModel.del(id)
}

exports.count = function () {
  return ArticleModel.count()
}
