import {Types} from 'mongoose'
import {
  array, DocumentType, getModel, id, Model, model, ModelType, ObjectId, prop, Ref, ref, statics, subModel, unique,
} from 'mongoose-typescript'

export interface ICategorySchema {
  _id: Types.ObjectId
  name: string
  parent: Ref<Category>
  children: Ref<Category>[]
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
  @id
  public _id: Types.ObjectId

  @prop() @unique
  public name: string

  @prop() @ref(() => Category, ObjectId)
  public parent: Ref<Category>

  @array(ObjectId) @ref(() => Category, [ObjectId])
  public children: Ref<Category>[]

  @prop()
  public wordpress: CategoryWordpress

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
}

export type ICategoryDocument = DocumentType<Category>
export type ICategoryModel = ModelType<Category> & typeof Category

export const CategoryModel: ICategoryModel = getModel(Category)
