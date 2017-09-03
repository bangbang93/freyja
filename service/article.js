/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict';
const ArticleModel = require('../model/article');

exports.getById = function (id) {
  return ArticleModel.getById(id)
}
