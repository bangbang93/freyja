/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const PageModel = require('../../model/page')
const MarkdownHelper = require('../../helper/markdown')
const htmlSubstring = require('../../lib/html-substring')

const SUMMARY_LENGTH = 200

exports.create = async function create({title, content, author, name, createdAt = new Date()}) {
  const summary = MarkdownHelper.render(content.substr(0, SUMMARY_LENGTH))
  const html = MarkdownHelper.render(content)
  return PageModel.create({title, content, author, createdAt, summary, html, name})
}

exports.list = async function list(lastId, limit = 20) {
  const list = await PageModel.list({lastId, limit})
  const promises = list.map(async (article) => article.populate('author').execPopulate())
  await Promise.all(promises)
  return list
}

exports.listByPage = async function listByPage(page = 1, limit = 20) {
  const skip = (page - 1) * 20
  const list = await PageModel.listByPage({skip, limit})
  const promises = list.map(async (article) => article.populate('author').execPopulate())
  await Promise.all(promises)
  return list
}

exports.getById = async function getById(id) {
  return PageModel.getById(id)
}

exports.update = async function update(id, newArticle) {
  const article = await PageModel.getById(id)
  if (!article) {
    throw new Error('no such article')
  }
  newArticle.summary = MarkdownHelper.render(htmlSubstring(newArticle.content, SUMMARY_LENGTH))
  newArticle.html = MarkdownHelper.render(newArticle.content)
  return article.update(newArticle)
}

exports.reRenderAll = async function reRenderAll() {
  let list = await PageModel.list({select: {}})
  while (list.length) {
    const promises = list.map(async (article) => {
      article.html = MarkdownHelper.render(article.content)
      article.summary = MarkdownHelper.render(htmlSubstring(article.content, SUMMARY_LENGTH))
      return article.save()
    })
    await Promise.all(promises)
    list = await PageModel.list({lastId: list.pop()._id, select: {}})
  }
}

exports.del = async function del(id) {
  return PageModel.del(id)
}

exports.count = async function count() {
  return PageModel.count()
}
