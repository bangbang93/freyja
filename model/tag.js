/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mongoose = require('../model').mongoose

const Schema = new mongoose.Schema({
  title: {
    type  : String,
    unique: true,
  },
})

const Model = mongoose.model('tag', Schema)

exports.create = async function create(title) {
  return Model.create({title})
}

exports.getById = async function getById(id) {
  return Model.findById(id).exec()
}

exports.listAll = async function listAll() {
  return Model.find({}).exec()
}

exports.createIfNotExists = async function createIfNotExists(title) {
  return Model.update({title}, {title}, {
    upsert: true,
  })
}
