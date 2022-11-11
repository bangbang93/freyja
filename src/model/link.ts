import {getModel, id, model, ObjectId, prop, required, unique} from 'mongoose-typescript'

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

const Model = getModel(Link)

exports._Model = Model

exports.listAll = async () => Model.find({})
