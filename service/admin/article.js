/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict';
const ArticleModel = require('../../model/article')
const MarkdownHelper = require('../../helper/markdown')
const htmlSubstring = require('../../lib/html-substring')

const SUMMARY_LENGTH = 200;

exports.create = function ({title, content, tags, author, createdAt = new Date()}) {
  const html = MarkdownHelper.render(content)
  const summary = htmlSubstring(html, SUMMARY_LENGTH)
  return ArticleModel.create({title, content, tags, author, createdAt, summary, html})
}

exports.list = async function (lastId, limit = 20) {
  let list = await ArticleModel.list({lastId, limit})
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
  newArticle.html = MarkdownHelper.render(newArticle.content)
  newArticle.summary = htmlSubstring(newArticle.html, SUMMARY_LENGTH)
  return article.update(newArticle)
}

exports.reRenderAll = async function () {
  let list = await ArticleModel.list({select: {}})
  while (list.length) {
    const promises = list.map((article) => {
      article.html = MarkdownHelper.render(article.content)
      article.summary = htmlSubstring(article.html, SUMMARY_LENGTH)
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
