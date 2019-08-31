'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const router = require('express-promise-router')()

router.get('/', async (req, res) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 2000)
  })
  res.json({message: 'await'})
})

router.get('/error', async (req, res) => {
  const err = new Error('some thing happened')
  err.req = req.url
  throw err
})


module.exports = router
