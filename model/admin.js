/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict';
const mongoose = require('../model').mongoose

const Schema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  salt: String,
})

const Model = mongoose.model('admin', Schema)

exports.getByName = function (username) {
  return Model.findOne({
    username
  }).exec()
}

exports.getById = function (id) {
  return Model.getById(id).exec()
}

exports.create = function ({username, password, salt}) {
  return Model.create({
    username,
    password,
    salt,
  })
}
