/**
 * Created by bangbang93 on 2017/9/20.
 */
'use strict';
const router = require('express-promise-router')()
const CategoryService = require('../../service/category')

router.get('/', async function (req, res) {
  const list = await CategoryService.listAll()
  res.json(list)
})

router.get('/tree', async function (req, res) {
  const tree = await CategoryService.listTree()
  res.json(tree)
})

module.exports = router
