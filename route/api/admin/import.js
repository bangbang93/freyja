/**
 * Created by bangbang93 on 2017/9/8.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const router = require('express-promise-router')()
const AdminImportService = require('../../../service/admin/import')

router.post('/wordpress', async (req, res) => {
  const {database} = req.body

  if (['host', 'user', 'password', 'database', 'prefix'].some((key) => typeof database[key] === 'undefined')) {
    return res.status(400).json({
      msg: 'missing params',
    })
  }

  const result = await AdminImportService.wordpress(database, req.session.user._id)
  res.json(result)
})

module.exports = router
