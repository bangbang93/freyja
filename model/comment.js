/**
 * Created by bangbang93 on 2017/9/7.
 */
'use strict';
const mongoose = require('../model').mongoose
const ObjectId = mongoose.Schema.ObjectId

const Schema = new mongoose.Schema({
  content: String,
  html: String,
  article: {
    type: ObjectId,
    ref: 'article',
    index: true,
  },
  publisher: {
    email: String,
    name: String,
    website: String,
    hash: String,
    ip: String,
  },
  reply: {
    type: ObjectId,
    ref: 'comment'
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
})

const Model = mongoose.model('comment', Schema)

exports.create = function (comment, {article, reply}) {
  if (!comment.article && article) {
    comment.article = article
  }
  if (!comment.reply && reply) {
    comment.reply = reply
  }
  if (!comment.createdAt) {
    comment.createdAt = new Date()
  }
  return Model.create(comment)
}

exports.getById = function (id) {
  return Model.findById(id).exec()
}

exports.listByArticle = function (articleId, {skip, limit}) {
  return Model.find({
    article: articleId
  })
    .select({content: 0})
    .sort({_id: -1})
    .skip(skip)
    .limit(limit)
    .exec()
}

