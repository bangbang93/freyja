import {DocumentType, getModel, id, model, ObjectId, prop, required, RichModelType, unique} from 'mongoose-typescript'

export interface ILinkSchema {
  _id: ObjectId
  name: string
  href: string
}

@model('link')
export class Link implements ILinkSchema {
  @id() public _id!: ObjectId
  @prop() @required() @unique() public name!: string
  @prop() @required() public href!: string
}

export type ILinkDocument = DocumentType<Link>
export type ILinkModel = RichModelType<typeof Link>
