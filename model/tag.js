/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict';
const mongoose = require('../model').mongoose

const Schema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
  }
})

const Model = mongoose.model('tag', Schema)

exports.create = function (title) {
  return Model.create({title})
}

exports.getById = function (id) {
  return Model.findById(id).exec()
}

exports.listAll = function () {
  return Model.find({}).exec()
}

exports.createIfNotExists = function (title) {
  return Model.update({title}, {title}, {
    upsert: true,
  })
}
