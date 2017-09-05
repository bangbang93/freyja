/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict';
const ArticleModel = require('../../model/article')

exports.create = function ({title, content, tags, author, createdAt = new Date()}) {
  return ArticleModel.create({title, content, tags, author, createdAt});
}
