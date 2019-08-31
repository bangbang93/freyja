'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const router = require('express-promise-router')()
const ArticleService = require('../service/article')

router.get('/time', (req, res) => {
  res.send(new Date())
})


// wp兼容路由
router.get('/:year(\\d+)/:mouth(\\d+)/:day(\\d+)/:postName.:suffix', async (req, res, next) => {
  const {postName} = req.params
  const article = await ArticleService.getByWordpress({postName})
  if (!article) return next()
  res.redirect(301, `/article/${article._id}`)
})

router.get('/', async (req, res, next) => {
  const {p} = req.query
  if (!p) return next()
  const article = await ArticleService.getByWordpress({id: p})
  if (!article) return next()
  res.redirect(301, `/article/${article._id}`)
})

router.get('/about', (req, res) => {
  res.redirect(301, '/page/i')
})

module.exports = router
