import {IdType} from '@bangbang93/utils/mongodb'
import {InjectModel} from '@bangbang93/utils/nest-mongo'
import {Injectable} from '@nestjs/common'
import {Admin, IAdminDocument, IAdminModel} from './admin.model'

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private readonly adminModel: IAdminModel,
  ) {}

  public async getById(id: IdType): Promise<IAdminDocument | null> {
    return await this.adminModel.findById(id)
  }
}
