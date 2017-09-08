/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict';
const router = require('express-promise-router')()

router.use(function (req, res, next) {
  switch (true) {
    case req.method === 'POST' && req.url === '/user/login':
      return next()
    default:
      if (!req.session.user){
        return res.status(403).json({
          msg: 'need login'
        })
      }
      next();
  }
})

module.exports = router;
