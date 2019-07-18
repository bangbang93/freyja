/**
 * Created by bangbang93 on 2017/9/4.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const router = require('express-promise-router')()
const AdminArticleService = require('../../../service/admin/article')

router.post('/', async (req, res) => {
  const {title, content, tags, categories} = req.body
  if (!title || !content || !tags || !categories) {
    return res.status(400).json({
      msg: 'missing param',
    })
  }

  const author = req.session.user._id
  const createdAt = req.body.createdAt || new Date()

  const article = await AdminArticleService.create({title, content, tags, author, createdAt, categories})

  res.status(201).json(article)
})

router.get('/', async (req, res) => {
  const {page} = req.query

  const list = await AdminArticleService.listByPage(page, 20)

  res.json(list)
})

router.get('/:id(\\w{24})', async (req, res) => {
  const {id} = req.params

  const article = await AdminArticleService.getById(id)

  res.json(article)
})

router.put('/:id(\\w{24})', async (req, res) => {
  const {title, content, tags, categories} = req.body
  const {id} = req.params
  if (!title || !content || !tags || !categories) {
    return res.status(400).json({
      msg: 'missing param',
    })
  }

  const article = await AdminArticleService.update(id, {title, content, tags, categories})

  res.json(article)
})

router.delete('/:id(\\w{24})', async (req, res) => {
  const {id} = req.params

  await AdminArticleService.del(id)

  res.status(204).end()
})

router.get('/count', async (req, res) => {
  const count = await AdminArticleService.count()

  res.json({
    count,
  })
})

router.get('/rerender-all', async (req, res) => {
  await AdminArticleService.reRenderAll()
  res.json({
    msg: 'success',
  })
})

module.exports = router
