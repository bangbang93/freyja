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

  @statics
  public static async listByPage({skip = 0, page = 1, limit = 20}): Promise<IAttachmentDocument[]> {

    if (!skip) {
      skip = (page - 1) * limit
    }
    return Model.find({})
      .sort({_id: -1})
      .skip(skip)
      .limit(limit)
      .exec()
  }

  @id
  public _id: Types.ObjectId
  @prop()
  public filename: string
  @prop()
  public path: string
  @prop()
  public mimeType: string
  @prop(Schema.Types.Mixed)
  public wordpress: object
}

export type IAttachmentDocument = DocumentType<Attachment>
export type IAttachmentModel = ModelType<Attachment> & typeof Attachment

export const AttachmentModel: IAttachmentModel = getModel(Attachment)
