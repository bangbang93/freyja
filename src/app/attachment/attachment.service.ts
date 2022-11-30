import {IdType} from '@bangbang93/utils/mongodb'
import {InjectModel} from '@bangbang93/utils/nest-mongo'
import {Injectable} from '@nestjs/common'
import {Attachment, IAttachmentDocument, IAttachmentModel, IAttachmentSchema} from './attachment.model'

@Injectable()
export class AttachmentService {
  constructor(
    @InjectModel(Attachment) private readonly attachmentModel: IAttachmentModel,
  ) {}

  public async create(data: IAttachmentSchema): Promise<IAttachmentDocument> {
    return this.attachmentModel.create(data)
  }

  public async getById(id: IdType): Promise<IAttachmentDocument | null> {
    return this.attachmentModel.findById(id)
  }

  public async listByPage(page: number, limit: number): Promise<IAttachmentDocument[]> {
    const skip = (page - 1) * limit
    return this.attachmentModel.listByPage({skip, limit})
  }

  public async count(): Promise<number> {
    return this.attachmentModel.count()
  }
}
