import {
  Body, Controller, ForbiddenException, Get, HttpCode, HttpException, HttpStatus, Ip, Post, Req, Res, UseGuards,
} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {Request, Response} from 'express'
import {AdminJwtPayload} from '../../types'
import {AdminAuthDto} from './admin-auth.dto'
import {AdminAuthService} from './admin-auth.service'
import {ADMIN_JWT_COOKIE, AdminGuard, issueAdminCookie, OptionalAdminGuard} from './admin.guard'

const LOGIN_MAX_FAILURES = 10
const LOGIN_WINDOW_MS = 15 * 60 * 1000

@Controller('api/admin/user')
export class AdminAuthController {
  // 进程内失败计数，仅适用单实例部署；按 ip+username 限速防止在线爆破
  private readonly loginFailures = new Map<string, {count: number, expireAt: number}>()

  constructor(
    private readonly adminAuthService: AdminAuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() body: AdminAuthDto, @Res({passthrough: true}) res: Response,
    @Ip() ip: string): Promise<AdminJwtPayload> {
    const key = `${ip}:${body.username}`
    this.pruneFailures()
    const record = this.loginFailures.get(key)
    if (record && record.count >= LOGIN_MAX_FAILURES) {
      throw new HttpException('尝试过于频繁，请稍后再试', HttpStatus.TOO_MANY_REQUESTS)
    }
    try {
      const admin = await this.adminAuthService.login(body.username, body.password)
      this.loginFailures.delete(key)
      const payload: AdminJwtPayload = {sub: String(admin._id), username: admin.username}
      issueAdminCookie(res, this.configService, payload)
      return payload
    } catch (err) {
      if (err instanceof ForbiddenException) {
        const current = this.loginFailures.get(key) ?? {count: 0, expireAt: 0}
        current.count += 1
        current.expireAt = Date.now() + LOGIN_WINDOW_MS
        this.loginFailures.set(key, current)
      }
      throw err
    }
  }

  // 续签由 AdminGuard 在每个已认证请求上完成
  @Get('login')
  @UseGuards(AdminGuard)
  public checkLogin(@Req() req: Request): AdminJwtPayload {
    return req.user!
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(OptionalAdminGuard)
  public logout(@Req() req: Request, @Res({passthrough: true}) res: Response): void {
    if (req.user) res.clearCookie(ADMIN_JWT_COOKIE, {path: '/api'})
  }

  private pruneFailures(): void {
    const now = Date.now()
    for (const [key, record] of this.loginFailures) {
      if (record.expireAt <= now) {
        this.loginFailures.delete(key)
      }
    }
  }
}
