/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const router = require('express-promise-router')()
const AdminUserService = require('../../../service/admin/user')

router.post('/login', async (req, res) => {
  const {username, password} = req.body

  try {
    const user = await AdminUserService.login(username, password)
    req.session.user = user
    res.json(user)
  } catch (e) {
    switch (e.message) {
      case 'no such user':
      case 'wrong password':
        return res.status(401).json({
          msg: 'wrong password',
        })
      default:
        throw e
    }
  }
})

router.get('/login', (req, res) => {
  const user = req.session.user

  res.json(user)
})

module.exports = router
