/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict';
const TagModel = require('../../model/tag')

exports.create = function (title) {
  return TagModel.create(title)
}

exports.listAll = function () {
  return TagModel.listAll()
}

exports.getById = function (id) {
  return TagModel.getById(id)
}

exports.createIfNotExists = function (title) {
  return TagModel.createIfNotExists(title)
}
