import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {Request} from 'express'
import {verify} from 'jsonwebtoken'
import {AdminJwtPayload} from '../../types'

export const ADMIN_JWT_COOKIE = 'freyja.admin.token'

export function parseAdminToken(req: Request, secret: string): AdminJwtPayload | undefined {
  const token = req.cookies?.[ADMIN_JWT_COOKIE] as string | undefined
  if (!token) return undefined
  try {
    return verify(token, secret) as AdminJwtPayload
  } catch {
    return undefined
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  public canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>()
    const user = parseAdminToken(req, this.configService.getOrThrow<string>('jwt.secret'))
    if (!user) throw new UnauthorizedException()
    req.user = user
    return true
  }
}

// 永远放行；cookie 中有有效 token 时填充 req.user，否则按匿名处理
@Injectable()
export class OptionalAdminGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  public canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>()
    const user = parseAdminToken(req, this.configService.getOrThrow<string>('jwt.secret'))
    if (user) req.user = user
    return true
  }
}
