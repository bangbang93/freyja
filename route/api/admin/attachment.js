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

router.use(function (req, res, next) {
  if (!req.session.user) {
    return res.status(403).json({
      msg: 'need login',
    })
  }
  next();
})

router.post('/', uploader.single('file'), async function (req, res) {
  const file = req.file;
  const now = new Date()
  const datePath = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join(path.sep)

  let ext = path.extname(file.originalname);
  if (!ext) {
    ext = `.${file.mimetype.split('/')[1]}`
  }
  const filename = `${Date.now()}${ext}`

  await fs.copy(file.path, path.join(uploadPath, datePath, filename))

  res.json({
    path: path.join('/uploads', datePath, filename)
  })
})

module.exports = router
