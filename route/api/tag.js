/**
 * Created by bangbang93 on 2017/9/24.
 */
'use strict';
const router = require('express-promise-router')()
const ArticleService = require('../../service/article')

router.get('/:tag', async function (req, res) {
  const {tag} = req.params
  const {page} = req.query

  const list = await ArticleService.findByTag(tag, page)

  res.json(list)
})


module.exports = router
