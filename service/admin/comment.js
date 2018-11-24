/**
 * Created by bangbang93 on 2017/9/19.
 */
'use strict';
const {CommentModel} = require('../../model/comment')

exports.list = ({page, limit = 20}) => {
  const offset = (page - 1) * limit
  return CommentModel.list({skip: offset, limit})
}

exports.delete = (id) => CommentModel.deleteById(id)
