import {DocumentType, id, model, ObjectId, prop, RichModelType, statics, unique} from 'mongoose-typescript'

export interface IAdminSchema {
  _id: ObjectId
  username: string
  password: string
  email: string
  salt: string
}

@model('admin')
export class Admin implements IAdminSchema {
  @id()
  public _id!: ObjectId

  @prop() @unique()
  public username!: string

  @prop()
  public password!: string

  @prop()
  public salt!: string

  @prop() @unique()
  public email!: string

  @statics()
  public static async getByName(this: IAdminModel, username: string): Promise<IAdminDocument | null> {
    return this.findOne({
      username,
    })
  }
}

export type IAdminDocument = DocumentType<Admin>
export type IAdminModel = RichModelType<typeof Admin>
