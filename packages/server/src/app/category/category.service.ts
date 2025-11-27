import {IdType} from '@bangbang93/utils/mongodb'
import {InjectModel} from '@bangbang93/utils/nest-mongo'
import {Injectable} from '@nestjs/common'
import {Category, ICategoryDocument, ICategoryModel} from './category.model'

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private readonly categoryModel: ICategoryModel,
  ) {}

  public async getById(id: IdType): Promise<ICategoryDocument | null> {
    return await this.categoryModel.findById(id)
  }

  public async create(name: string, parentId?: IdType): Promise<ICategoryDocument> {
    return await this.categoryModel.add({name, parentId})
  }

  public async listAll(): Promise<ICategoryDocument[]> {
    return await this.categoryModel.find()
  }

  public async listTree(): Promise<ICategoryDocument[]> {
    const root = await this.categoryModel.listRoot()
    async function bfs(root: ICategoryDocument[]): Promise<void> {
      const promises = []
      for (const category of root) {
        if (category.children.length) {
          promises.push(category.populate('children'))
        }
      }
      if (promises.length === 0) {
        return
      }
      const populatedDoc = await Promise.all(promises)
      for (const doc of populatedDoc) {
        await bfs(doc.children as ICategoryDocument[])
      }
    }
    await bfs(root)
    return root
  }
}
