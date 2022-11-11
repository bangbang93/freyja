/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict'
// eslint-disable-next-line @typescript-eslint/no-require-imports
import {DocumentType, getModel, id, model, ObjectId, prop, RichModelType, unique} from 'mongoose-typescript'

export interface ITagSchema {
  _id: ObjectId
  title: string
}

@model('tag')
export class Tag implements ITagSchema {
  @id() public _id!: ObjectId
  @prop() @unique() public title!: string
}

export type ITagDocument = DocumentType<Tag>
export type ITagModel = RichModelType<typeof Tag>

const Model = getModel(Tag)

export async function create(title: string): Promise<ITagDocument> {
  return Model.create({title})
}

export async function getById(id: ObjectId): Promise<ITagDocument | null> {
  return Model.findById(id).exec()
}

export async function listAll(): Promise<ITagDocument[]> {
  return Model.find({}).exec()
}

export async function createIfNotExists(title: string): Promise<void> {
  await Model.update({title}, {title}, {
    upsert: true,
  })
}
