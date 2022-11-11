import {Schema, Types} from 'mongoose'
import {DocumentType, getModel, id, Model, model, ModelType, prop, statics} from 'mongoose-typescript'

export interface IAttachmentSchema {
  _id: Types.ObjectId
  filename: string
  path: string
  mimeType: string
  wordpress: object

  createdAt?: Date
  updatedAt?: Date
}

@model('attachment', {timestamps: true})
export class Attachment extends Model<Attachment> implements IAttachmentSchema {
  @id()
  public _id: Types.ObjectId

  @prop()
  public filename: string

  @prop()
  public path: string

  @prop()
  public mimeType: string

  @prop(Object)
  public wordpress: object

  @statics()
  public static async listByPage({skip = 0, page = 1, limit = 20}): Promise<IAttachmentDocument[]> {
    if (!skip) {
      skip = (page - 1) * limit
    }
    return this.find({})
      .sort({_id: -1})
      .skip(skip)
      .limit(limit)
      .exec()
  }
}

export type IAttachmentDocument = DocumentType<Attachment>
export type IAttachmentModel = ModelType<Attachment> & typeof Attachment

export const AttachmentModel: IAttachmentModel = getModel(Attachment)
