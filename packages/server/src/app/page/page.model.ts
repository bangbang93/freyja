/**
 * Created by bangbang93 on 2017/9/20.
 */
'use strict'

import {
  array, DocumentType, id, index, model, ObjectId, prop, Ref, ref, RichModelType, subModel, unique,
} from 'mongoose-typescript'
import {Admin} from '../admin/admin.model'


export interface IPageSchema {
  name: string
  title: string
  content: string
  html: string
  author: Ref<Admin>
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
  @prop() @ref(Admin) public author!: Ref<Admin>
  @array(ObjectId) public attachments!: ObjectId[]
  @prop() public wordpress!: PageWordpress
  public createdAt!: Date
  public updatedAt!: Date
}

export type IPageModel = RichModelType<typeof Page>
export type IPageDocument = DocumentType<Page>
