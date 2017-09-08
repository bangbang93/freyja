/**
 * Created by bangbang93 on 2017/9/4.
 */
'use strict';
const mongoose = require('../model').mongoose

const Schema = new mongoose.Schema({
  filename: String,
  path: String,
  mimeType: String,
  createdAt: Date,
  wordpress: {

  }
})

const Model = mongoose.model('attachment', Schema)

exports._Model = Model

exports.create = function (attachment) {
  attachment.createdAt = attachment.createdAt || new Date;
  return Model.create(attachment)
}

exports.getById = function (id) {
  return Model.findById(id).exec()
}

exports.listByPage = function ({skip, page = 1, limit = 20}) {
  if (!skip) {
    skip = (page - 1) * limit
  }
  return Model.find({}).sort({_id: -1}).skip(skip).limit(limit).exec()
}

exports.count = function () {
  return Model.count({}).exec()
}
