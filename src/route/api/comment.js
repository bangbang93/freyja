/**
 * Created by bangbang93 on 2017/9/7.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const router = require('express-promise-router')()
const CommentService = require('../../service/comment')

router.get('/article/:id(\\w{24})', async (req, res) => {
  const {page = 1} = req.query
  const {id: articleId} = req.params

  let list = await CommentService.listByArticle(articleId, page)

  list = list.map((e) => e.toJSON())

  removeEmail(list)

  function removeEmail(comments) {
    for (const comment of comments) {
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

router.post('/article/:id(\\w{24})', async (req, res) => {
  const {content, publisher, reply} = req.body
  const articleId = req.params.id
  if (!content || !publisher.email || !publisher.name) {
    return res.status(400).json({
      msg: 'missing params',
    })
  }

  publisher.ip = req.ip
  publisher.agent = req.get('user-agent')

  try {
    const {comment} = await CommentService.create({
      content,
      publisher,
    }, {article: articleId, reply}, req.session.user)

    res.status(201).json(comment)
  } catch (e) {
    switch (e.message) {
      case 'cannot use author email':
        return res.status(403).json({
          msg: 'cannot use author email',
        })
      default:
        throw e
    }
  }
})

module.exports = router
