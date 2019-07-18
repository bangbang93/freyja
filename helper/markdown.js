/**
 * Created by bangbang93 on 2017/9/8.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const MarkdownIt = require('markdown-it')
const MarkdownItLozad = require('markdown-it-lozad')

const md = new MarkdownIt({
  html   : true,
  breaks : true,
  linkify: false,
})
  .use(MarkdownItLozad)

const commentMd = new MarkdownIt({
  html: false,
})

exports.render = (src, env) => md.render(src, env)

exports.renderComment = (src, env) => commentMd.render(src, env)
