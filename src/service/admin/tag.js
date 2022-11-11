/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const TagModel = require('../../model/tag')

exports.create = async function create(title) {
  return TagModel.create(title)
}

exports.listAll = async function listAll() {
  return TagModel.listAll()
}

exports.getById = async function getById(id) {
  return TagModel.getById(id)
}

exports.createIfNotExists = async function createIfNotExists(title) {
  return TagModel.createIfNotExists(title)
}
