/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const router = require('express-promise-router')()
const ArticleService = require('../../service/article')

router.get('/:id(\\w{24})', async (req, res) => {
  const id = req.params.id

  const article = await ArticleService.getById(id)

  if (!article) {
    return res.status(404).json({
      msg: 'no such article',
    })
  }

  res.json(article)
})

router.get('/', async (req, res) => {
  let {page} = req.query

  page = Math.max(parseInt(page, 10), 1)

  const list = await ArticleService.list(page, 20)

  res.json(list)
})

router.get('/search', async (req, res) => {
  const {keyword} = req.query
  const page = Math.max(req.query.page, 1) || 1
  const list = await ArticleService.search(keyword, page)
  res.json(list)
})

module.exports = router
