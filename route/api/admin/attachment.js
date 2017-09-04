/**
 * Created by bangbang93 on 2017/9/4.
 */
'use strict';
const router = require('express-promise-router')()
const multer = require('multer')
const path = require('path');
const uploader = multer({
  storage: multer.diskStorage({}),
})
const fs = require('fs-extra')
const uploadPath = path.join(__dirname, '../../../public/uploads')

router.post('/', uploader.single('file'), async function (req, res) {
  const file = req.file;
  const now = new Date()
  const datePath = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join(path.sep)

  console.log(datePath)
  const filename = `${Date.now()}${path.extname(file.originalname)}`
  console.log(filename)

  await fs.copy(file.path, path.join(uploadPath, datePath, filename))

  res.json({
    path: path.join('/uploads', datePath, filename)
  })
})

module.exports = router
