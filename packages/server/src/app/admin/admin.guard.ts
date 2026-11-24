import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {Request, Response} from 'express'
import {sign, verify} from 'jsonwebtoken'
import ms, {StringValue} from 'ms'
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

export function issueAdminCookie(res: Response, configService: ConfigService, payload: AdminJwtPayload): void {
  const expiresIn = configService.getOrThrow<string>('jwt.expiresIn') as StringValue
  const token = sign(payload, configService.getOrThrow<string>('jwt.secret'), {expiresIn})
  res.cookie(ADMIN_JWT_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: configService.get('NODE_ENV') === 'production',
    path: '/api',
    maxAge: ms(expiresIn),
  })
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  public canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>()
    const user = parseAdminToken(req, this.configService.getOrThrow<string>('jwt.secret'))
    if (!user) throw new UnauthorizedException()
    req.user = user
    // 活跃请求滑动续期
    const res = context.switchToHttp().getResponse<Response>()
    issueAdminCookie(res, this.configService, {sub: user.sub, username: user.username})
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
