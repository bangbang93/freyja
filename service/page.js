/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const PageModel = require('../model/page')

exports.getById = async function getById(id) {
  return PageModel.getById(id)
}

exports.getByName = async function getByName(name) {
  return PageModel.getByName(name)
}
