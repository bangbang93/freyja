/**
 * Created by bangbang93 on 2017/9/7.
 */
'use strict';
const CommentModel = require('../model/comment')
const ArticleModel = require('../model/article')
const crypto = require('crypto')
const MarkdownHelper = require('../helper/markdown')

exports.create = async function (comment, {article, reply}) {
  if (!article && !reply) {
    throw new Error('article or reply must has one')
  }
  let replyComment
  if (reply) {
    replyComment = await CommentModel.getById(reply)
  }
  if (!article && reply) {
    article = replyComment.article
  }
  const email = comment.publisher.email.toLowerCase().trim()
  comment.publisher.hash = crypto.createHash('md5').update(email).digest('hex')
  comment.html = MarkdownHelper.renderComment(comment.content)
  const newComment = await CommentModel.create(comment, {article, reply})
  if (replyComment) {
    await CommentModel.addReply(replyComment._id, newComment._id)
  }
  return newComment
}

exports.listByArticle = async function (articleId, page, limit = 20) {
  const skip = (page - 1) * limit
  const list = await CommentModel.listByArticle(articleId, {skip, limit})
  return walkComments(list)
  async function walkComments (comments) {
    for(const comment of comments) {
      if (comment.replies) {
        comment.populate('replies')
        await comment.execPopulate()
        await walkComments(comment.replies)
      }
    }
    return comments
  }
}
