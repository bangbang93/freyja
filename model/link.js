/**
 * Created by bangbang93 on 2017/9/20.
 */
'use strict';
const mongoose = require('../model').mongoose

const Schema = new mongoose.Schema({
  name: String,
  href: String,
})

const Model = mongoose.model('link', Schema)

exports._Model = Model

exports.listAll = function () {
  return Model.find({}).exec()
}
