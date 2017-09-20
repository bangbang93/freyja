'use strict';
const CategoryModel = require('../model/category')

exports.listAll = function () {
  return CategoryModel.listAll()
}

exports.listTree = async function () {
  const roots = await CategoryModel.listRoot()

  for(const root of roots) {
    await walk(root)
  }

  return roots;

  async function walk(root) {
    if (root.children && root.children.length > 0) {
      root.populate('children')
      await root.execPopulate()
      for(const child of root.children) {
        await walk(child)
      }
    }
  }
}
