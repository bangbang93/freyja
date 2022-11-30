import {IdType} from '@bangbang93/utils/mongodb'
import {InjectModel} from '@bangbang93/utils/nest-mongo'
import {Injectable} from '@nestjs/common'
import {ITagDocument, ITagModel, Tag} from './tag.model'

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag) private readonly tagModel: ITagModel,
  ) {}

  public async create(title: string): Promise<ITagDocument> {
    return await this.tagModel.findOneAndUpdate({
      title,
    }, {
      $setOnInsert: {
        title,
      },
    }, {
      upsert: true,
    }) as ITagDocument
  }

  public async listAll(): Promise<ITagDocument[]> {
    return this.tagModel.find({})
  }

  public async getById(id: IdType): Promise<ITagDocument | null> {
    return this.tagModel.findById(id)
  }
}
