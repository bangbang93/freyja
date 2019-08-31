'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const {CategoryModel} = require('../model/category')

exports.listAll = () => CategoryModel.find()

exports.listTree = async () => {
  const roots = await CategoryModel.listRoot()

  for (const root of roots) {
    await walk(root)
  }

  return roots

  async function walk(root) {
    if (root.children && root.children.length > 0) {
      root.populate('children')
      await root.execPopulate()
      for (const child of root.children) {
        await walk(child)
      }
    }
  }
}
