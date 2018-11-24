/**
 * Created by bangbang93 on 2017/9/4.
 */
'use strict';
const {AttachmentModel} = require('../../model/attachment')

exports.create = function (attachment) {
  return AttachmentModel.create(attachment)
}

exports.getById = function (id) {
  return AttachmentModel.findById(id)
}

exports.listByPage = function (page = 1, limit = 20) {
  const skip = (page - 1) * limit
  return AttachmentModel.listByPage({skip, limit})
}

exports.count = function () {
  return AttachmentModel.count()
}
