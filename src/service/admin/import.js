/**
 * Created by bangbang93 on 2017/9/8.
 */
'use strict'
/* eslint-disable
 @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires,camelcase */
const {ArticleModel} = require('../../model/article')
const {AttachmentModel} = require('../../model/attachment')
const {CommentModel} = require('../../model/comment')
const {CategoryModel} = require('../../model/category')
const TagModel = require('../../model/tag')
const LinkModel = require('../../model/link')
const Knex = require('knex')
const MarkdownHelper = require('../../helper/markdown')
const path = require('path')
const url = require('url')
const HashHelper = require('../../helper/hash')
const htmlSubstring = require('../../lib/html-substring')

exports.wordpress = async ({host, user, password, database, port, prefix = 'wp_'}, userId) => {
  const knex = new Knex({
    client: 'mysql2',
    connection: {
      host,
      user,
      password,
      database,
      port,
    },
  })
  await importCategory(knex, prefix)

  let posts = await knex(`${prefix}posts`)
    .where({
      post_status: 'publish',
      post_type: 'post',
    })
  let articles = posts.map(async (post) => {
    const article = {
      title: post.post_title,
      content: post.post_content,
      html: MarkdownHelper.render(post.post_content),
      summary: MarkdownHelper.render(htmlSubstring(post.post_content, 200)),
      tags: [],
      categories: [],
      author: userId,
      createdAt: new Date(post.post_date),
      attachments: [],
      wordpress: {
        postName: post.post_name,
        id: post.ID,
        guid: post.guid,
      },
    }
    const terms = await knex(`${prefix}term_relationships`)
      .where({
        object_id: post.ID,
      })
    const termTaxonomyIds = terms.map((term) => term.term_taxonomy_id)
    const termTaxonomies = await knex(`${prefix}term_taxonomy`)
      .whereIn('term_taxonomy_id', termTaxonomyIds)
    for (const termTaxonomy of termTaxonomies) {
      switch (termTaxonomy.taxonomy) {
        case 'category': {
          const category = await CategoryModel.getByWordpress('taxonomyId', termTaxonomy.term_taxonomy_id)
          article.categories.push(category._id)
        }
          break
        case 'post_tag': {
          const term = await knex(`${prefix}terms`)
            .where({
              term_id: termTaxonomy.term_id,
            })
            .first()
          article.tags.push(term.name)
          await TagModel.createIfNotExists(term.name)
          break
        }
        default:
          break
      }
    }
    return article
  })
  articles = await Promise.all(articles)
  articles = await ArticleModel._Model.create(articles)
  const articlesMap = new Map()
  articles.forEach((article) => {
    articlesMap.set(article.wordpress.id, article)
  })

  posts = await knex(`${prefix}posts`)
    .where({
      post_type: 'attachment',
    })

  const attachments = posts.map((post) => ({
    filename: path.basename(post.guid),
    path: url.parse(post.guid).path,
    mimeType: post.post_mime_type,
    createdAt: post.post_date,
  }))
  await AttachmentModel._Model.create(attachments)

  const wpComments = await knex(`${prefix}comments`)
    .select()
  let comments = wpComments.map((wpComment) => {
    if (!articlesMap.has(wpComment.comment_post_ID)) return null
    return {
      content: wpComment.comment_content,
      html: MarkdownHelper.renderComment(wpComment.comment_content),
      article: articlesMap.get(wpComment.comment_post_ID)._id,
      publisher: {
        email: wpComment.comment_author_email,
        name: wpComment.comment_author,
        website: wpComment.comment_author_url,
        ip: wpComment.comment_author_IP,
        hash: HashHelper.md5(wpComment.comment_author_email),
      },
      createdAt: new Date(wpComment.comment_date),
      wordpress: {
        id: wpComment.comment_ID,
        commentParent: wpComment.comment_parent,
      },
    }
  })
  comments = comments.filter((e) => !!e)
  comments = await CommentModel.create(comments)
  await comments.map(async (comment) => {
    if (comment.wordpress.commentParent !== 0) {
      const parentComment = await CommentModel.getByWordpress('id', comment.wordpress.commentParent)
      comment.reply = parentComment._id
      return comment.save()
    }
  })

  let links = await knex(`${prefix}links`)
    .select()
  links = links.map((link) => ({
    name: link.link_name,
    href: link.link_url,
  }))
  links = await LinkModel._Model.create(links)

  // await Bluebird.each(posts, async(post) => {
  //   const resp = await rp(post['guid'], {encoding: null})
  //   const filepath = path.join(publicPath, url.parse(post['guid']).path)
  //   await fs.outputFile(filepath, resp)
  // })

  return {
    articles: articles.length,
    attachments: attachments.length,
    comments: comments.length,
    links: links.length,
  }
}

async function importCategory(knex, prefix) {
  const termTaxonomies = await knex(`${prefix}term_taxonomy`)
    .where({
      taxonomy: 'category',
    })
  const categoriesMap = new Map()
  for (const termTaxonomy of termTaxonomies) {
    if (termTaxonomy.parent === 0) {
      await buildTree(termTaxonomy)
    }
  }

  async function buildTree(currentTermTaxonomy) {
    const parentId = currentTermTaxonomy.parent
    if (!categoriesMap.has(currentTermTaxonomy.term_id)) {
      const term = await knex(`${prefix}terms`)
        .where({
          term_id: currentTermTaxonomy.term_id,
        })
        .first()
      const category = await CategoryModel.create({
        name: term.name,
        parentId: parentId === 0 ? null : categoriesMap.get(parentId)._id,
        wordpress: {
          id: currentTermTaxonomy.term_id,
          taxonomyId: currentTermTaxonomy.term_taxonomy_id,
          slug: term.slug,
        },
      })
      categoriesMap.set(currentTermTaxonomy.term_id, category)
    }
    for (const termTaxonomy of termTaxonomies) {
      if (termTaxonomy.parent === currentTermTaxonomy.term_id) {
        await buildTree(termTaxonomy)
      }
    }
  }
}

function decodePostName(postName, title) {
  try {
    return decodeURIComponent(postName)
  } catch (e) {
    return title
  }
}
