/**
 * Created by bangbang93 on 2017/9/7.
 */
'use strict';
const CommentModel = require('../model/comment')
const crypto = require('crypto')

exports.create = async function (comment, {article, reply}) {
  if (!article && !reply) {
    throw new Error('article or reply must has one')
  }
  if (!article && reply) {
    article = await CommentModel.getById(reply)
  }
  const email = comment.email.toLowerCase().trim()
  comment.publisher.hash = crypto.createHash('md5').update(email).digest('hex')
  return CommentModel.create(comment, {article, reply})
}

exports.listByArticle = function (articleId, page, limit = 20) {
  const skip = (page - 1) * limit
  return CommentModel.listByArticle(articleId, {skip, limit})
}
