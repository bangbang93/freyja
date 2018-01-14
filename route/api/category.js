/**
 * Created by bangbang93 on 2017/9/20.
 */
'use strict';
const router = require('express-promise-router')()
const CategoryService = require('../../service/category')
const ArticleService = require('../../service/article')

router.get('/', async function (req, res) {
  const list = await CategoryService.listAll()
  res.json(list)
})

router.get('/tree', async function (req, res) {
  const tree = await CategoryService.listTree()
  res.json(tree)
})

router.get('/:category', async function (req, res) {
  const {category} = req.params
  let {page}       = req.query

  page = Math.max(parseInt(page), 1)

  const list = await ArticleService.findByCategory(category, page)

  res.json(list)
})

module.exports = router
