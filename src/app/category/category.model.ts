import {IdType} from '@bangbang93/utils/mongodb'
import {
  array, DocumentType, getModel, id, model, ObjectId, prop, Ref, ref, RichModelType, statics, subModel, unique,
} from 'mongoose-typescript'

export interface ICategorySchema {
  _id: ObjectId
  name: string
  parent: Ref<Category>
  children: Ref<Category>[]
  wordpress: CategoryWordpress
}

@subModel()
class CategoryWordpress {
  @prop() public id!: number

  @prop() public slug!: string

  @prop() public taxonomyId!: number
}

@model('category', {timestamps: true})
export class Category implements ICategorySchema {
  @id()
  public _id!: ObjectId

  @prop() @unique()
  public name!: string

  @prop() @ref(() => Category, ObjectId)
  public parent!: Ref<Category>

  @array(ObjectId) @ref(() => Category, [ObjectId])
  public children!: Ref<Category>[]

  @prop()
  public wordpress!: CategoryWordpress

  @statics()
  public static async add(
    this: ICategoryModel,
    {name, parentId, wordpress}: {name: string; parentId?: IdType; wordpress?: CategoryWordpress},
  ): Promise<ICategoryDocument> {
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

  @statics()
  public static async getByName(this: ICategoryModel, name: string): Promise<ICategoryDocument | null> {
    return this.findOne({
      name,
    })
  }

  @statics()
  public static async listRoot(this: ICategoryModel): Promise<ICategoryDocument[]> {
    return this.find({parent: null})
  }

  @statics()
  public static async getByWordpress(this: ICategoryModel, key: string,
    value: string): Promise<ICategoryDocument | null> {
    return this.findOne({
      [`wordpress.${key}`]: value,
    })
  }
}

export type ICategoryDocument = DocumentType<Category>
export type ICategoryModel = RichModelType<typeof Category>

export const CategoryModel: ICategoryModel = getModel(Category)
