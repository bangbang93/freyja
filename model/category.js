/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict';
const mongoose = require('../model').mongoose
const ObjectId = mongoose.Schema.ObjectId

const Schema = new mongoose.Schema({
  name: String,
  parent: {
    type: ObjectId,
    ref: 'category',
  },
  children: {
    type: [ObjectId],
    ref: 'category',
  },
})

const Model = mongoose.model('category', Schema)

exports.create = async function (name, parentId) {
  const parent = await Model.findById(parentId)
  if (!parent) {
    throw new Error('no such parent')
  }
  const category = await Model.create({name, parent: parentId})
  parent.children.push(category.id)
  return parent.save()
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
