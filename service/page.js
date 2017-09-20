/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict';
const PageModel = require('../model/page')
const nurl = require('url')

exports.getById = function (id) {
  return PageModel.getById(id)
}

exports.getByName = function (name) {
  return PageModel.getByName(name)
}
