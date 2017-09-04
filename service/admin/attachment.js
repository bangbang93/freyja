/**
 * Created by bangbang93 on 2017/9/4.
 */
'use strict';
const AttachmentModel = require('../../model/attachment')

exports.create = function (attachment) {
  return AttachmentModel.create(attachment)
}

exports.getById = function (id) {
  return AttachmentModel.getById(id)
}
