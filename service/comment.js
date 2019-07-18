/**
 * Created by bangbang93 on 2017/9/7.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const {CommentModel} = require('../model/comment')
const ArticleModel = require('../model/article').ArticleModel
const {AdminModel} = require('../model/admin')
const crypto = require('crypto')
const MarkdownHelper = require('../helper/markdown')
const MailModule = require('../module/mail')

exports.create = async (comment, {article, reply}, loginUser) => {
  if (!article && !reply) {
    throw new Error('article or reply must has one')
  }
  let replyComment
  if (reply) {
    replyComment = await CommentModel.findById(reply)
  }
  if (!article && reply) {
    article = replyComment.article
  }
  if (!article) {
    throw new Error('no such article')
  }
  if (typeof article === 'string') {
    article = await ArticleModel.findById(article)
  }
  const author = await AdminModel.findById(article.author)
  const email = comment.publisher.email.toLowerCase()
    .trim()

  if (author.email && author.email.toLowerCase() === email) {
    if (!loginUser || loginUser._id !== author._id.toString()) {
      throw new Error('cannot use author email')
    }
  }

  comment.publisher.hash = crypto.createHash('md5')
    .update(email)
    .digest('hex')
  comment.html = MarkdownHelper.renderComment(comment.content)
  const newComment = await CommentModel.add(comment, {article, reply})
  if (replyComment) {
    await CommentModel.addReply(replyComment._id, newComment._id)
  }

  if (reply && replyComment.publisher.email) {
    MailModule.commentReply({
      to     : replyComment.publisher.email,
      article: await ArticleModel.findById(article),
    })
  }
  if (!reply) {
    MailModule.comment({article: await ArticleModel.findById(article)})
  }

  return {
    comment: newComment,
    replyComment,
  }
}

exports.listByArticle = async (articleId, page, limit = 20) => {
  const skip = (page - 1) * limit
  const list = await CommentModel.listByArticle(articleId, {skip, limit})
  return walkComments(list)
  async function walkComments(comments) {
    for (const comment of comments) {
      if (comment.replies) {
        comment.populate('replies')
        await comment.execPopulate()
        await walkComments(comment.replies)
      }
    }
    return comments
  }
}
