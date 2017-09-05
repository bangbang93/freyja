/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict';
const mongoose = require('../model').mongoose;
const ObjectId = mongoose.Schema.ObjectId;

const Schema = new mongoose.Schema({
  title: String,
  content: {
    type: String,
    index: 'text',
  },
  tags: [String],
  author: {
    type: ObjectId,
    ref: 'admin',
  },
  createdAt: Date,
  attachments: {
    type: [ObjectId],
    ref: 'attachment',
  }
})

const Model = mongoose.model('article', Schema);

exports.getById = function (id) {
  return Model.findById(id).exec()
}

exports.create = function (article) {
  return Model.create(article);
}

exports.list = function (lastId, limit = 20) {
  let query;
  if (!lastId) {
    query = Model.find({})
  } else {
    query = Model.find({
      _id: {
        $gt: lastId
      }
    })
  }
  return query.sort({_id: -1}).limit(limit).exec()
}
