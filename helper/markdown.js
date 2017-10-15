/**
 * Created by bangbang93 on 2017/9/8.
 */
'use strict';
const MarkdownIt = require('markdown-it')

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: false,
})

const commentMd = new MarkdownIt({
  html: false,
})

exports.render = function (src, env) {
  return md.render(src, env)
}

exports.renderComment = function (src, env) {
  return commentMd.render(src, env)
}
