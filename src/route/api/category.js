/**
 * Created by bangbang93 on 2017/9/20.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const router = require('express-promise-router')()
const CategoryService = require('../../service/category')
const ArticleService = require('../../service/article')

router.get('/', async (req, res) => {
  const list = await CategoryService.listAll()
  res.json(list)
})

router.get('/tree', async (req, res) => {
  const tree = await CategoryService.listTree()
  res.json(tree)
})

router.get('/:category', async (req, res) => {
  const {category} = req.params
  let {page}       = req.query

  page = Math.max(parseInt(page, 10), 1)

  const list = await ArticleService.findByCategory(category, page)

  res.json(list)
})

module.exports = router
