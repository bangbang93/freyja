/**
 * Created by bangbang93 on 2017/9/3.
 */


'use strict';
import {Document, Types} from 'mongoose'
import IObjectId = Types.ObjectId
import model = require('../model')
import mongoose = model.mongoose
const ObjectId = mongoose.Schema.Types.ObjectId;

export interface IArticle extends Document {
  title: string,
  content: string,
  html: string,
  summary: string,
  categories: [IObjectId],
  tags: [string],
  author: IObjectId,
  createdAt: Date,
  attachments: [IObjectId],
  wordpress: {
    postName: string,
    id: number,
    guid: string,
  }
}

const Schema = new mongoose.Schema({
  title: String,
  content: {
    type: String,
    index: 'text',
  },
  html: {
    type: String,
  },
  summary: {
    type: String,
  },
  categories: {
    type: [ObjectId],
    ref: 'category',
  },
  tags: [String],
  author: {
    type: ObjectId,
    ref: 'admin',
  },
  createdAt: Date,
  attachments: [{
    type: ObjectId,
    ref: 'attachment',
  }],
  wordpress: {
    postName: String,
    id: Number,
    guid: String,
  }
})

const Model = mongoose.model<IArticle>('article', Schema);

export const _Model = Model

export class ArticleModel {
  static getById (id: string): Promise<IArticle> {
    return Model.findById(id).exec()
  }

  static create (article) {
    return Model.create(article);
  }

  static list ({lastId, limit = 20, select = {content: 0, html: 0}}) {
    let query;
    if (!lastId) {
      query = Model.find({})
    } else {
      query = Model.find({
        _id: {
          $gt: lastId
        }
      })
    }
    return query.sort({_id: -1})
      .select(select)
      .limit(limit)
      .exec()
  }

  static listByPage ({skip, page = 1, limit = 20}) {
    if (!skip) {
      skip = (page - 1) * limit
    }
    return Model.find({})
      .select({content: 0, html: 0})
      .sort({_id: -1})
      .skip(skip)
      .limit(limit)
      .exec()
  }

  static del (id) {
    return Model.remove({_id: id}).exec()
  }

  static count () {
    return Model.count({}).exec()
  }

  static getByWordpress (key, value) {
    if (arguments.length === 1) {
      [key] = Object.keys(key)
      value = arguments[0][key]
    }
    return Model.findOne({
      [`wordpress.${key}`]: value
    }).exec()
  }

  static findByTag ({tag, skip = 0, limit = 20}) {
    return Model.find({
      tags: tag
    })
      .skip(skip)
      .limit(limit)
      .exec()
  }

  static findByCategoryId ({categoryId, skip, limit}) {
    return Model.find({
      category: categoryId
    })
      .skip(skip)
      .limit(limit)
      .exec()
  }
}
