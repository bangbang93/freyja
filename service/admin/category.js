/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const {CategoryModel} = require('../../model/category')

exports.getById = (id) => CategoryModel.findById(id)

exports.create = async (name, parentId) => CategoryModel.add(name, parentId)

exports.listAll = () => CategoryModel.find()

exports.listTree = async () => {
  const root = await CategoryModel.listRoot()
  async function bfs(root) {
    const promises = []
    for (const category of root) {
      if (category.children.length) {
        promises.push(root.populate('children')
          .execPopulate())
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
