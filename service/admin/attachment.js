/**
 * Created by bangbang93 on 2017/9/4.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const {AttachmentModel} = require('../../model/attachment')

exports.create = async function create(attachment) {
  return AttachmentModel.create(attachment)
}

exports.getById = async function getById(id) {
  return AttachmentModel.findById(id)
}

exports.listByPage = async function listByPage(page = 1, limit = 20) {
  const skip = (page - 1) * limit
  return AttachmentModel.listByPage({skip, limit})
}

exports.count = async function count() {
  return AttachmentModel.count()
}
