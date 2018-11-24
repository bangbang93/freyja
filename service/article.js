/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict'
const ArticleModel = require('../model/article').ArticleModel
const {CommentModel} = require('../model/comment')
const {CategoryModel} = require('../model/category')
const nurl = require('url')
const createHttpError = require('http-errors')

exports.getById = (id) => ArticleModel.findById(id)

exports.list = async (page, limit = 20) => {
  const skip = (page - 1) * limit
  const list = await ArticleModel.listByPage({skip, limit})
  return Promise.all(list.map(async (article) => {
    article = article.toJSON()
    article.commentCount = await CommentModel.countByArticle(article._id)
    return article
  }))
}

exports.getByWordpress = ({id, postName, guid}) => {
  if (id) {
    return ArticleModel.getByWordpress({id})
  }
  if (postName) {
    return ArticleModel.getByWordpress('postName', encodeURIComponent(postName)
        .toLowerCase())
  }
  if (guid) {
    const url = nurl.parse(guid)
    return ArticleModel.getByWordpress('guid', new RegExp(url.path))
  }
}

exports.findByTag = (tag, page, limit) => {
  const skip = (page - 1) * limit
  return ArticleModel.findByTag({tag, skip, limit})
}

exports.findByCategory = async (category, page, limit) => {
  const skip = (page - 1) * limit

  category = await CategoryModel.getByName(category)
  if (!category) {
    throw createHttpError(404, 'no such category')
  }

  return ArticleModel.findByCategoryId({categoryId: category._id, skip, limit})
}

exports.findByCategoryId = (categoryId, page, limit) => {
  const skip = (page - 1) * limit
  return ArticleModel.findByCategoryId({categoryId, skip, limit})
}

exports.search = (keyword, page, limit = 20) => {
  const skip = (page - 1) * limit
  return ArticleModel.search(keyword, skip, limit)
}
