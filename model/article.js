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
})

const Model = mongoose.model('article', Schema);

exports.getById = function (id) {
  return Model.findById(id).exec()
}
