import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {Request} from 'express'
import {verify} from 'jsonwebtoken'
import {AdminJwtPayload} from '../../types'

export const ADMIN_JWT_COOKIE = 'freyja.admin.token'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  public canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>()
    const token = req.cookies?.[ADMIN_JWT_COOKIE] as string | undefined
    if (!token) throw new UnauthorizedException()
    try {
      req.user = verify(token, this.configService.getOrThrow<string>('jwt.secret')) as AdminJwtPayload
      return true
    } catch {
      throw new UnauthorizedException()
    }
  }
}
