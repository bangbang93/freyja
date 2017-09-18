/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict';
const ArticleModel = require('../model/article')
const nurl = require('url')

exports.getById = function (id) {
  return ArticleModel.getById(id)
}

exports.list = function (page, limit = 20) {
  const skip = (page - 1) * limit
  return ArticleModel.listByPage({skip, limit})
}

exports.getByWordpress = function ({id, postName, guid}) {
  if (id) {
    return ArticleModel.getByWordpress({id})
  }
  if (postName) {
    console.log(postName)
    return ArticleModel.getByWordpress({postName: encodeURIComponent(postName).toLowerCase()})
  }
  if (guid) {
    const url = nurl.parse(guid)
    return ArticleModel.getByWordpress({guid: new RegExp(url.path)})
  }
}
