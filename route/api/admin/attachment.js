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
const AdminAttachemntService = require('../../../service/admin/attachment')

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
  const savePath = path.join(uploadPath, datePath, filename);

  await fs.copy(file.path, savePath)

  await AdminAttachemntService.create({
    filename: file.originalname,
    path: path.join('/uploads', datePath, filename),
  })

  res.json({
    path: path.join('/uploads', datePath, filename)
  })
})

router.get('/:id(\w{24})', async function (req, res) {
  const id = req.params.id

  const attachment = await AdminAttachemntService.getById(id)

  if (!attachment) return res.sendStatus(404)

  res.redirect(attachment.url);

})

module.exports = router
