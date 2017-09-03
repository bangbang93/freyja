/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict';
const router = require('express-promise-router')()
const ArticleService = require('../../service/article')

router.get('/:id(\\d+)', async function (req, res) {
  const id = req.params.id;

  const article = await ArticleService.getById(id)

  res.json(article)
})

module.exports = router
