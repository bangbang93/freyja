import {InjectModel} from '@bangbang93/utils/nest-mongo'
import {Injectable} from '@nestjs/common'
import {ILinkDocument, ILinkModel, Link} from './link.model'

@Injectable()
export class LinkService {
  constructor(
    @InjectModel(Link) private readonly linkModel: ILinkModel,
  ) {}

  public async listAll(): Promise<ILinkDocument[]> {
    return await this.linkModel.find({})
  }
}
