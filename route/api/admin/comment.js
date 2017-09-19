/**
 * Created by bangbang93 on 2017/9/19.
 */
'use strict';
const router = require('express-promise-router')()
const AdminCommentService = require('../../../service/admin/comment')

router.get('/', async function (req, res) {
  const {page} = req.params

  const list = await AdminCommentService.list({page})

  res.json(list)
})

router.delete('/:id(\\w{24})', async function (req, res) {
  const {id} = req.params

  await AdminCommentService.delete(id)

  res.sendStatus(204)
})

module.exports = router
