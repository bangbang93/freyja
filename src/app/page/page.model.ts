/**
 * Created by bangbang93 on 2017/9/20.
 */
'use strict'
// eslint-disable-next-line @typescript-eslint/no-require-imports
import {
  array, DocumentType, id, index, model, ObjectId, prop, RichModelType, subModel, unique,
} from 'mongoose-typescript'


export interface IPageSchema {
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
