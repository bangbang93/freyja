/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict';
const mongoose = require('../model').mongoose
const ObjectId = mongoose.Schema.ObjectId

const Schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  parent: {
    type: ObjectId,
    ref: 'category',
  },
  children: {
    type: [ObjectId],
    ref: 'category',
  },
  wordpress: {
    id: Number,
    slug: String,
    taxonomyId: Number,
  }
})

const Model = mongoose.model('category', Schema)

exports._Model = Model

exports.create = async function ({name, parentId, wordpress}) {
  let parent
  if (parentId) {
    parent = await Model.findById(parentId)
    if (!parent) {
      throw new Error('no such parent')
    }
  }
  const category = await Model.create({
    name,
    parent: parentId,
    wordpress,
  })
  if (parent){
    parent.children.push(category._id)
    await parent.save()
  }
  return category
}

exports.getByName = function (name) {
  return Model.findOne({
    name,
  }).exec()
}

exports.getById = function (id) {
  return Model.findById(id).exec()
}

exports.listAll = async function () {
  return Model.find({}).exec()
}

exports.findRoot = async function () {
  return Model.find({parent: null}).exec()
}

exports.getByWordpress = function (key, value) {
  return Model.findOne({
    [`wordpress.${key}`]: value
  }).exec()
}
