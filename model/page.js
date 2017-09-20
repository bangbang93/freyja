/**
 * Created by bangbang93 on 2017/9/20.
 */
'use strict';
const mongoose = require('../model').mongoose;
const ObjectId = mongoose.Schema.ObjectId;

const Schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  title: String,
  content: {
    type: String,
    index: 'text',
  },
  html: {
    type: String,
  },
  author: {
    type: ObjectId,
    ref: 'admin',
  },
  createdAt: Date,
  attachments: [{
    type: ObjectId,
    ref: 'attachment',
  }],
  wordpress: {
    postName: String,
    id: Number,
    guid: String,
  }
})

const Model = mongoose.model('page', Schema);

exports.getById = function (id) {
  return Model.findById(id).exec()
}

exports.create = function (article) {
  return Model.create(article);
}

exports.getByName = function (name) {
  return Model.findOne({
    name
  }).exec()
}
