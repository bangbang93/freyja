/**
 * Created by bangbang93 on 2017/9/20.
 */
'use strict'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mongoose = require('../model').mongoose

const Schema = new mongoose.Schema({
  name: String,
  href: String,
})

const Model = mongoose.model('link', Schema)

exports._Model = Model

exports.listAll = async () => Model.find({})
