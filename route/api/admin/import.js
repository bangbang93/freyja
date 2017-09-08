/**
 * Created by bangbang93 on 2017/9/8.
 */
'use strict';
const router = require('express-promise-router')()
const AdminImportService = require('../../../service/admin/import')

router.post('/wordpress', async function (req, res) {
  const {database} = req.body

  if (['host', 'user', 'password', 'database', 'prefix'].some((key) => !database[key])) {
    return res.status(400).json({
      msg: 'missing params'
    })
  }

  const result = await AdminImportService(database, req.session.user._id)
  res.json(result)
})

module.exports = router
