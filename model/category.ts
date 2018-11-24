import {Types, Schema} from 'mongoose'
import {
  array, DocumentType, getModel, id, Model, model, ModelType, prop, Ref, ref, statics, subModel, type, unique,
} from 'mongoose-typescript'

export interface ICategorySchema {
  _id: Types.ObjectId
  name: string
  parent: Ref<Category>
  children: Array<Ref<Category>>
  wordpress: CategoryWordpress
}

@subModel()
class CategoryWordpress {
  @prop() public id: number
  @prop() public slug: string
  @prop() public taxonomyId: number
}

@model('category', {timestamps: true})
export class Category extends Model<Category> implements ICategorySchema {

  @statics
  public static async add({name, parentId, wordpress}): Promise<ICategoryDocument> {
    let parent
    if (parentId) {
      parent = await this.findById(parentId)
      if (!parent) {
        throw new Error('no such parent')
      }
    }
    const category = await this.create({
      name,
      parent: parentId,
      wordpress,
    })
    if (parent) {
      parent.children.push(category._id)
      await parent.save()
    }
    return category
  }

  @statics
  public static async getByName(name): Promise<ICategoryDocument> {
    return this.findOne({
      name,
    })
  }

  @statics
  public static async listRoot(): Promise<ICategoryDocument[]> {
    return this.find({parent: null})
  }

  @statics
  public static async getByWordpress(key: string, value: string) {
    return this.findOne({
      [`wordpress.${key}`]: value,
    })
  }

  @id
  public _id: Types.ObjectId
  @prop() @unique
  public name: string
  @prop() @ref('category') @type(Schema.Types.ObjectId)
  public parent: Ref<Category>
  @array(Schema.Types.ObjectId) @ref('category')
  public children: Array<Ref<Category>>
  @prop()
  public wordpress: CategoryWordpress
}

export type ICategoryDocument = DocumentType<Category>
export type ICategoryModel = ModelType<Category> & typeof Category

export const CategoryModel: ICategoryModel = getModel(Category)
