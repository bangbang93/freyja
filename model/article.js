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
  html: {
    type: String,
  },
  summary: {
    type: String,
  },
  category: {
    type: [ObjectId],
    ref: 'category',
  },
  tags: [String],
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

const Model = mongoose.model('article', Schema);

exports._Model = Model

exports.getById = function (id) {
  return Model.findById(id).exec()
}

exports.create = function (article) {
  return Model.create(article);
}

exports.list = function ({lastId, limit = 20, select = {content: 0, html: 0}}) {
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
  return query.sort({_id: -1})
    .select(select)
    .limit(limit)
    .exec()
}

exports.listByPage = function ({skip, page = 1, limit = 20}) {
  if (!skip) {
    skip = (page - 1) * limit
  }
  return Model.find({})
    .select({content: 0, html: 0})
    .sort({_id: -1})
    .skip(skip)
    .limit(limit)
    .exec()
}

exports.del = function (id) {
  return Model.remove({_id: id}).exec()
}

exports.count = function () {
  return Model.count({}).exec()
}

exports.getByWordpress = function (key, value) {
  if (arguments.length === 1) {
    [key] = Object.keys(key)
    value = arguments[0][key]
  }
  return Model.findOne({
    [`wordpress.${key}`]: value
  }).exec()
}
