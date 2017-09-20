/**
 * Created by bangbang93 on 2017/9/4.
 */
'use strict';
const router = require('express-promise-router')()
const AdminPageService = require('../../../service/admin/page')

router.post('/', async function (req, res) {
  const {title, content, name} = req.body
  if (!title || !content || !name) {
    return res.status(400).json({
      msg: 'missing param'
    })
  }

  const author = req.session.user._id
  const createdAt = req.body.createdAt || new Date()

  const article = await AdminPageService.create({title, content, name, author, createdAt})

  res.status(201).json(article);
})

router.get('/', async function (req, res) {
  const {page} = req.query

  const list = await AdminPageService.listByPage(page, 20)

  res.json(list)
})

router.get('/:id(\\w{24})', async function (req, res) {
  const {id} = req.params

  const article = await AdminPageService.getById(id)

  res.json(article)
})

router.put('/:id(\\w{24})', async function (req, res) {
  const {title, content} = req.body
  const {id} = req.params
  if (!title || !content) {
    return res.status(400).json({
      msg: 'missing param'
    })
  }

  const article = await AdminPageService.update(id, {title, content, tags})

  res.json(article)
})

router.delete('/:id(\\w{24})', async function (req, res) {
  const {id} = req.params;

  await AdminPageService.del(id)

  res.status(204).end()
})

router.get('/count', async function (req, res) {
  const count = await AdminPageService.count()

  res.json({
    count
  })
})

router.get('/rerender-all', async function (req, res) {
  await AdminPageService.reRenderAll()
  res.json({
    msg: 'success'
  })
})

module.exports = router
