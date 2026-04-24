import {IdType} from '@bangbang93/utils/mongodb'
import {createParamDecorator} from '@nestjs/common'
import {Request} from 'express'

export const AdminId = createParamDecorator<IdType | undefined>((data, context) => {
  const request = context.switchToHttp().getRequest<Request>()
  return request.session?.user?._id
})
