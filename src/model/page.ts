/**
 * Created by bangbang93 on 2017/9/20.
 */
'use strict'
// eslint-disable-next-line @typescript-eslint/no-require-imports
import {
  array, DocumentType, getModel, id, index, model, ObjectId, prop, RichModelType, subModel, unique,
} from 'mongoose-typescript'


interface IPageSchema {
  name: string
  title: string
  content: string
  html: string
  author: ObjectId
  createdAt: Date
  attachments: ObjectId[]
  wordpress: PageWordpress
}

@subModel()
class PageWordpress {
  @prop() public postName!: string
  @prop() public id!: number
  @prop() public guid!: string
}

@model('page', {timestamps: true})
// eslint-disable-next-line camelcase
@index({content: 'text'}, {default_language: 'ngram'})
export class Page implements IPageSchema {
  @id() public _id!: ObjectId
  @prop() @unique() public name!: string
  @prop() public title!: string
  @prop() public content!: string
  @prop() public html!: string
  @prop() public author!: ObjectId
  @array(ObjectId) public attachments!: ObjectId[]
  @prop() public wordpress!: PageWordpress
  public createdAt!: Date
  public updatedAt!: Date
}

export type IPageModel = RichModelType<typeof Page>
export type IPageDocument = DocumentType<Page>

const Model = getModel(Page)

export async function getById(id: ObjectId): Promise<IPageDocument | null> {
  return Model.findById(id)
}

export async function create(page: IPageSchema): Promise<IPageDocument> {
  return Model.create(page)
}

export async function getByName(name: string): Promise<IPageDocument | null> {
  return Model.findOne({
    name,
  }).exec()
}

export async function list(
  {lastId, limit = 20, select = {content: 0, html: 0}}: {lastId?: ObjectId; limit?: number; select?: any},
): Promise<IPageDocument[]> {
  let query
  if (!lastId) {
    query = Model.find({})
  } else {
    query = Model.find({
      _id: {
        $gt: lastId,
      },
    })
  }
  return query.sort({_id: -1})
    .select(select)
    .limit(limit)
    .exec()
}

export async function listByPage(
  {skip, page = 1, limit = 20}: {skip?: number; page?: number; limit?: number},
): Promise<IPageDocument[]> {
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

export async function del(id: string): Promise<void> {
  await  Model.remove({_id: id}).exec()
}

export async function count(): Promise<number> {
  return Model.count({}).exec()
}
