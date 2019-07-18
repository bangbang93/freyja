/**
 * Created by bangbang93 on 2017/9/20.
 */
'use strict'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mongoose = require('../model').mongoose
const ObjectId = mongoose.Schema.ObjectId

const Schema = new mongoose.Schema({
  name: {
    type  : String,
    unique: true,
  },
  title  : String,
  content: {
    type : String,
    index: 'text',
  },
  html: {
    type: String,
  },
  author: {
    type: ObjectId,
    ref : 'admin',
  },
  createdAt  : Date,
  attachments: [
    {
      type: ObjectId,
      ref : 'attachment',
    },
  ],
  wordpress: {
    postName: String,
    id      : Number,
    guid    : String,
  },
})

const Model = mongoose.model('page', Schema)

exports.getById = async function getById(id) {
  return Model.findById(id).exec()
}

exports.create = async function create(article) {
  return Model.create(article)
}

exports.getByName = async function getByName(name) {
  return Model.findOne({
    name,
  }).exec()
}

exports.list = async function list({lastId, limit = 20, select = {content: 0, html: 0}}) {
  let query
  if (!lastId) {
    query = Model.find({})
  } else {
    query = Model.find({
      _id: {
        $gt: lastId,
      },
    })
  }
  return query.sort({_id: -1})
    .select(select)
    .limit(limit)
    .exec()
}

exports.listByPage = async function listByPage({skip, page = 1, limit = 20}) {
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

exports.del = async function del(id) {
  return Model.remove({_id: id}).exec()
}

exports.count = async function count() {
  return Model.count({}).exec()
}
