import {Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {Request, Response} from 'express'
import {sign} from 'jsonwebtoken'
import ms, {StringValue} from 'ms'
import {AdminJwtPayload} from '../../types'
import {AdminAuthDto} from './admin-auth.dto'
import {AdminAuthService} from './admin-auth.service'
import {ADMIN_JWT_COOKIE, AdminGuard} from './admin.guard'

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
    this.setAuthCookie(res, payload)
    return payload
  }

  @Get('login')
  @UseGuards(AdminGuard)
  public checkLogin(@Req() req: Request, @Res({passthrough: true}) res: Response): AdminJwtPayload {
    const {sub, username} = req.user!
    const payload: AdminJwtPayload = {sub, username}
    this.setAuthCookie(res, payload)
    return payload
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  public logout(@Res({passthrough: true}) res: Response): void {
    res.clearCookie(ADMIN_JWT_COOKIE, {path: '/api'})
  }

  private setAuthCookie(res: Response, payload: AdminJwtPayload): void {
    const expiresIn = this.configService.getOrThrow<string>('jwt.expiresIn') as StringValue
    const token = sign(payload, this.configService.getOrThrow<string>('jwt.secret'), {expiresIn})
    res.cookie(ADMIN_JWT_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.configService.get('NODE_ENV') === 'production',
      path: '/api',
      maxAge: ms(expiresIn),
    })
  }
}
