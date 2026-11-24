import {Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {Request, Response} from 'express'
import {AdminJwtPayload} from '../../types'
import {AdminAuthDto} from './admin-auth.dto'
import {AdminAuthService} from './admin-auth.service'
import {ADMIN_JWT_COOKIE, AdminGuard, issueAdminCookie, OptionalAdminGuard} from './admin.guard'

@Controller('api/admin/user')
export class AdminAuthController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() body: AdminAuthDto, @Res({passthrough: true}) res: Response): Promise<AdminJwtPayload> {
    const admin = await this.adminAuthService.login(body.username, body.password)
    const payload: AdminJwtPayload = {sub: String(admin._id), username: admin.username}
    issueAdminCookie(res, this.configService, payload)
    return payload
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
}
