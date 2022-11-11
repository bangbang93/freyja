/**
 * Created by bangbang93 on 2017/9/19.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const {CommentModel} = require('../../model/comment')

exports.list = async ({page, limit = 20}) => {
  const offset = (page - 1) * limit
  return CommentModel.list({skip: offset, limit})
}

exports.delete = async (id) => CommentModel.deleteById(id)
