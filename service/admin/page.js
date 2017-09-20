/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict';
const PageModel = require('../../model/page')
const MarkdownHelper = require('../../helper/markdown')
const htmlSubstring = require('../../lib/html-substring')

const SUMMARY_LENGTH = 200;

exports.create = function ({title, content, author, name, createdAt = new Date()}) {
  const summary = MarkdownHelper.render(content.substr(0, SUMMARY_LENGTH))
  const html = MarkdownHelper.render(content)
  return PageModel.create({title, content, author, createdAt, summary, html, name})
}

exports.list = async function (lastId, limit = 20) {
  let list = await PageModel.list({lastId, limit})
  let promises = list.map((article) => article.populate('author').execPopulate())
  await Promise.all(promises)
  return list
}

exports.listByPage = async function (page = 1, limit = 20) {
  const skip = (page - 1) * 20
  let list = await PageModel.listByPage({skip, limit})
  let promises = list.map((article) => article.populate('author').execPopulate())
  await Promise.all(promises)
  return list
}

exports.getById = function (id) {
  return PageModel.getById(id)
}

exports.update = async function (id, newArticle) {
  const article = await PageModel.getById(id)
  if (!article) {
    throw new Error('no such article')
  }
  newArticle.summary = MarkdownHelper.render(htmlSubstring(newArticle.content, SUMMARY_LENGTH))
  newArticle.html = MarkdownHelper.render(newArticle.content)
  return article.update(newArticle)
}

exports.reRenderAll = async function () {
  let list = await PageModel.list({select: {}})
  while (list.length) {
    const promises = list.map((article) => {
      article.html = MarkdownHelper.render(article.content)
      article.summary = MarkdownHelper.render(htmlSubstring(article.content, SUMMARY_LENGTH))
      return article.save()
    })
    await Promise.all(promises)
    list = await PageModel.list({lastId: list.pop()._id, select: {}})
  }
}

exports.del = async function (id) {
  return PageModel.del(id)
}

exports.count = function () {
  return PageModel.count()
}
