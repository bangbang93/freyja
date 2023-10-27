import {DocumentType, getModel, id, model, ObjectId, prop, RichModelType, statics} from 'mongoose-typescript'

export interface IAttachmentSchema {
  _id?: ObjectId
  filename: string
  path: string
  mimeType: string
  wordpress?: object

  createdAt?: Date
  updatedAt?: Date
}

@model('attachment', {timestamps: true})
export class Attachment implements IAttachmentSchema {
  @id()
  public _id!: ObjectId

  @prop()
  public filename!: string

  @prop()
  public path!: string

  @prop()
  public mimeType!: string

  @prop(Object)
  public wordpress?: object

  @statics()
  public static async listByPage(
    this: IAttachmentModel,
    {skip = 0, page = 1, limit = 20}: {skip?: number; page?: number; limit?: number} = {},
  ): Promise<IAttachmentDocument[]> {
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
export type IAttachmentModel = RichModelType<typeof Attachment>

export const AttachmentModel: IAttachmentModel = getModel(Attachment)
