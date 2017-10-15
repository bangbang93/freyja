/**
 * Created by bangbang93 on 2017/9/7.
 */
'use strict';
const router = require('express-promise-router')()
const CommentService = require('../../service/comment')

router.get('/article/:id(\\w{24})', async function (req, res) {
  const {page = 1} = req.query
  const {id: articleId} = req.params

  const list = await CommentService.listByArticle(articleId, page)

  removeEmail(list)

  function removeEmail(comments) {
    for(const comment of comments) {
      delete comment.publisher.email
      delete comment.publisher.agent
      delete comment.publisher.ip
      if (comment.replies) {
        removeEmail(comment.replies)
      }
    }
  }

  res.json(list)
})

router.post('/article/:id(\\w{24})', async function (req, res) {
  const {content, publisher, reply} = req.body
  const articleId = req.params.id
  if (!content || !publisher.email || !publisher.name) {
    return res.status(400).json({
      msg: 'missing params'
    })
  }

  const referer = req.get('referer')
  if (!referer || !referer.includes(req.url)) {
    return res.status(400).json({
      msg: 'missing params'
    })
  }

  publisher.ip = req.ip;
  publisher.agent = req.get('user-agent')

  const {comment} = await CommentService.create({
    content,
    publisher,
  }, {article: articleId, reply})

  res.status(201).json(comment)
})

module.exports = router
