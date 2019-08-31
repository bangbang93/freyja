import {Types} from 'mongoose'
import {DocumentType, getModel, id, Model, model, ModelType, prop, statics, unique} from 'mongoose-typescript'

export interface IAdminSchema {
  _id: Types.ObjectId
  username: string
  password: string
  email: string
  salt: string
}

@model('admin')
export class Admin extends Model<Admin> implements IAdminSchema {
  @id
  public _id: Types.ObjectId

  @prop() @unique
  public username: string

  @prop()
  public password: string

  @prop()
  public salt: string

  @prop() @unique
  public email: string

  @statics
  public static async getByName(username: string) {
    return this.findOne({
      username,
    })
  }
}

export type IAdminDocument = DocumentType<Admin>
export type IAdminModel = ModelType<Admin> & typeof Admin

export const AdminModel: IAdminModel = getModel(Admin)
