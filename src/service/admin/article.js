/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const {ArticleModel} = require('../../model/article')
const MarkdownHelper = require('../../helper/markdown')
const htmlSubstring = require('../../lib/html-substring')

const SUMMARY_LENGTH = 200

exports.create = async function create({title, content, tags, author, createdAt = new Date()}) {
  const html = MarkdownHelper.render(content)
  const summary = htmlSubstring(html, SUMMARY_LENGTH)
  return ArticleModel.create({title, content, tags, author, createdAt, summary, html})
}

exports.list = async function list(lastId, limit = 20) {
  const list = await ArticleModel.list({lastId, limit})
  const promises = list.map(async (article) => article.populate('author').execPopulate())
  await Promise.all(promises)
  return list
}

exports.listByPage = async function listByPage(page = 1, limit = 20) {
  const skip = (page - 1) * 20
  const list = await ArticleModel.listByPage({skip, limit})
  const promises = list.map(async (article) => article.populate('author').execPopulate())
  await Promise.all(promises)
  return list
}

exports.getById = async function getById(id) {
  return ArticleModel.findById(id)
}

exports.update = async function update(id, newArticle) {
  const article = await ArticleModel.findById(id)
  if (!article) {
    throw new Error('no such article')
  }
  newArticle.html = MarkdownHelper.render(newArticle.content)
  newArticle.summary = htmlSubstring(newArticle.html, SUMMARY_LENGTH)
  return article.update(newArticle)
}

exports.reRenderAll = async function reRenderAll() {
  let list = await ArticleModel.list({select: {}})
  while (list.length) {
    const promises = list.map(async (article) => {
      article.html = MarkdownHelper.render(article.content)
      article.summary = htmlSubstring(article.html, SUMMARY_LENGTH)
      return article.save()
    })
    await Promise.all(promises)
    list = await ArticleModel.list({lastId: list.pop()._id, select: {}})
  }
}

exports.del = async function del(id) {
  return ArticleModel.del(id)
}

exports.count = function count() {
  return ArticleModel.count()
}
