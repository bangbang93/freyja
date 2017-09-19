/**
 * Created by bangbang93 on 2017/9/19.
 */
'use strict';
const CommentModel = require('../../model/comment')

exports.list = function ({page, limit = 20}) {
  const offset = (page - 1) * limit
  return CommentModel.list({skip: offset, limit})
}

exports.delete = function (id) {
  return CommentModel.deleteById(id)
}
