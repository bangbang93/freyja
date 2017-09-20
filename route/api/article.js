/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict';
const router = require('express-promise-router')()
const ArticleService = require('../../service/article')

router.get('/:id(\\w{24})', async function (req, res) {
  const id = req.params.id;

  const article = await ArticleService.getById(id)

  if (!article) {
    return res.status(404).json({
      msg: 'no such article'
    })
  }

  res.json(article)
})

router.get('/', async function (req, res) {
  const {page} = req.query

  const list = await ArticleService.list(page, 20)

  res.json(list)
})

module.exports = router
