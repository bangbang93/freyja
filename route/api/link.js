/**
 * Created by bangbang93 on 2017/9/20.
 */
'use strict';
const router = require('express-promise-router')()
const LinkService = require('../../service/link')

router.get('/', async function (req, res) {
  const list = await LinkService.listAll()

  res.json(list)
})


module.exports = router
