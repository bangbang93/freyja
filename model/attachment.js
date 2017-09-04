/**
 * Created by bangbang93 on 2017/9/4.
 */
'use strict';
const mongoose = require('../model').mongoose

const Schema = new mongoose.Schema({
  filename: String,
  path: String,
})

const Model = mongoose.model('attachment', Schema)

exports.create = function (attachment) {
  return Model.create(attachment)
}

exports.getById = function (id) {
  return Model.findById(id).exec()
}
