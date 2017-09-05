/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict';
const CategoryModel = require('../../model/category')

exports.getById = function (id) {
  return CategoryModel.getById(id)
}

exports.create = function (name, parentId) {
  return CategoryModel.create(name, parentId)
}

exports.listAll = function () {
  return CategoryModel.listAll()
}

exports.listTree = async function () {
  const root = await CategoryModel.findRoot()
  async function bfs (root) {
    const promises = []
    for (const category of root) {
      if (category.children.length) {
        promises.push(root.populate('children').execPopulate())
      }
    }
    if (promises.length === 0) {
      return
    }
    const populatedDoc = await Promise.all(promises)
    for (const doc of populatedDoc) {
      await bfs(doc.children)
    }
  }
  await bfs(root)
  return root
}
