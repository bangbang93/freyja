/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict';
const router = require('express-promise-router')()
const AdminUserService = require('../../../service/admin/user')

router.post('/login', async function (req, res) {
  const {username, password} = req.body

  try {
    const user = await AdminUserService.login(username, password)
    req.session.user = user;
    res.json(user)
  } catch (e) {
    switch (e.message) {
      case 'no such user':
      case 'wrong password':
        return res.status(401).json({
          msg: 'wrong password'
        });
      default:
        throw e;
    }
  }
})

router.get('/login', function (req, res) {
  const user = req.session.user;
  if (!user) {
    return res.status(403).json({
      msg: 'need login'
    });
  }

  res.json(user);
})

module.exports = router;
