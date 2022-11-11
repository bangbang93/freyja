/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const router = require('express-promise-router')()

router.use((req, res, next) => {
  if (req.method === 'POST' && req.url === '/user/login') {
    return next()
  }
  if (!req.session.user) {
    return res.status(403).json({
      msg: 'need login',
    })
  }
  return next()
})

module.exports = router
