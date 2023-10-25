import {InjectModel} from '@bangbang93/utils/nest-mongo'
import {ForbiddenException, Injectable} from '@nestjs/common'
import {compare, hash} from 'bcrypt'
import {Admin, IAdminDocument, IAdminModel, IAdminSchema} from './admin.model'

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectModel(Admin) private readonly adminModel: IAdminModel,
  ) {}

  public async login(username: string, password: string): Promise<Partial<IAdminSchema>> {
    const admin = await this.adminModel.findOne({username}) as IAdminDocument
    if (!admin) throw new ForbiddenException('用户名或密码错误')
    const compareResult = await compare(password, admin.password)
    if (!compareResult) throw new ForbiddenException('用户名或密码错误')
    return {
      ...admin.toObject(),
      password: undefined,
    }
  }

  public async create(username: string, password: string): Promise<Partial<IAdminSchema>> {
    return this.adminModel.create({
      username,
      password: await hash(password, 11),
    })
  }
}
