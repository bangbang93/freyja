/**
 * Created by bangbang93 on 2017/9/8.
 */
'use strict';
const MarkdownIt = require('markdown-it')

const md = new MarkdownIt()

exports.render = function (src, env) {
  return md.render(src, env)
}
