/**
 * Created by bangbang93 on 2017/9/5.
 */
'use strict'

import {DocumentType, id, model, ObjectId, prop, RichModelType, unique} from 'mongoose-typescript'

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

